import Dexie, { type Table } from 'dexie'
import type { ClientRecord, DataRequestRecord, DocumentRecord, EngagementRecord, EmailTemplateRecord, ImportMappingRecord, ImportSessionRecord, ImportedRowRecord, ObservationRecord, ObservationTemplateRecord, SampleRecord, WorkingPaperRecord, ChecklistRecord } from './types'

export class AuditOSDatabase extends Dexie {
  clients!: Table<ClientRecord>
  engagements!: Table<EngagementRecord>
  dataRequests!: Table<DataRequestRecord>
  samples!: Table<SampleRecord>
  observations!: Table<ObservationRecord>
  checklists!: Table<ChecklistRecord>
  documents!: Table<DocumentRecord>
  workingPapers!: Table<WorkingPaperRecord>
  emailTemplates!: Table<EmailTemplateRecord>
  observationTemplates!: Table<ObservationTemplateRecord>
  importMappings!: Table<ImportMappingRecord>
  importSessions!: Table<ImportSessionRecord>
  importedRows!: Table<ImportedRowRecord>

  constructor() {
    super('AuditOSDatabase')
    this.version(2).stores({
      clients: 'id, name, status, industry, sector, createdAt, updatedAt',
      engagements: 'id, clientId, status, financialYear, startDate, endDate, createdAt, updatedAt',
      dataRequests: 'id, engagementId, status, priority, raisedDate, requiredDate, createdAt, updatedAt',
      samples: 'id, engagementId, testingStatus, risk, createdAt, updatedAt',
      observations: 'id, engagementId, sampleId, status, riskRating, createdAt, updatedAt',
      checklists: 'id, category, createdAt, updatedAt',
      documents: 'id, entityType, entityId, fileType, uploadedAt',
      workingPapers: 'id, engagementId, type, createdAt, updatedAt',
      emailTemplates: 'id, type, isDefault, createdAt, updatedAt',
      observationTemplates: 'id, category, createdAt, updatedAt',
      importMappings: 'id, clientId, sourceFormat, isDefault, lastUsed, createdAt, updatedAt',
      importSessions: 'id, fileName, sourceType, sheetCount, totalRows, totalColumns, createdAt, updatedAt',
      importedRows: 'id, importSessionId, sheetName, rowIndex, isHeader, isBlank, createdAt, updatedAt',
    })
  }
}

export const db = new AuditOSDatabase()
