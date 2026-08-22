import React from "react";
import { cn } from "../../utils/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-2xl text-ink-900 placeholder:text-slate-400",
        "transition-colors focus:outline-none focus:border-brass-500 focus:ring-2 focus:ring-brass-500/30",
        "disabled:bg-slate-50 disabled:text-slate-400",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export default Textarea;
