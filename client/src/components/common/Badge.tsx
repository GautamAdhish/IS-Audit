import React from "react";

type BadgeVariant =
  | "green"
  | "red"
  | "amber"
  | "blue"
  | "purple"
  | "orange"
  | "indigo"
  | "gray";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  green: "bg-green-50 text-green-800 ring-1 ring-inset ring-green-600/20",
  red: "bg-red-50 text-red-800 ring-1 ring-inset ring-red-600/20",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20",
  blue: "bg-ink-500/10 text-ink-700 ring-1 ring-inset ring-ink-500/20",
  purple: "bg-purple-50 text-purple-800 ring-1 ring-inset ring-purple-600/20",
  orange: "bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-600/20",
  indigo: "bg-indigo-50 text-indigo-800 ring-1 ring-inset ring-indigo-600/20",
  gray: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-400/20",
};

const dotClasses: Record<BadgeVariant, string> = {
  green: "bg-green-500",
  red: "bg-red-500",
  amber: "bg-amber-500",
  blue: "bg-ink-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  indigo: "bg-indigo-500",
  gray: "bg-slate-400",
};

export function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    // Audit statuses
    Completed: "green",
    "In Progress": "blue",
    Planned: "gray",
    Overdue: "red",
    // Finding statuses
    Open: "red",
    "In Review": "amber",
    Closed: "green",
    // CAPA statuses
    Verified: "purple",
    // Risk levels
    Critical: "red",
    High: "orange",
    Medium: "amber",
    Low: "green",
    // Checklist
    Compliant: "green",
    "Non-Compliant": "red",
    Partial: "amber",
    "N/A": "gray",
    // Risk status
    Mitigated: "green",
    Accepted: "gray",
    // Severity
    Major: "red",
    Minor: "amber",
    Observation: "blue",
    // Report
    Draft: "gray",
    Final: "blue",
    Approved: "green",
    // User
    Active: "green",
    Inactive: "gray",
    // Roles
    "Lead Auditor": "blue",
    Auditor: "purple",
    Admin: "red",
    Viewer: "gray",
  };
  return map[status] ?? "gray";
}

const Badge: React.FC<BadgeProps> = ({ label, variant }) => {
  const v = variant ?? statusVariant(label);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${variantClasses[v]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[v]}`} />
      {label}
    </span>
  );
};

export default Badge;
