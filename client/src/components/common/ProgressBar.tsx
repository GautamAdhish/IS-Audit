import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

function getColor(value: number): string {
  if (value >= 85) return 'bg-green-600';
  if (value >= 70) return 'bg-amber-500';
  return 'bg-red-600';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, size = 'md', showLabel = true }) => {
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5';
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${h}`}>
        <div
          className={`${h} rounded-full transition-all duration-500 ${getColor(value)}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-600 w-9 text-right shrink-0">
          {value}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
