import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import Card, { CardHeader, CardBody } from "../../components/common/Card";
import StatTile from "../../components/common/StatTile";
import VulnerabilityMap from "./VulnerabilityMap";
import type { Insights } from "./computeInsights";
import {
  CHART_COLORS,
  chartAxisTick,
  chartGridProps,
  complianceColor,
} from "../../lib/chartTheme";

const TechnicalReport: React.FC<{ insights: Insights }> = ({ insights }) => {
  const {
    findingsBySeverity,
    findingsByStatus,
    risksByLevel,
    riskMatrix,
    capaByStatus,
    assetCompliance,
    vendorResidualRisk,
    complianceByDept,
    vulnerabilityAreas,
    predictedRisks,
    criticalOpenRisks,
    overdueCapas,
    overallExposure,
  } = insights;

  return (
    <div className="space-y-6">
      {/* Headline metrics strip */}
      <Card data-pdf-section className="print:break-inside-avoid">
        <CardHeader
          title="Headline Metrics"
          subtitle="Point-in-time snapshot across every tracked control area"
        />
        <CardBody className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile
            variant="plain"
            tone="blue"
            label="Overall Exposure Index"
            value={`${overallExposure}%`}
          />
          <StatTile
            variant="plain"
            tone="blue"
            label="Avg. Compliance"
            value={`${insights.avgCompliance}%`}
          />
          <StatTile
            variant="plain"
            tone="red"
            label="Critical/High Risks Open"
            value={criticalOpenRisks.length}
          />
          <StatTile
            variant="plain"
            tone="amber"
            label="Overdue CAPAs"
            value={overdueCapas.length}
          />
        </CardBody>
      </Card>

      <div data-pdf-section className="print:break-inside-avoid">
        <VulnerabilityMap
          areas={vulnerabilityAreas}
          predicted={predictedRisks}
        />
      </div>

      {/* Chart grid — each chart is its own atomic section so PDF export
          never slices a chart across a page boundary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-pdf-section className="print:break-inside-avoid">
          <CardHeader
            title="Findings by Severity"
            subtitle="Major / Minor / Observation"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={findingsBySeverity}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {findingsBySeverity.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={30}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card data-pdf-section className="print:break-inside-avoid">
          <CardHeader
            title="Findings by Status"
            subtitle="Open / In Review / Closed"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={findingsByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {findingsByStatus.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  height={30}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card data-pdf-section className="print:break-inside-avoid">
          <CardHeader
            title="Risk Register by Level"
            subtitle="Critical / High / Medium / Low"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={risksByLevel}
                layout="vertical"
                margin={{ left: 16 }}
              >
                <CartesianGrid {...chartGridProps} />
                <XAxis
                  type="number"
                  tick={chartAxisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={chartAxisTick}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {risksByLevel.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    style={{ fontSize: 11, fill: "#334155" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card data-pdf-section className="print:break-inside-avoid">
          <CardHeader
            title="Risk Heat Matrix"
            subtitle="Likelihood × Impact (bubble size = number of risks)"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid {...chartGridProps} />
                <XAxis
                  type="number"
                  dataKey="likelihood"
                  name="Likelihood"
                  domain={[0, 6]}
                  tick={chartAxisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="impact"
                  name="Impact"
                  domain={[0, 6]}
                  tick={chartAxisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <ZAxis type="number" dataKey="z" range={[80, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  data={riskMatrix}
                  fill={CHART_COLORS.badStrong}
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card data-pdf-section className="print:break-inside-avoid">
          <CardHeader
            title="CAPA by Status"
            subtitle="Corrective / preventive action tracking"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={capaByStatus}
                margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid {...chartGridProps} />
                <XAxis
                  dataKey="name"
                  tick={chartAxisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {capaByStatus.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    style={{ fontSize: 10, fill: CHART_COLORS.neutral }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card data-pdf-section className="print:break-inside-avoid">
          <CardHeader title="Compliance by Department" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={complianceByDept}
                margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid {...chartGridProps} />
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
                <Tooltip formatter={(v: any) => [`${v}%`, "Compliance"]} />
                <Bar dataKey="compliance" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {complianceByDept.map((e, i) => (
                    <Cell key={i} fill={complianceColor(e.compliance)} />
                  ))}
                  <LabelList
                    dataKey="compliance"
                    position="top"
                    style={{ fontSize: 10, fill: CHART_COLORS.neutral }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card
          data-pdf-section
          className="lg:col-span-2 print:break-inside-avoid"
        >
          <CardHeader
            title="Asset & Vendor Residual Risk"
            subtitle="Post-control exposure"
          />
          <CardBody className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={assetCompliance}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {assetCompliance.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={15}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={vendorResidualRisk}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label
                >
                  {vendorResidualRisk.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={15}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Detailed vulnerability breakdown w/ remediation */}
      <Card data-pdf-section>
        <CardHeader
          title="Vulnerability Detail & Remediation Plan"
          subtitle="Exposure % by control area, predicted trajectory, and specific corrective actions pulled from the register"
        />
        <CardBody className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 border-b border-ink-900/10 uppercase tracking-wide text-[10px]">
                <th className="py-2 pr-4">Area</th>
                <th className="py-2 pr-4">Exposure</th>
                <th className="py-2 pr-4">Severity Weight</th>
                <th className="py-2 pr-4">Trajectory</th>
                <th className="py-2 pr-4">Open / Total</th>
                <th className="py-2">Recommended Fixes</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilityAreas.map((a) => (
                <tr key={a.key} className="border-b border-ink-900/5 align-top">
                  <td className="py-2.5 pr-4 font-medium text-ink-900 whitespace-nowrap">
                    {a.label}
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${a.exposurePct}%`,
                            background:
                              a.exposurePct >= 50
                                ? CHART_COLORS.badStrong
                                : a.exposurePct >= 25
                                  ? CHART_COLORS.warn
                                  : CHART_COLORS.good,
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-600">
                        {a.exposurePct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-600">
                    {a.severityScore}%
                  </td>
                  <td className="py-2.5 pr-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
                        a.trajectory === "Escalating"
                          ? "text-red-600 bg-red-50 border-red-200"
                          : a.trajectory === "Improving"
                            ? "text-green-600 bg-green-50 border-green-200"
                            : "text-amber-600 bg-amber-50 border-amber-200"
                      }`}
                    >
                      {a.trajectory}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-600 whitespace-nowrap">
                    {a.openCount} / {a.totalCount}
                  </td>
                  <td className="py-2.5 text-slate-600">
                    {a.topFixes.length === 0 ? (
                      <span className="italic text-slate-400">
                        No open items
                      </span>
                    ) : (
                      <ul className="list-disc list-inside space-y-0.5">
                        {a.topFixes.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default TechnicalReport;
