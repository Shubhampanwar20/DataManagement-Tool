import { useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { FeatureLayout } from '../../layouts/FeatureLayout'
import { useDatabase } from '../../hooks/useDatabase'
import { useNotification } from '../../hooks/useNotification'
import { parseWorkbookFile, persistImportedWorkbook, type ImportWorkbookResult, type SheetPreview } from './importEngine'
import './excel-import.css'

const ExcelImportPage = () => {
  const { dbReady } = useDatabase()
  const { notify } = useNotification()
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<ImportWorkbookResult | null>(null)
  const [sheets, setSheets] = useState<SheetPreview[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string>('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const selectedSheetPreview = useMemo(() => {
    if (!selectedSheet) {
      return null
    }

    return sheets.find((sheet) => sheet.name === selectedSheet) ?? null
  }, [selectedSheet, sheets])

  const processSummaryTotals = useMemo(() => {
    if (!importResult) {
      return null
    }

    const totalItems = importResult.processSummary.reduce((sum, item) => sum + item.totalItems, 0)
    const totalReceived = importResult.processSummary.reduce((sum, item) => sum + item.received, 0)
    const totalPending = importResult.processSummary.reduce((sum, item) => sum + item.pending, 0)
    const totalPartial = importResult.processSummary.reduce((sum, item) => sum + item.partiallyReceived, 0)

    return {
      processes: importResult.processSummary.length,
      items: totalItems,
      received: totalReceived,
      pending: totalPending,
      partial: totalPartial,
    }
  }, [importResult])

  const handleFiles = async (files: FileList | File[]) => {
    const [file] = Array.from(files)

    if (!file) {
      return
    }

    const extension = file.name.toLowerCase()
    if (!extension.endsWith('.xlsx') && !extension.endsWith('.xls')) {
      setStatus({ type: 'error', message: 'Please upload a .xlsx or .xls file.' })
      return
    }

    setSelectedFile(file)
    setIsImporting(true)
    setStatus(null)

    try {
      const parsed = await parseWorkbookFile(file)
      setImportResult(parsed)
      setSheets(parsed.sheets)
      setSelectedSheet(parsed.sheets[0]?.name ?? '')
      setStatus({ type: 'success', message: `Detected ${parsed.sheetCount} sheet(s) and ${parsed.totalRows} row(s).` })
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'The workbook could not be parsed.' })
    } finally {
      setIsImporting(false)
    }
  }

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files) {
      void handleFiles(files)
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    if (event.dataTransfer.files?.length) {
      void handleFiles(event.dataTransfer.files)
    }
  }

  const handleImport = async () => {
    if (!selectedFile || sheets.length === 0) {
      return
    }

    setIsImporting(true)

    try {
      const parsed = await parseWorkbookFile(selectedFile)
      const persisted = await persistImportedWorkbook(selectedFile, parsed)
      setStatus({
        type: 'success',
        message: `Imported ${persisted.rows.length} preview rows from ${parsed.sheetCount} sheet(s) into your offline database.`,
      })
      notify('Excel import stored successfully in your offline database.', 'success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The import could not be completed.'
      setStatus({ type: 'error', message })
      notify(message, 'error')
    } finally {
      setIsImporting(false)
    }
  }

  if (!dbReady) {
    return (
      <FeatureLayout title="Upload Excel" description="Upload client workbooks and inspect the sheet structure before any mapping is applied.">
        <div className="excel-import-shell">
          <section className="excel-import-card">
            <div className="empty-state">Preparing the offline storage layer…</div>
          </section>
        </div>
      </FeatureLayout>
    )
  }

  return (
    <FeatureLayout title="Upload Excel" description="Upload workbooks, inspect worksheets, preview rows, and store the import locally in Dexie.">
      <div className="excel-import-shell">
        <section className="excel-import-card">
          <div
            className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                inputRef.current?.click()
              }
            }}
          >
            <strong>Upload Excel workbook</strong>
            <span>Drag and drop a workbook here or click to browse.</span>
            <span className="eyebrow">Supports .xlsx and .xls</span>
            <input ref={inputRef} className="hidden-input" type="file" accept=".xlsx,.xls" onChange={handleFileSelection} />
          </div>
        </section>

        {status ? (
          <div className={`status-banner status-banner--${status.type}`}>{status.message}</div>
        ) : null}

        {importResult ? (
          <>
            <section className="excel-import-card excel-import-summary">
              <article className="summary-card">
                <span>Total sheets</span>
                <strong>{importResult.sheetCount}</strong>
              </article>
              <article className="summary-card">
                <span>Total rows</span>
                <strong>{importResult.totalRows}</strong>
              </article>
              <article className="summary-card">
                <span>Total columns</span>
                <strong>{importResult.totalColumns}</strong>
              </article>
              <article className="summary-card">
                <span>Client</span>
                <strong>{importResult.clientName || 'Not detected'}</strong>
              </article>
              <article className="summary-card">
                <span>Audit date</span>
                <strong>{importResult.auditDate || 'Not detected'}</strong>
              </article>
            </section>

            {processSummaryTotals ? (
              <section className="excel-import-card">
                <h3>Process summary dashboard</h3>
                <div className="excel-import-summary" style={{ marginTop: '0.85rem' }}>
                  <article className="summary-card">
                    <span>Processes</span>
                    <strong>{processSummaryTotals.processes}</strong>
                  </article>
                  <article className="summary-card">
                    <span>Total items</span>
                    <strong>{processSummaryTotals.items}</strong>
                  </article>
                  <article className="summary-card">
                    <span>Received</span>
                    <strong>{processSummaryTotals.received}</strong>
                  </article>
                  <article className="summary-card">
                    <span>Pending</span>
                    <strong>{processSummaryTotals.pending}</strong>
                  </article>
                  <article className="summary-card">
                    <span>Partially received</span>
                    <strong>{processSummaryTotals.partial}</strong>
                  </article>
                </div>

                <div style={{ overflowX: 'auto', marginTop: '0.9rem' }}>
                  <table className="preview-table">
                    <thead>
                      <tr>
                        <th>Process</th>
                        <th>Total Items</th>
                        <th>Received</th>
                        <th>Pending</th>
                        <th>Partially Received</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importResult.processSummary.map((row) => (
                        <tr key={`${row.process}-${row.remarks}`}>
                          <td>{row.process}</td>
                          <td>{row.totalItems}</td>
                          <td>{row.received}</td>
                          <td>{row.pending}</td>
                          <td>{row.partiallyReceived}</td>
                          <td>{row.remarks || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}
          </>
        ) : null}

        {sheets.length > 0 ? (
          <section className="excel-import-card">
            <h3>Worksheets</h3>
            <div className="sheet-list" style={{ marginTop: '0.75rem' }}>
              {sheets.map((sheet) => (
                <button
                  key={sheet.name}
                  type="button"
                  className={`sheet-pill ${selectedSheet === sheet.name ? 'is-active' : ''}`}
                  onClick={() => setSelectedSheet(sheet.name)}
                >
                  {sheet.name}
                </button>
              ))}
            </div>

            {selectedSheetPreview ? (
              <div style={{ marginTop: '1rem' }}>
                <h3>{selectedSheetPreview.name}</h3>
                <p className="feature-layout__description">
                  Header row detected automatically. Blank rows are ignored and merged cells are expanded where possible.
                </p>
                <div style={{ overflowX: 'auto', marginTop: '0.8rem' }}>
                  <table className="preview-table">
                    <thead>
                      <tr>
                        {selectedSheetPreview.header.map((column, index) => (
                          <th key={`${column}-${index}`}>{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSheetPreview.previewRows.map((row, rowIndex) => (
                        <tr key={`${selectedSheetPreview.name}-${rowIndex}`}>
                          {row.map((cell, cellIndex) => (
                            <td key={`${selectedSheetPreview.name}-${rowIndex}-${cellIndex}`}>{cell || '—'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="excel-import-card">
          <p className="feature-layout__description">
            The original workbook is stored in Dexie so it remains available for future processing and mapping workflows.
          </p>
        </section>

        <section className="excel-import-card excel-import-actions">
          <button type="button" className="secondary-button" onClick={() => { setSelectedFile(null); setImportResult(null); setSheets([]); setSelectedSheet(''); setStatus(null) }}>
            Reset
          </button>
          <button type="button" className="primary-button" onClick={() => void handleImport()} disabled={isImporting || !selectedFile || sheets.length === 0}>
            {isImporting ? 'Importing…' : 'Store import locally'}
          </button>
        </section>
      </div>
    </FeatureLayout>
  )
}

export default ExcelImportPage
