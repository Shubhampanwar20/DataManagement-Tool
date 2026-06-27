import * as XLSX from 'xlsx'
import { db } from '../../database/db'
import type { ImportSessionRecord, ImportedRowRecord } from '../../database/types'

export interface SheetPreview {
  name: string
  header: string[]
  previewRows: string[][]
  rows: string[][]
  totalRows: number
  totalColumns: number
  headerRowIndex: number
}

export interface ProcessSummaryEntry {
  process: string
  totalItems: number
  received: number
  pending: number
  partiallyReceived: number
  remarks: string
}

export interface ImportWorkbookResult {
  importId: string
  sheetCount: number
  totalRows: number
  totalColumns: number
  clientName?: string
  auditDate?: string
  processSummary: ProcessSummaryEntry[]
  sheets: SheetPreview[]
}

const normalizeCellValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : ''
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE'
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  return String(value).trim()
}

const isBlankRow = (row: string[]) => row.every((cell) => cell.trim().length === 0)

const getCellValue = (sheet: XLSX.WorkSheet, cellAddress: string) => {
  const cell = sheet[cellAddress]
  return cell?.v
}

const getSheetRows = (sheet: XLSX.WorkSheet) => {
  const ref = sheet['!ref']
  if (!ref) {
    return [] as string[][]
  }

  const range = XLSX.utils.decode_range(ref)
  const rows: string[][] = []

  for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
    const row: string[] = []

    for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex += 1) {
      const address = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })
      const rawValue = getCellValue(sheet, address)
      row.push(normalizeCellValue(rawValue))
    }

    rows.push(row)
  }

  for (const merge of sheet['!merges'] ?? []) {
    const startCell = merge.s
    const endCell = merge.e
    const mergedValue = getCellValue(sheet, XLSX.utils.encode_cell(startCell))

    if (mergedValue === undefined || mergedValue === null) {
      continue
    }

    const normalizedValue = normalizeCellValue(mergedValue)

    for (let rowIndex = startCell.r; rowIndex <= endCell.r; rowIndex += 1) {
      for (let colIndex = startCell.c; colIndex <= endCell.c; colIndex += 1) {
        if (rowIndex === startCell.r && colIndex === startCell.c) {
          continue
        }

        if (!rows[rowIndex]?.[colIndex]) {
          rows[rowIndex][colIndex] = normalizedValue
        }
      }
    }
  }

  const maxColumns = Math.max(...rows.map((row) => row.length), 0)

  return rows.map((row) => {
    if (row.length < maxColumns) {
      return [...row, ...Array.from({ length: maxColumns - row.length }, () => '')]
    }

    return row
  })
}

const detectHeaderRow = (rows: string[][]) => {
  const cleanedRows = rows.filter((row) => !isBlankRow(row))

  if (cleanedRows.length === 0) {
    return { headerRowIndex: 0, header: [] as string[], bodyRows: [] as string[][] }
  }

  const candidates = cleanedRows.map((row, index) => ({
    index,
    row,
    nonEmptyCount: row.filter((cell) => cell.trim().length > 0).length,
  }))

  const bestCandidate = candidates.reduce((best, current) => {
    if (current.nonEmptyCount > best.nonEmptyCount) {
      return current
    }

    return best
  }, candidates[0])

  const header = bestCandidate.row.map((cell, index) => cell.trim() || `Column ${index + 1}`)
  const bodyRows = cleanedRows.filter((_, index) => index !== bestCandidate.index).map((row) => row)

  return {
    headerRowIndex: bestCandidate.index,
    header,
    bodyRows,
  }
}

const detectClientName = (rows: string[][]) => {
  const patterns = [/client(?:\s+name)?/i, /auditee/i, /company/i, /entity/i]

  for (const row of rows) {
    for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
      const cell = row[colIndex] ?? ''
      if (!cell.trim()) {
        continue
      }

      if (patterns.some((pattern) => pattern.test(cell))) {
        const nextCell = row[colIndex + 1] ?? ''
        if (nextCell.trim() && nextCell.trim().length > 1) {
          return nextCell.trim()
        }
      }
    }
  }

  return undefined
}

const detectAuditDate = (rows: string[][]) => {
  const patterns = [/audit date/i, /date/i, /period/i]

  for (const row of rows) {
    for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
      const cell = row[colIndex] ?? ''
      if (!patterns.some((pattern) => pattern.test(cell))) {
        continue
      }

      const candidate = row[colIndex + 1] ?? row[colIndex - 1] ?? ''
      if (!candidate.trim()) {
        continue
      }

      const parsedDate = new Date(candidate)
      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().slice(0, 10)
      }
    }
  }

  return undefined
}

