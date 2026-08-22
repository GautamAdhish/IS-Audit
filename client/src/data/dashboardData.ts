export const statCards = [
  { label: 'Total Audits',          value: 48,    color: 'blue',   icon: 'ClipboardList' },
  { label: 'In Progress',           value: 14,    color: 'amber',  icon: 'Loader' },
  { label: 'Completed',             value: 26,    color: 'green',  icon: 'CheckCircle' },
  { label: 'Overdue',               value: 8,     color: 'red',    icon: 'AlertCircle' },
  { label: 'Total Nonconformities', value: 32,    color: 'purple', icon: 'AlertTriangle' },
  { label: 'Major NCs',             value: 7,     color: 'red',    icon: 'XCircle' },
  { label: 'Minor NCs',             value: 18,    color: 'amber',  icon: 'MinusCircle' },
  { label: 'Observations',          value: 12,    color: 'blue',   icon: 'Eye' },
  { label: 'CAPA Pending',          value: 15,    color: 'orange', icon: 'Clock' },
  { label: 'Compliance',            value: '87%', color: 'green',  icon: 'TrendingUp' },
  { label: 'High Risks',            value: 5,     color: 'red',    icon: 'ShieldAlert' },
  { label: 'Documents',             value: 152,   color: 'indigo', icon: 'FileText' },
];

export const complianceByDepartment = [
  { department: 'IT',         compliance: 91 },
  { department: 'HR',         compliance: 78 },
  { department: 'Finance',    compliance: 85 },
  { department: 'Operations', compliance: 72 },
  { department: 'Sales',      compliance: 68 },
  { department: 'Legal',      compliance: 88 },
];

export const ncTrend = [
  { month: 'Jan', major: 3, minor: 6, observation: 4 },
  { month: 'Feb', major: 2, minor: 8, observation: 5 },
  { month: 'Mar', major: 5, minor: 7, observation: 3 },
  { month: 'Apr', major: 4, minor: 5, observation: 6 },
  { month: 'May', major: 3, minor: 9, observation: 4 },
  { month: 'Jun', major: 7, minor: 6, observation: 5 },
];

export const auditHeatmapData = [
  { dept: 'IT',         Jan: 3, Feb: 1, Mar: 2, Apr: 4, May: 2, Jun: 3 },
  { dept: 'HR',         Jan: 1, Feb: 2, Mar: 1, Apr: 2, May: 3, Jun: 1 },
  { dept: 'Finance',    Jan: 2, Feb: 3, Mar: 4, Apr: 1, May: 2, Jun: 2 },
  { dept: 'Operations', Jan: 4, Feb: 2, Mar: 3, Apr: 3, May: 4, Jun: 3 },
  { dept: 'Sales',      Jan: 1, Feb: 1, Mar: 2, Apr: 2, May: 1, Jun: 2 },
];
