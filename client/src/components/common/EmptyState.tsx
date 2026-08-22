import React from "react";
import { Inbox } from "lucide-react";
import { cn } from "../../utils/cn";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center text-center gap-1.5 py-16 px-4",
      className,
    )}
  >
    <Icon className="w-8 h-8 text-slate-300 mb-1" />
    <p className="text-sm font-medium text-slate-600">{title}</p>
    {description && (
      <p className="text-xs text-slate-400 max-w-sm">{description}</p>
    )}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default EmptyState;
