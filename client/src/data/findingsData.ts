export type FindingSeverity = 'Major' | 'Minor' | 'Observation';
export type FindingStatus = 'Open' | 'In Review' | 'Closed';

export interface Finding {
  id: string;
  auditId: string;
  title: string;
  department: string;
  severity: FindingSeverity;
  status: FindingStatus;
  dateFound: string;
  dueDate: string;
  assignee: string;
  description: string;
}

export const findings: Finding[] = [
  { id: 'F-001', auditId: 'A-001', title: 'Unpatched server OS versions',            department: 'IT',         severity: 'Major',       status: 'Open',      dateFound: '2024-01-15', dueDate: '2024-02-15', assignee: 'Alice Chen',  description: 'Several production servers are running OS versions with known CVEs.' },
  { id: 'F-002', auditId: 'A-001', title: 'Missing MFA on admin accounts',           department: 'IT',         severity: 'Major',       status: 'In Review', dateFound: '2024-01-16', dueDate: '2024-02-10', assignee: 'Bob Martinez', description: 'Administrative accounts lack multi-factor authentication enforcement.' },
  { id: 'F-003', auditId: 'A-002', title: 'Consent records incomplete',              department: 'Legal',      severity: 'Minor',       status: 'Open',      dateFound: '2024-02-07', dueDate: '2024-03-07', assignee: 'Carol Singh', description: 'GDPR consent records for EU customers are missing timestamps.' },
  { id: 'F-004', auditId: 'A-003', title: 'Expense approval bypassed on 3 items',   department: 'Finance',    severity: 'Major',       status: 'Open',      dateFound: '2024-01-28', dueDate: '2024-02-14', assignee: 'David Lee',   description: 'Three expense reports were approved without secondary sign-off.' },
  { id: 'F-005', auditId: 'A-003', title: 'Reconciliation delay >5 days',           department: 'Finance',    severity: 'Minor',       status: 'Closed',    dateFound: '2024-01-29', dueDate: '2024-02-05', assignee: 'Eve Johnson', description: 'Monthly bank reconciliation was completed 6 days past deadline.' },
  { id: 'F-006', auditId: 'A-005', title: 'Fire extinguisher inspection overdue',    department: 'Operations', severity: 'Major',       status: 'Open',      dateFound: '2024-01-18', dueDate: '2024-01-25', assignee: 'Frank Wu',    description: 'Quarterly fire extinguisher inspection was not conducted on schedule.' },
  { id: 'F-007', auditId: 'A-005', title: 'PPE not worn in restricted zone',         department: 'Operations', severity: 'Observation', status: 'Closed',    dateFound: '2024-01-19', dueDate: '2024-02-01', assignee: 'Grace Kim',   description: 'Staff observed in restricted zone without required PPE during site visit.' },
  { id: 'F-008', auditId: 'A-006', title: 'CRM access not revoked for ex-employee', department: 'Sales',      severity: 'Major',       status: 'In Review', dateFound: '2024-02-12', dueDate: '2024-02-19', assignee: 'Alice Chen',  description: 'Terminated employee still has active CRM login credentials.' },
];
