import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import Card, { CardHeader, CardBody } from '../common/Card';
import { CHART_COLORS, areaFillOpacity, chartAxisTick, chartGridProps, chartTooltipStyle } from '../../lib/chartTheme';

const NcTrendChart: React.FC<{data?: any[]; footer?: React.ReactNode}> = ({data = [], footer}) => (
  <Card>
    <CardHeader title="Nonconformity Trend" subtitle="Last 6 months by severity" />
    <CardBody>
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid {...chartGridProps} vertical={false} />
          <XAxis dataKey="month" tick={chartAxisTick} axisLine={false} tickLine={false} />
          <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
          <Area
            type="monotone" dataKey="major" name="Major NC"
            stroke={CHART_COLORS.bad} fill={CHART_COLORS.bad} fillOpacity={areaFillOpacity}
            strokeWidth={2} dot={{ r: 3 }}
          />
          <Area
            type="monotone" dataKey="minor" name="Minor NC"
            stroke={CHART_COLORS.warn} fill={CHART_COLORS.warn} fillOpacity={areaFillOpacity}
            strokeWidth={2} dot={{ r: 3 }}
          />
          <Area
            type="monotone" dataKey="observation" name="Observation"
            stroke={CHART_COLORS.ink} fill={CHART_COLORS.ink} fillOpacity={areaFillOpacity}
            strokeWidth={2} dot={{ r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {footer && <div className="mt-4">{footer}</div>}
    </CardBody>
  </Card>
);

export default NcTrendChart;
