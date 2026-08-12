import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4 mb-6 pb-5 border-b border-ink-900/8">
    <div>
      <h1 className="text-[22px] font-semibold text-ink-900 tracking-tight leading-tight">
        {title}
      </h1>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default PageHeader;
