export type ReportType = 'Audit Summary' | 'Compliance' | 'Risk' | 'CAPA' | 'Findings';
export type ReportStatus = 'Draft' | 'Final' | 'Approved';

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  generatedBy: string;
  generatedDate: string;
  period: string;
  status: ReportStatus;
  pages: number;
}

export const reports: Report[] = [
  { id: 'RP-001', title: 'Q4 2023 ISO 27001 Audit Summary',          type: 'Audit Summary', generatedBy: 'Alice Chen',  generatedDate: '2024-01-25', period: 'Q4 2023',     status: 'Approved', pages: 24 },
  { id: 'RP-002', title: 'Annual Compliance Report 2023',             type: 'Compliance',    generatedBy: 'Bob Martinez', generatedDate: '2024-01-30', period: 'FY 2023',     status: 'Final',    pages: 48 },
  { id: 'RP-003', title: 'Risk Register Summary — Jan 2024',          type: 'Risk',          generatedBy: 'Carol Singh', generatedDate: '2024-02-01', period: 'Jan 2024',    status: 'Approved', pages: 18 },
  { id: 'RP-004', title: 'CAPA Status Report — Q1 2024',              type: 'CAPA',          generatedBy: 'David Lee',   generatedDate: '2024-02-10', period: 'Q1 2024',     status: 'Draft',    pages: 12 },
  { id: 'RP-005', title: 'Findings Tracker — February 2024',          type: 'Findings',      generatedBy: 'Eve Johnson', generatedDate: '2024-02-14', period: 'Feb 2024',    status: 'Draft',    pages: 9  },
  { id: 'RP-006', title: 'Vendor Risk Assessment Report',             type: 'Risk',          generatedBy: 'Grace Kim',   generatedDate: '2024-02-05', period: 'H2 2023',     status: 'Final',    pages: 32 },
];
