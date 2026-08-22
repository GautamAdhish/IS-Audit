import React from "react";
import { cn } from "../../utils/cn";

const base =
  "w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-2xl text-ink-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:border-brass-500 focus:ring-2 focus:ring-brass-500/30 disabled:bg-slate-50 disabled:text-slate-400";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </span>
          <input ref={ref} className={cn(base, "pl-9", className)} {...props} />
        </div>
      );
    }
    return <input ref={ref} className={cn(base, className)} {...props} />;
  },
);
Input.displayName = "Input";

export default Input;
