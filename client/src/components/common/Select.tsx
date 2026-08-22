import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none px-3.5 py-2 pr-8 text-sm bg-white border border-slate-300 rounded-2xl text-ink-900",
          "transition-colors focus:outline-none focus:border-brass-500 focus:ring-2 focus:ring-brass-500/30",
          "disabled:bg-slate-50 disabled:text-slate-400",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </div>
  ),
);
Select.displayName = "Select";

export default Select;
