import React from 'react';

type BadgeVariant = 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'orange' | 'indigo' | 'gray';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  green:  'bg-green-100 text-green-800',
  red:    'bg-red-100 text-red-800',
  amber:  'bg-amber-100 text-amber-800',
  blue:   'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  orange: 'bg-orange-100 text-orange-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  gray:   'bg-gray-100 text-gray-700',
};

export function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    // Audit statuses
    Completed:   'green',
    'In Progress': 'blue',
    Planned:     'gray',
    Overdue:     'red',
    // Finding statuses
    Open:        'red',
    'In Review': 'amber',
    Closed:      'green',
    // CAPA statuses
    Verified:    'purple',
    // Risk levels
    Critical:    'red',
    High:        'orange',
    Medium:      'amber',
    Low:         'green',
    // Checklist
    Compliant:       'green',
    'Non-Compliant': 'red',
    Partial:         'amber',
    'N/A':           'gray',
    // Risk status
    Mitigated:   'green',
    Accepted:    'gray',
    // Severity
    Major:       'red',
    Minor:       'amber',
    Observation: 'blue',
    // Report
    Draft:       'gray',
    Final:       'blue',
    Approved:    'green',
    // User
    Active:      'green',
    Inactive:    'gray',
    // Roles
    'Lead Auditor': 'blue',
    Auditor:        'purple',
    Auditee:        'amber',
    Admin:          'red',
    Viewer:         'gray',
  };
  return map[status] ?? 'gray';
}

const Badge: React.FC<BadgeProps> = ({ label, variant }) => {
  const v = variant ?? statusVariant(label);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[v]}`}>
      {label}
    </span>
  );
};

export default Badge;
