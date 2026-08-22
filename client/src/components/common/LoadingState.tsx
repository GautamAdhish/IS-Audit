import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

interface LoadingStateProps {
  message?: string;
  compact?: boolean;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading…",
  compact = false,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-2 text-slate-400",
      compact ? "py-6" : "py-20",
      className,
    )}
  >
    <Loader2 className="w-5 h-5 animate-spin" />
    <p className="text-sm">{message}</p>
  </div>
);

export default LoadingState;
