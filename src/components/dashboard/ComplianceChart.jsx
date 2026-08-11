import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { complianceByDepartment } from '../../data/dashboardData';
import Card, { CardHeader } from '../common/Card';

const getBarColor = (value) => {
  if (value >= 85) return '#10b981';
  if (value >= 70) return '#f59e0b';
  return '#ef4444';
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
        <p className="text-xs font-semibold text-slate-800">{payload[0].payload.department}</p>
        <p className="text-sm font-bold text-blue-600">{val}% compliant</p>
      </div>
    );
  }
  return null;
};

const ComplianceChart = () => (
  <Card className="h-full">
    <CardHeader
      title="Compliance by 