export interface BaseRecord {
  id: string
  createdAt: string
  updatedAt: string
}

export interface ClientRecord extends BaseRecord {
  name: string
  industry: string
  sector: string
  auditType?: string
  partnerName?: string
  managerName?: string
  teamMembers?: Array<{ id: string; name: string; email: string; role: string }>
  plantLocations?: string[]
  remarks?: string
  status: 'Active' | 'Inactive' | 'Pending'
  logo?: string
}

export interface EngagementRecord extends BaseRecord {
  clientId: string
  financialYear?: string
  scope?: string
  auditTeam?: string[]
  status: 'Planned' | 'In Progress' | 'Closed'
  startDate?: string
  endDate?: string
  progress?: number
}

export interface DataRequestRecord extends BaseRecord {
  engagementId: string
  requestId?: string
  process?: string
  subProcess?: string
  description?: string
  purpose?: string
  priority: 'High' | 'Medium' | 'Low'
  raisedDate?: string
  requiredDate?: string
  status: 'Open' | 'In Progress' | 'Closed'
  clientOwner?: string
  email?: string
  followUpCount?: number
  attachmentIds?: string[]
  remarks?: string
}

export interface SampleRecord extends BaseRecord {
  engagementId: string
  sampleId?: string
  auditArea?: string
  risk?: 'High' | 'Medium' | 'Low'
  control?: string
  population?: number
  sampleSize?: number
  selectionMethod?: string
  testingStatus: 'Pending' | 'In Progress' | 'Tested' | 'Closed'
  observation?: string
  reviewerComments?: string
  evidenceIds?: string[]
  observationIds?: string[]
  closureDate?: string
}

export interface ObservationRecord extends BaseRecord {
  engagementId: string
  sampleId?: string
  condition?: string
  criteria?: string
  cause?: string
  impact?: string
  recommendation?: string
  managementResponse?: string
  riskRating: 'High' | 'Medium' | 'Low'
  status: 'Open' | 'Acknowledged' | 'Closed'
}

export interface ChecklistRecord extends BaseRecord {
  category: string
  objective?: string
  risk?: string
  procedure?: string
  evidence?: string
  redFlags?: string
  workingPaperReference?: string
}

export interface DocumentRecord extends BaseRecord {
  entityType: 'Client' | 'Engagement' | 'Request' | 'Sample' | 'Observation'
  entityId: string
  filename: string
  fileType: 'Excel' | 'PDF' | 'Word' | 'Image'
  mimeType?: string
  fileSize?: number
  data?: string
  metadata?: Record<string, unknown>
}

export interface WorkingPaperRecord extends BaseRecord {
  engagementId: string
  title: string
  type: 'Paper' | 'Memo' | 'Minutes' | 'Summary' | 'Sheet'
  content?: string
  linkedRequestIds?: string[]
  linkedSampleIds?: string[]
  linkedObservationIds?: string[]
}

export interface EmailTemplateRecord extends BaseRecord {
  type: 'DataRequest' | 'Reminder' | 'Escalation' | 'SampleRequest' | 'Clarification' | 'Closure'
  subject: string
  bodyTemplate: string
  isDefault: boolean
}

export interface ObservationTemplateRecord extends BaseRecord {
  category: string
  template: Record<string, unknown>
  tags?: string[]
}

export interface ImportMappingRecord extends BaseRecord {
  clientId?: string
  sourceFormat: 'DataRequest' | 'Sample' | 'Observation' | 'Custom'
  mappingRules: Record<string, unknown>
  confidence?: number
  lastUsed?: string
  isDefault: boolean
}

export interface ProcessSummaryEntry {
  process: string
  totalItems: number
  received: number
  pending: number
  partiallyReceived: number
  remarks: string
}

export interface ImportSessionRecord extends BaseRecord {
  fileName: string
  sourceType: 'xlsx' | 'xls'
  sheetCount: number
  totalRows: number
  totalColumns: number
  clientName?: string
  auditDate?: string
  workbookData?: string
  processSummary?: ProcessSummaryEntry[]
  sheets: Array<{
    name: string
    rowCount: number
    columnCount: number
    headerRowIndex: number
    header: string[]
  }>
}

export interface ImportedRowRecord extends BaseRecord {
  importSessionId: string
  sheetName: string
  rowIndex: number
  values: string[]
  isHeader: boolean
  isBlank: boolean
}
