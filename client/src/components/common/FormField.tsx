import React from "react";
import { cn } from "../../utils/cn";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  className,
  children,
}) => (
  <div className={className}>
    <label className="block text-xs font-medium text-slate-600 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className={cn("mt-1 text-xs text-red-600")}>{error}</p>}
  </div>
);

export default FormField;
