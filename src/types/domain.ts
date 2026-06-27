export type ThemeMode = 'light' | 'dark'

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface ClientEntity extends BaseEntity {
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

export interface EngagementEntity extends BaseEntity {
  clientId: string
  financialYear?: string
  scope?: string
  auditTeam?: string[]
  status: 'Planned' | 'In Progress' | 'Closed'
  startDate?: string
  endDate?: string
  progress?: number
}

export interface DataRequestEntity extends BaseEntity {
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

export interface SampleEntity extends BaseEntity {
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

export interface ObservationEntity extends BaseEntity {
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

export interface ChecklistEntity extends BaseEntity {
  category: string
  objective?: string
  risk?: string
  procedure?: string
  evidence?: string
  redFlags?: string
  workingPaperReference?: string
}

export interface DocumentEntity extends BaseEntity {
  entityType: 'Client' | 'Engagement' | 'Request' | 'Sample' | 'Observation'
  entityId: string
  filename: string
  fileType: 'Excel' | 'PDF' | 'Word' | 'Image'
  mimeType?: string
  fileSize?: number
  data?: string
  metadata?: Record<string, unknown>
}

export interface WorkingPaperEntity extends BaseEntity {
  engagementId: string
  title: string
  type: 'Paper' | 'Memo' | 'Minutes' | 'Summary' | 'Sheet'
  content?: string
  linkedRequestIds?: string[]
  linkedSampleIds?: string[]
  linkedObservationIds?: string[]
}

export interface EmailTemplateEntity extends BaseEntity {
  type: 'DataRequest' | 'Reminder' | 'Escalation' | 'SampleRequest' | 'Clarification' | 'Closure'
  subject: string
  bodyTemplate: string
  isDefault: boolean
}
