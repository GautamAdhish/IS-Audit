export type CapaStatus = 'Open' | 'In Progress' | 'Verified' | 'Closed';
export type CapaPriority = 'High' | 'Medium' | 'Low';

export interface Capa {
  id: string;
  findingId: string;
  title: string;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  owner: string;
  dueDate: string;
  status: CapaStatus;
  priority: CapaPriority;
}

export const capas: Capa[] = [
  { id: 'C-001', findingId: 'F-001', title: 'OS Patching Schedule Implementation', rootCause: 'No formal patch management policy in place.', correctiveAction: 'Apply all critical patches within 30 days.', preventiveAction: 'Implement automated patch scanning and monthly review cycle.', owner: 'Alice Chen',  dueDate: '2024-02-15', status: 'In Progress', priority: 'High'   },
  { id: 'C-002', findingId: 'F-002', title: 'MFA Enforcement for Admin Accounts',  rootCause: 'Policy exists but was not enforced technically.', correctiveAction: 'Enable MFA on all admin accounts immediately.', preventiveAction: 'Add MFA compliance check to onboarding checklist.', owner: 'Bob Martinez', dueDate: '2024-02-10', status: 'In Progress', priority: 'High'   },
  { id: 'C-003', findingId: 'F-003', title: 'GDPR Consent Record Remediation',     rootCause: 'Legacy consent form did not capture timestamps.', correctiveAction: 'Backfill timestamps from server logs where possible.', preventiveAction: 'Update consent form to auto-capture timestamp on submission.', owner: 'Carol Singh', dueDate: '2024-03-07', status: 'Open',        priority: 'Medium' },
  { id: 'C-004', findingId: 'F-004', title: 'Expense Approval Control Fix',         rootCause: 'Approval workflow allowed bypass for amounts under $500.', correctiveAction: 'Audit all bypassed approvals and obtain retroactive sign-off.', preventiveAction: 'Remove bypass rule from expense system configuration.', owner: 'David Lee',   dueDate: '2024-02-14', status: 'Open',        priority: 'High'   },
  { id: 'C-005', findingId: 'F-006', title: 'Fire Extinguisher Inspection Catch-up',rootCause: 'Scheduled inspection was not on facility calendar.', correctiveAction: 'Conduct overdue inspection immediately.', preventiveAction: 'Add recurring calendar reminder for facility manager.', owner: 'Eve Johnson', dueDate: '2024-01-30', status: 'Verified',    priority: 'High'   },
  { id: 'C-006', findingId: 'F-008', title: 'Revoke Terminated Employee CRM Access',rootCause: 'IT offboarding checklist was not followed.', correctiveAction: 'Immediately disable the CRM account.', preventiveAction: 'Integrate HR termination workflow with IT access revocation.', owner: 'Frank Wu',    dueDate: '2024-02-19', status: 'Closed',      priority: 'High'   },
];
