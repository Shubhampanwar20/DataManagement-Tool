export const databaseSchema = {
  clients: {
    description: 'Client master records',
    indexes: ['name', 'status', 'industry', 'sector'],
  },
  engagements: {
    description: 'Audit engagement records',
    indexes: ['clientId', 'status', 'financialYear'],
  },
  dataRequests: {
    description: 'Data request tracker records',
    indexes: ['engagementId', 'status', 'priority', 'requiredDate'],
  },
  samples: {
    description: 'Sample tracker records',
    indexes: ['engagementId', 'testingStatus', 'risk'],
  },
  observations: {
    description: 'Observation records',
    indexes: ['engagementId', 'sampleId', 'status', 'riskRating'],
  },
  checklists: {
    description: 'Reusable audit checklist library',
    indexes: ['category'],
  },
  documents: {
    description: 'Organized document repository',
    indexes: ['entityType', 'entityId', 'fileType'],
  },
  workingPapers: {
    description: 'Working papers and reports',
    indexes: ['engagementId', 'type'],
  },
  emailTemplates: {
    description: 'Email template definitions',
    indexes: ['type', 'isDefault'],
  },
  observationTemplates: {
    description: 'Observation template definitions',
    indexes: ['category'],
  },
  importMappings: {
    description: 'Saved Excel import mapping templates',
    indexes: ['clientId', 'sourceFormat', 'isDefault'],
  },
} as const
