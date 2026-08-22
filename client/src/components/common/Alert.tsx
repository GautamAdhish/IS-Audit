import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "../../utils/cn";

type AlertVariant = "error" | "warning" | "success" | "info";

const styles: Record<AlertVariant, { box: string; icon: string }> = {
  error: { box: "bg-red-50 border-red-200 text-red-700", icon: "text-red-500" },
  warning: {
    box: "bg-amber-50 border-amber-200 text-amber-800",
    icon: "text-amber-500",
  },
  success: {
    box: "bg-green-50 border-green-200 text-green-800",
    icon: "text-green-500",
  },
  info: {
    box: "bg-ink-500/10 border-ink-500/20 text-ink-700",
    icon: "text-ink-500",
  },
};

const icons: Record<AlertVariant, React.ElementType> = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ variant = "error", children, className }) => {
  const Icon = icons[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 p-3 rounded-lg border text-sm",
        styles[variant].box,
        className,
      )}
    >
      <Icon className={cn("w-4 h-4 shrink-0 mt-0.5", styles[variant].icon)} />
      <div className="min-w-0">{children}</div>
    </div>
  );
};

export default Alert;
