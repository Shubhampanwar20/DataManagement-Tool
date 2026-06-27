import * as XLSX from "xlsx";

import type {
  WorkbookAnalysis,
  SheetInfo,
} from "../types/workbook.types";

export class WorkbookAnalyzer {
  /**
   * Analyze an uploaded Excel workbook.
   */
  public analyze(file: ArrayBuffer): WorkbookAnalysis {
    // Read workbook
    const workbook = XLSX.read(file, {
      type: "array",
    });

    // Extract information about every sheet
    const sheets: SheetInfo[] = workbook.SheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];

      const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");

      return {
        name: sheetName,
        rowCount: range.e.r + 1,
        columnCount: range.e.c + 1,
      };
    });

    // Return workbook analysis
    return {
      workbookName: "Uploaded Workbook",
      metadata: {
        clientName: "",
        auditPeriod: "",
        financialYear: "",
        auditType: "",
      },
      sheets,
    };
  }
}