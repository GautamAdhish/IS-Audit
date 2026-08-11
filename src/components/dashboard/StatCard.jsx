import {
  ClipboardList, Loader, CheckCircle, AlertCircle,
  AlertTriangle, XCircle, MinusCircle, Eye,
  Clock, TrendingUp, ShieldAlert, FileText,
} from 'lucide-react';

const iconMap = {
  ClipboardList, Loader, CheckCircle, AlertCircle,
  AlertTriangle, XCircle, MinusCircle, Eye,
  Clock, TrendingUp, ShieldAlert, FileText,
};

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   value: 'text-blue-700'   },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  value: 'text-amber-700'  },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  value: 'text-green-700'  },
  red:    { bg: 'bg-red-50',    icon: 'text-red-600',    value: 'text-red-700'    },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', value: 'text-purple-700' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', value: 'text-orange-700' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', value: 'text-indigo-700' },
};

const StatCard = ({ label, value, color = 'blue', icon }) => {
  const Icon = iconMap[icon] || ClipboardList;
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`w-11 h-11 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className={colors.icon} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium leading-none mb-1 truncate">{label}</p>
        <p className={`text-2xl font-bold leading-none ${colors.value}`}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;