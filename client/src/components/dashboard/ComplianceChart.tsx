import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card, { CardHeader, CardBody } from "../common/Card";
import {
  CHART_COLORS,
  barRadius,
  chartAxisTick,
  chartGridProps,
  complianceColor,
} from "../../lib/chartTheme";

interface TooltipPayload {
  value: number;
  payload: { department: string };
}

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayload[];
}> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(16,26,46,0.12)] p-3">
        <p className="text-xs font-semibold text-slate-700">
          {payload[0].payload.department}
        </p>
        <p className="text-xs text-slate-500">{val}% compliant</p>
      </div>
    );
  }
  return null;
};

// Peak bar gets a floating pill callout (real value, no fabricated delta);
// every other bar keeps a small plain text label. Matches on the value
// itself rather than looking up the department by index — Recharts' label
// callback index doesn't reliably line up with the source data array.
function peakLabel(peakValue?: number) {
  return (props: any) => {
    const { x, y, width, value } = props;
    const isPeak = value === peakValue;
    const cx = x + width / 2;

    if (!isPeak) {
      return (
        <text
          x={cx}
          y={y - 8}
          textAnchor="middle"
          fontSize={10}
          fontWeight={600}
          fill={CHART_COLORS.neutral}
        >
          {value}%
        </text>
      );
    }

    return (
      <g>
        <line
          x1={cx}
          y1={y - 6}
          x2={cx}
          y2={y - 24}
          stroke={CHART_COLORS.ink}
          strokeWidth={1.5}
        />
        <circle cx={cx} cy={y - 6} r={3} fill={CHART_COLORS.ink} />
        <rect
          x={cx - 23}
          y={y - 48}
          width={46}
          height={23}
          rx={11.5}
          fill={CHART_COLORS.ink}
        />
        <text
          x={cx}
          y={y - 36.5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fontWeight={700}
          fill="#ffffff"
        >
          {value}%
        </text>
      </g>
    );
  };
}

const ComplianceChart: React.FC<{ data?: any[] }> = ({ data = [] }) => {
  const peak = data.reduce(
    (best: any, entry: any) =>
      entry.compliance > (best?.compliance ?? -1) ? entry : best,
    null,
  );

  return (
    <Card>
      <CardHeader
        title="Compliance by Department"
        subtitle="Current period compliance rates"
      />
      <CardBody>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart
            data={data}
            margin={{ top: 12, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid {...chartGridProps} vertical={false} />
            <XAxis
              dataKey="department"
              tick={chartAxisTick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={chartAxisTick}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar
              dataKey="compliance"
              radius={barRadius}
              maxBarSize={40}
              label={peakLabel(peak?.compliance)}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={complianceColor(entry.compliance)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default ComplianceChart;
