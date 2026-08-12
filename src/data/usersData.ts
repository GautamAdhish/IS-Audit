export type UserRole = 'Lead Auditor' | 'Auditor' | 'Auditee' | 'Admin' | 'Viewer';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastLogin: string;
  auditsAssigned: number;
}

export const users: User[] = [
  { id: 'U-001', name: 'Alice Chen',   email: 'alice.chen@company.com',   role: 'Lead Auditor', department: 'IT',         status: 'Active',   lastLogin: '2024-02-14', auditsAssigned: 12 },
  { id: 'U-002', name: 'Bob Martinez', email: 'bob.m@company.com',         role: 'Auditor',      department: 'Legal',      status: 'Active',   lastLogin: '2024-02-13', auditsAssigned: 8  },
  { id: 'U-003', name: 'Carol Singh',  email: 'carol.s@company.com',       role: 'Auditor',      department: 'Finance',    status: 'Active',   lastLogin: '2024-02-12', auditsAssigned: 7  },
  { id: 'U-004', name: 'David Lee',    email: 'david.lee@company.com',     role: 'Auditee',      department: 'HR',         status: 'Active',   lastLogin: '2024-02-10', auditsAssigned: 3  },
  { id: 'U-005', name: 'Eve Johnson',  email: 'eve.j@company.com',         role: 'Auditor',      department: 'Operations', status: 'Active',   lastLogin: '2024-02-11', auditsAssigned: 9  },
  { id: 'U-006', name: 'Frank Wu',     email: 'frank.wu@company.com',      role: 'Auditee',      department: 'Sales',      status: 'Active',   lastLogin: '2024-02-09', auditsAssigned: 2  },
  { id: 'U-007', name: 'Grace Kim',    email: 'grace.kim@company.com',     role: 'Admin',        department: 'Operations', status: 'Active',   lastLogin: '2024-02-14', auditsAssigned: 5  },
  { id: 'U-008', name: 'Henry Patel',  email: 'henry.p@company.com',       role: 'Viewer',       department: 'Finance',    status: 'Inactive', lastLogin: '2024-01-20', auditsAssigned: 0  },
];
