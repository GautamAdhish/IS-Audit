import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import Card, { CardHeader, CardBody } from '../common/Card';

const getBarColor = (value: number): string => {
  if (value >= 85) return '#4caf37';
  if (value >= 70) return '#f59e0b';
  return '#ef4444';
};

interface TooltipPayload {
  value: number;
  payload: { department: string };
}

const CustomTooltip: React.FC<{ active?: boolean; payload?: TooltipPayload[] }> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
        <p className="text-xs font-semibold text-slate-700">{payload[0].payload.department}</p>
        <p className="text-xs text-slate-500">{val}% compliant</p>
      </div>
    );
  }
  return null;
};

const ComplianceChart: React.FC<{data?: any[]}> = ({data = []}) => (
  <Card>
    <CardHeader title="Compliance by Department" subtitle="Current period compliance rates" />
    <CardBody>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="department"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="compliance" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.compliance)} />
            ))}
            <LabelList
              dataKey="compliance"
              position="top"
              formatter={(v) => `${v}%`}
              style={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardBody>
  </Card>
);

export default ComplianceChart;
