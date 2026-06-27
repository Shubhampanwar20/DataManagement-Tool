export interface WorkbookMetadata {
  clientName?: string;
  auditPeriod?: string;
  financialYear?: string;
  auditType?: string;
}

export interface SheetInfo {
  name: string;
  rowCount: number;
  columnCount: number;
}

export interface WorkbookAnalysis {
  workbookName: string;
  metadata: WorkbookMetadata;
  sheets: SheetInfo[];
}