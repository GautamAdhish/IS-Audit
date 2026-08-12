import React from 'react';
import {
  ClipboardList, Loader, CheckCircle, AlertCircle, AlertTriangle,
  XCircle, MinusCircle, Eye, Clock, TrendingUp, ShieldAlert, FileText,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  ClipboardList, Loader, CheckCircle, AlertCircle, AlertTriangle,
  XCircle, MinusCircle, Eye, Clock, TrendingUp, ShieldAlert, FileText,
};

const colorMap: Record<string, { bg: string; icon: string; value: string; border: string }> = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   value: 'text-blue-700',   border: 'border-blue-100'   },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  value: 'text-amber-700',  border: 'border-amber-100'  },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  value: 'text-green-700',  border: 'border-green-100'  },
  red:    { bg: 'bg-red-50',    icon: 'text-red-600',    value: 'text-red-700',    border: 'border-red-100'    },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', value: 'text-purple-700', border: 'border-purple-100' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', value: 'text-orange-700', border: 'border-orange-100' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', value: 'text-indigo-700', border: 'border-indigo-100' },
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
    <div className={`bg-white rounded-xl border ${colors.border} shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow`}>
      <div className={`flex-shrink-0 w-11 h-11 rounded-lg ${colors.bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${colors.icon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 truncate">{label}</p>
        <p className={`text-2xl font-bold ${colors.value} leading-tight`}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
