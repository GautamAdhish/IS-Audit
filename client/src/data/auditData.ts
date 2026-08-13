export interface Audit {
  id: string;
  title: string;
  department: string;
  auditor: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Overdue';
  startDate: string;
  endDate: string;
  compliance: number;
  findings: number;
}

export const audits: Audit[] = [
  { id: 'A-001', title: 'ISO 27001 Annual Audit',        department: 'IT',         auditor: 'Alice Chen',    status: 'Completed',   startDate: '2024-01-10', endDate: '2024-01-20', compliance: 91, findings: 4  },
  { id: 'A-002', title: 'GDPR Compliance Review',        department: 'Legal',      auditor: 'Bob Martinez',  status: 'In Progress', startDate: '2024-02-05', endDate: '2024-02-15', compliance: 78, findings: 7  },
  { id: 'A-003', title: 'Financial Controls Audit',      department: 'Finance',    auditor: 'Carol Singh',   status: 'Overdue',     startDate: '2024-01-25', endDate: '2024-02-01', compliance: 65, findings: 12 },
  { id: 'A-004', title: 'HR Policy Compliance',          department: 'HR',         auditor: 'David Lee',     status: 'Planned',     startDate: '2024-03-01', endDate: '2024-03-10', compliance: 0,  findings: 0  },
  { id: 'A-005', title: 'Operations Safety Review',      department: 'Operations', auditor: 'Eve Johnson',   status: 'Completed',   startDate: '2024-01-15', endDate: '2024-01-22', compliance: 72, findings: 9  },
  { id: 'A-006', title: 'Sales Data Handling Audit',     department: 'Sales',      auditor: 'Frank Wu',      status: 'In Progress', startDate: '2024-02-10', endDate: '2024-02-20', compliance: 68, findings: 5  },
  { id: 'A-007', title: 'IT Security Patch Review',      department: 'IT',         auditor: 'Alice Chen',    status: 'Completed',   startDate: '2024-01-28', endDate: '2024-02-03', compliance: 95, findings: 2  },
  { id: 'A-008', title: 'Vendor Risk Assessment',        department: 'Operations', auditor: 'Grace Kim',     status: 'Planned',     startDate: '2024-03-05', endDate: '2024-03-15', compliance: 0,  findings: 0  },
];
