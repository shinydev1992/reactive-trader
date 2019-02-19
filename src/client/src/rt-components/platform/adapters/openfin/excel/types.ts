export interface ExcelInterface {
  blotterSheet: ExcelWorksheet
  positionalSheet: ExcelWorksheet
  excelWorkbook: ExcelWorkbook

  actions: {
    init: () => void
    publishToExcel: (topic: string, message: any) => void
    openExcel: () => void
  }
}

export interface ExcelWorkbook {
  name: string
  close(): Promise<any>
  getWorksheetByName(name: string): ExcelWorksheet
  getWorksheets(): Promise<any>
}

export interface ExcelWorksheet {
  setCells(values: any[][], offset: string): Promise<any>
}
