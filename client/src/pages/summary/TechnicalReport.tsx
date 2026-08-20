import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
  ScatterChart, Scatter, ZAxis,
} from "recharts";
import Card, { CardHeader, CardBody } from "../../components/common/Card";
import VulnerabilityMap from "./VulnerabilityMap";
import type { Insights } from "./computeInsights";

const TechnicalReport: React.FC<{ insights: Insights }> = ({ insights }) => {
  const {
    findingsBySeverity, findingsByStatus, risksByLevel, riskMatrix,
    capaByStatus, assetCompliance, vendorResidualRisk, complianceByDept,
    vulnerabilityAreas, criticalOpenRisks, overdueCapas, overallExposure,
  } = insights;

  return (
    <div className="space-y-6">
      {/* Headline metrics strip */}
      <Card>
        <CardBody className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">Overall Exposure Index</p>
            <p className="text-2xl font-bold text-ink-900">{overallExposure}%</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">Avg. Compliance</p>
            <p className="text-2xl font-bold text-ink-900">{insights.avgCompliance}%</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">Critical/High Risks Open</p>
            <p className="text-2xl font-bold text-red-600">{criticalOpenRisks.length}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">Overdue CAPAs</p>
            <p className="text-2xl font-bold text-amber-600">{overdueCapas.length}</p>
          </div>
        </CardBody>
      </Card>

      <VulnerabilityMap areas={vulnerabilityAreas} />

      {/* Chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Findings by Severity" subtitle="Major / Minor / Observation" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={findingsBySeverity} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                  {findingsBySeverity.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Findings by Status" subtitle="Open / In Review / Closed" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={findingsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85}>
                  {findingsByStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Risk Register by Level" subtitle="Critical / High / Medium / Low" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={risksByLevel} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={70} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {risksByLevel.map((e, i) => <Cell key={i} fill={e.color} />)}
                  <LabelList dataKey="value" position="right" style={{ fontSize: 11, fill: "#334155" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Risk Heat Matrix" subtitle="Likelihood × Impact (bubble size = number of risks)" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="likelihood" name="Likelihood" domain={[0, 6]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 6]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <ZAxis type="number" dataKey="z" range={[80, 400]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v: number, n: string) => [v, n]} />
                <Scatter data={riskMatrix} fill="#dc2626" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="CAPA by Status" subtitle="Corrective / preventive action tracking" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={capaByStatus} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {capaByStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                  <LabelList dataKey="value" position="top" style={{ fontSize: 10, fill: "#64748b" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Compliance by Department" />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={complianceByDept} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Compliance"]} />
                <Bar dataKey="compliance" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {complianceByDept.map((e, i) => (
                    <Cell key={i} fill={e.compliance >= 85 ? "#4caf37" : e.compliance >= 70 ? "#f59e0b" : "#ef4444"} />
                  ))}
                  <LabelList dataKey="compliance" position="top" formatter={(v: number) => `${v}%`} style={{ fontSize: 10, fill: "#64748b" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Asset & Vendor Residual Risk" subtitle="Post-control exposure" />
          <CardBody className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={assetCompliance} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  {assetCompliance.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={vendorResidualRisk} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  {vendorResidualRisk.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Detailed vulnerability breakdown w/ remediation */}
      <Card>
        <CardHeader title="Vulnerability Detail & Remediation Plan" subtitle="Exposure % by control area, with specific corrective actions pulled from the register" />
        <CardBody className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 border-b border-ink-900/10 uppercase tracking-wide text-[10px]">
                <th className="py-2 pr-4">Area</th>
                <th className="py-2 pr-4">Exposure</th>
                <th className="py-2 pr-4">Severity Weight</th>
                <th className="py-2 pr-4">Open / Total</th>
                <th className="py-2">Recommended Fixes</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilityAreas.map((a) => (
                <tr key={a.key} className="border-b border-ink-900/5 align-top">
                  <td className="py-2.5 pr-4 font-medium text-ink-900 whitespace-nowrap">{a.label}</td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${a.exposurePct}%`,
                            background: a.exposurePct >= 50 ? "#dc2626" : a.exposurePct >= 25 ? "#f59e0b" : "#4caf37",
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-600">{a.exposurePct}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-600">{a.severityScore}%</td>
                  <td className="py-2.5 pr-4 text-slate-600 whitespace-nowrap">{a.openCount} / {a.totalCount}</td>
                  <td className="py-2.5 text-slate-600">
                    {a.topFixes.length === 0 ? (
                      <span className="italic text-slate-400">No open items</span>
                    ) : (
                      <ul className="list-disc list-inside space-y-0.5">
                        {a.topFixes.map((f, i) => <li key={i}>{f}</li>)}
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
