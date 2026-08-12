import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { ncTrend } from '../../data/dashboardData';
import Card, { CardHeader, CardBody } from '../common/Card';

const NcTrendChart: React.FC = () => (
  <Card>
    <CardHeader title="Nonconformity Trend" subtitle="Last 6 months by severity" />
    <CardBody>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={ncTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="major"       stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Major NC"      />
          <Line type="monotone" dataKey="minor"       stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Minor NC"      />
          <Line type="monotone" dataKey="observation" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Observation"   />
        </LineChart>
      </ResponsiveContainer>
    </CardBody>
  </Card>
);

export default NcTrendChart;
