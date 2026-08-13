import React from 'react';
import {
  ClipboardList, Loader, CheckCircle, AlertCircle, AlertTriangle,
  XCircle, MinusCircle, Eye, Clock, TrendingUp, ShieldAlert, FileText,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  ClipboardList, Loader, CheckCircle, AlertCircle, AlertTriangle,
  XCircle, MinusCircle, Eye, Clock, TrendingUp, ShieldAlert, FileText,
};

// A muted text/icon tone plus a thin accent bar carries the color meaning —
// six identically-shaped "icon in a filled tinted box" cards side by side is
// the single most recognizable stock-dashboard pattern, so this deliberately
// avoids it in favor of something quieter.
const colorMap: Record<string, { icon: string; bar: string }> = {
  blue:   { icon: 'text-ink-600',    bar: 'bg-ink-500'    },
  amber:  { icon: 'text-amber-600',  bar: 'bg-amber-500'  },
  green:  { icon: 'text-green-600',  bar: 'bg-green-500'  },
  red:    { icon: 'text-red-600',    bar: 'bg-red-500'    },
  purple: { icon: 'text-purple-600', bar: 'bg-purple-500' },
  orange: { icon: 'text-orange-600', bar: 'bg-orange-500' },
  indigo: { icon: 'text-indigo-600', bar: 'bg-indigo-500' },
};

interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color = 'blue', icon }) => {
  const Icon = iconMap[icon ?? ''] ?? ClipboardList;
  const colors = colorMap[color] ?? colorMap.blue;

  return (
    <div className="relative bg-white rounded-lg border border-ink-900/10 shadow-[0_1px_2px_rgba(16,26,46,0.04)] pl-4 pr-4 py-3.5 overflow-hidden hover:border-ink-900/20 transition-colors">
      <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${colors.bar}`} />
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide truncate">{label}</p>
        <Icon className={`w-3.5 h-3.5 shrink-0 ${colors.icon}`} />
      </div>
      <p className="text-[26px] font-semibold text-ink-900 leading-tight mt-1 tracking-tight">{value}</p>
    </div>
  );
};

export default StatCard;
