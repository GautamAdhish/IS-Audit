import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between p-5 border-b border-slate-100">
    <div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="ml-4 shrink-0">{action}</div>}
  </div>
);

export const CardBody: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export default Card;
