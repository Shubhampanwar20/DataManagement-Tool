export interface ImportMappingRule {
  sourceColumn: string
  targetField: string
  confidence: number
}

export interface ImportPreviewRow {
  rowNumber: number
  values: Record<string, string>
}

export interface ImportValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}
