# AuditOS Database Schema

## Design Principles
The schema is organized around a shared audit core plus optional industry-specific extensions. The core entities are client, engagement, imported workbook, request, process, document, observation, and report.

## Core Tables

### clients
Purpose: stores client master data.
Fields:
- id
- name
- industry
- sector
- auditType
- partnerName
- managerName
- teamMembers
- plantLocations
- status
- remarks
- createdAt
- updatedAt

### engagements
Purpose: stores audit engagements under a client.
Fields:
- id
- clientId
- financialYear
- scope
- auditTeam
- status
- startDate
- endDate
- progress
- createdAt
- updatedAt

### auditProcesses
Purpose: stores the audit processes or workstreams that belong to an engagement.
Fields:
- id
- engagementId
- processName
- category
- industryContext
- riskLevel
- status
- createdAt
- updatedAt

### importedWorkbooks
Purpose: stores uploaded workbook metadata and the original workbook payload.
Fields:
- id
- engagementId
- fileName
- sourceType
- uploadedAt
- workbookData
- clientName
- auditDate
- sheetNames
- createdAt
- updatedAt

### importedWorkbookSheets
Purpose: stores worksheet-level parsed information.
Fields:
- id
- workbookId
- sheetName
- headerRowIndex
- headerRow
- rowCount
- columnCount
- previewRows
- createdAt
- updatedAt

### dataRequests
Purpose: stores data request tracker records derived from uploaded workbooks.
Fields:
- id
- engagementId
- processId
- requestId
- process
- subProcess
- description
- purpose
- priority
- raisedDate
- requiredDate
- status
- clientOwner
- email
- followUpCount
- attachmentIds
- remarks
- createdAt
- updatedAt

### requestProcessLinks
Purpose: links each request to a specific audit process.
Fields:
- id
- requestId
- processId
- createdAt

### documents
Purpose: stores evidence or support documents associated with clients, engagements, requests, samples, or observations.
Fields:
- id
- entityType
- entityId
- filename
- fileType
- mimeType
- fileSize
- data
- metadata
- createdAt
- updatedAt

### risks
Purpose: stores industry-aware risks relevant to a process or engagement.
Fields:
- id
- engagementId
- processId
- riskName
- severity
- description
- createdAt
- updatedAt

### controls
Purpose: stores controls associated with a process or risk.
Fields:
- id
- engagementId
- processId
- controlName
- description
- controlType
- createdAt
- updatedAt

### testingProcedures
Purpose: stores suggested or defined testing procedures for a process.
Fields:
- id
- engagementId
- processId
- procedureName
- guidance
- status
- createdAt
- updatedAt

### samples
Purpose: stores sample guidance and sample selections.
Fields:
- id
- engagementId
- processId
- sampleId
- auditArea
- risk
- testingStatus
- observation
- reviewerComments
- evidenceIds
- closureDate
- createdAt
- updatedAt

### observations
Purpose: stores audit observations and findings.
Fields:
- id
- engagementId
- processId
- sampleId
- condition
- criteria
- cause
- impact
- recommendation
- managementResponse
- riskRating
- status
- createdAt
- updatedAt

### workingPapers
Purpose: stores generated working papers and related content.
Fields:
- id
- engagementId
- title
- type
- content
- linkedRequestIds
- linkedSampleIds
- linkedObservationIds
- createdAt
- updatedAt

### reports
Purpose: stores generated report summaries and exports.
Fields:
- id
- engagementId
- reportType
- status
- content
- generatedAt
- createdAt
- updatedAt

## Industry Extensions
Industry-specific logic should be stored separately from the core schema using curated rule packs:
- industryProfiles
- processLibraries
- controlLibraries
- sampleGuidanceLibraries

These can be versioned and attached to engagements by industry type.

## Relationships
- One client has many engagements.
- One engagement has many audit processes.
- One engagement has many data requests.
- One data request belongs to one process and one engagement.
- One imported workbook belongs to one engagement and may generate many requests.
- One document may be linked to many entities.
- One observation may link to one sample and one process.
