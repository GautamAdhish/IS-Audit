import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => (
  <div
    {...props}
    className={`bg-white rounded-lg border border-ink-900/10 shadow-[0_1px_2px_rgba(16,26,46,0.04)] ${className}`}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
}) => (
  <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-ink-900/8">
    <div>
      <h3 className="text-[13px] font-semibold text-ink-900 tracking-tight">
        {title}
      </h3>

      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>

    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const CardBody: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div {...props} className={`p-5 ${className}`}>
    {children}
  </div>
);

export default Card;