const detectProcessSummary = (rows: string[][]) => {
  const normalizedRows = rows.map((row) => row.map((cell) => normalizeCellValue(cell)))

  for (let rowIndex = 0; rowIndex < normalizedRows.length; rowIndex += 1) {
    const row = normalizedRows[rowIndex]
    const normalizedHeaders = row.map((cell) => cell.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim())

    const processIndex = normalizedHeaders.findIndex((cell) => /process|process name|area/.test(cell))
    const totalIndex = normalizedHeaders.findIndex((cell) => /total items|total/.test(cell))
    const receivedIndex = normalizedHeaders.findIndex((cell) => /received/.test(cell))
    const pendingIndex = normalizedHeaders.findIndex((cell) => /pending/.test(cell))
    const partialIndex = normalizedHeaders.findIndex((cell) => /partial|partially/.test(cell))
    const remarksIndex = normalizedHeaders.findIndex((cell) => /remark|notes/.test(cell))

    if (processIndex < 0 || totalIndex < 0 || receivedIndex < 0 || pendingIndex < 0) {
      continue
    }

    const summaryItems: ProcessSummaryEntry[] = []

    for (let dataIndex = rowIndex + 1; dataIndex < normalizedRows.length; dataIndex += 1) {
      const dataRow = normalizedRows[dataIndex]
      if (dataRow.every((cell) => cell.trim().length === 0)) {
        break
      }

      const processValue = dataRow[processIndex] ?? ''
      if (!processValue.trim()) {
        continue
      }

      summaryItems.push({
        process: processValue.trim(),
        totalItems: Number.parseInt(dataRow[totalIndex] ?? '0', 10) || 0,
        received: Number.parseInt(dataRow[receivedIndex] ?? '0', 10) || 0,
        pending: Number.parseInt(dataRow[pendingIndex] ?? '0', 10) || 0,
        partiallyReceived: Number.parseInt(dataRow[partialIndex] ?? '0', 10) || 0,
        remarks: dataRow[remarksIndex] ?? '',
      })
    }

    if (summaryItems.length > 0) {
      return summaryItems
    }
  }

  return []
}

export const parseWorkbookFile = async (file: File): Promise<ImportWorkbookResult> => {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true })
  const sheets: SheetPreview[] = []
  let totalRows = 0
  let totalColumns = 0
  let clientName: string | undefined
  let auditDate: string | undefined
  const processSummary: ProcessSummaryEntry[] = []

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const rows = getSheetRows(sheet)
    const { headerRowIndex, header, bodyRows } = detectHeaderRow(rows)
    const previewRows = bodyRows.slice(0, 20)

    const sheetPreview: SheetPreview = {
      name: sheetName,
      header,
      previewRows,
      rows: bodyRows,
      totalRows: bodyRows.length,
      totalColumns: Math.max(...bodyRows.map((row) => row.length), header.length),
      headerRowIndex,
    }

    sheets.push(sheetPreview)
    totalRows += sheetPreview.totalRows
    totalColumns = Math.max(totalColumns, sheetPreview.totalColumns)

    if (!clientName) {
      clientName = detectClientName(rows)
    }

    if (!auditDate) {
      auditDate = detectAuditDate(rows)
    }

    if (processSummary.length === 0) {
      const detectedSummary = detectProcessSummary(rows)
      if (detectedSummary.length > 0) {
        processSummary.push(...detectedSummary)
      }
    }
  }

  return {
    importId: crypto.randomUUID(),
    sheetCount: sheets.length,
    totalRows,
    totalColumns,
    clientName,
    auditDate,
    processSummary,
    sheets,
  }
}

export const persistImportedWorkbook = async (
  file: File,
  importResult: ImportWorkbookResult,
): Promise<{ session: ImportSessionRecord; rows: ImportedRowRecord[] }> => {
  const sessionId = importResult.importId
  const importedAt = new Date().toISOString()

  const workbookBuffer = await file.arrayBuffer()
  const workbookData = typeof btoa === 'function'
    ? Array.from(new Uint8Array(workbookBuffer), (byte) => String.fromCharCode(byte)).join('')
    : ''
  const encodedWorkbook = typeof btoa === 'function' ? btoa(workbookData) : ''

  const session: ImportSessionRecord = {
    id: sessionId,
    fileName: file.name,
    sourceType: file.name.toLowerCase().endsWith('.xls') ? 'xls' : 'xlsx',
    sheetCount: importResult.sheetCount,
    totalRows: importResult.totalRows,
    totalColumns: importResult.totalColumns,
    clientName: importResult.clientName,
    auditDate: importResult.auditDate,
    workbookData: encodedWorkbook,
    processSummary: importResult.processSummary,
    sheets: importResult.sheets.map((sheet) => ({
      name: sheet.name,
      rowCount: sheet.totalRows,
      columnCount: sheet.totalColumns,
      headerRowIndex: sheet.headerRowIndex,
      header: sheet.header,
    })),
    createdAt: importedAt,
    updatedAt: importedAt,
  }

  const rowRecords: ImportedRowRecord[] = []

  for (const sheet of importResult.sheets) {
    const rows = sheet.rows.map((row, index) => ({
      id: `${sessionId}-${sheet.name}-${index}`,
      importSessionId: sessionId,
      sheetName: sheet.name,
      rowIndex: index,
      values: row,
      isHeader: index === 0,
      isBlank: row.every((cell) => cell.trim().length === 0),
      createdAt: importedAt,
      updatedAt: importedAt,
    }))

    rowRecords.push(...rows)
  }

  await db.importSessions.put(session)
  if (rowRecords.length > 0) {
    await db.importedRows.bulkAdd(rowRecords)
  }

  return { session, rows: rowRecords }
}
