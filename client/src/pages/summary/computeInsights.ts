import type { SummaryData } from "./useSummaryData";

// Everything both report views need, pre-computed once so the "board"
// version and the "auditor" version are always describing the same
// underlying numbers, just at different levels of detail.

export interface VulnerabilityArea {
  key: string;
  label: string;
  exposurePct: number; // 0-100: how much of this area is unresolved/non-compliant
  severityScore: number; // weighted 0-100, factors in Critical/Major weighting
  openCount: number;
  totalCount: number;
  topFixes: string[]; // concrete remediation text pulled from CAPA / mitigation fields
}

export interface Insights {
  overallExposure: number; // 0-100 headline "how vulnerable are we" number
  overallLabel: string;
  auditsCompleted: number;
  auditsTotal: number;
  avgCompliance: number;
  findingsBySeverity: { name: string; value: number; color: string }[];
  findingsByStatus: { name: string; value: number; color: string }[];
  risksByLevel: { name: string; value: number; color: string }[];
  riskMatrix: { likelihood: number; impact: number; count: number; z: number }[];
  capaByStatus: { name: string; value: number; color: string }[];
  complianceByDept: { department: string; compliance: number }[];
  assetCompliance: { name: string; value: number; color: string }[];
  vendorResidualRisk: { name: string; value: number; color: string }[];
  vulnerabilityAreas: VulnerabilityArea[];
  criticalOpenRisks: any[];
  overdueCapas: any[];
}

const SEVERITY_COLORS: Record<string, string> = {
  Major: "#dc2626",
  Minor: "#f59e0b",
  Observation: "#64748b",
};
const RISK_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#f97316",
  Medium: "#f59e0b",
  Low: "#4caf37",
};
const STATUS_COLORS: Record<string, string> = {
  Open: "#dc2626",
  "In Review": "#f59e0b",
  "In Progress": "#f59e0b",
  Closed: "#4caf37",
  Verified: "#4caf37",
  Mitigated: "#4caf37",
  Accepted: "#64748b",
};

function tally(items: any[], key: string, colorMap: Record<string, string>) {
  const counts: Record<string, number> = {};
  items.forEach((i) => {
    const v = i[key] || "Unknown";
    counts[v] = (counts[v] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
    color: colorMap[name] || "#94a3b8",
  }));
}

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

export function computeInsights(data: SummaryData): Insights {
  const { audits, findings, risks, capas, assets, vendors, checklist } = data;

  // --- Findings ---
  const findingsBySeverity = tally(findings, "severity", SEVERITY_COLORS);
  const findingsByStatus = tally(findings, "status", STATUS_COLORS);
  const openFindings = findings.filter((f) => f.status !== "Closed");
  const majorOpenFindings = openFindings.filter((f) => f.severity === "Major");

  // --- Risks ---
  const risksByLevel = tally(risks, "level", RISK_COLORS);
  const openRisks = risks.filter((r) => r.status === "Open");
  const criticalOpenRisks = openRisks
    .filter((r) => r.level === "Critical" || r.level === "High")
    .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
  const riskMatrixMap: Record<string, { likelihood: number; impact: number; count: number }> = {};
  risks.forEach((r) => {
    const k = `${r.likelihood}-${r.impact}`;
    if (!riskMatrixMap[k]) riskMatrixMap[k] = { likelihood: r.likelihood, impact: r.impact, count: 0 };
    riskMatrixMap[k].count += 1;
  });
  const riskMatrix = Object.values(riskMatrixMap).map((r) => ({ ...r, z: r.count }));

  // --- CAPA ---
  const capaByStatus = tally(capas, "status", STATUS_COLORS);
  const now = new Date();
  const overdueCapas = capas.filter(
    (c) => c.status !== "Closed" && c.status !== "Verified" && c.dueDate && new Date(c.dueDate) < now
  );

  // --- Assets ---
  const nonCompliantAssets = assets.filter(
    (a) => a.assessmentStatus === "Non-Compliant" || a.assessmentStatus === "Needs Review"
  );
  const assetCompliance = tally(assets, "assessmentStatus", {
    Pass: "#4caf37",
    "Needs Review": "#f59e0b",
    "Non-Compliant": "#dc2626",
    Retired: "#64748b",
  });

  // --- Vendors ---
  const highRiskVendors = vendors.filter((v) => v.residualRisk === "Critical" || v.residualRisk === "High");
  const vendorResidualRisk = tally(vendors, "residualRisk", RISK_COLORS);

  // --- Checklist / compliance ---
  const nonCompliantChecklist = checklist.filter(
    (c) => c.status === "Non-Compliant" || c.status === "Partial"
  );
  const deptMap: Record<string, { compliant: number; total: number }> = {};
  checklist.forEach((c) => {
    const dept = c.clause?.split(".")[0] || "General";
    if (!deptMap[dept]) deptMap[dept] = { compliant: 0, total: 0 };
    deptMap[dept].total += 1;
    if (c.status === "Compliant") deptMap[dept].compliant += 1;
  });
  const complianceByDept =
    audits.length > 0
      ? Array.from(new Set(audits.map((a) => a.department))).map((department) => {
          const deptAudits = audits.filter((a) => a.department === department);
          const avg =
            deptAudits.reduce((sum, a) => sum + (a.compliance || 0), 0) / deptAudits.length;
          return { department, compliance: Math.round(avg) };
        })
      : Object.entries(deptMap).map(([department, v]) => ({
          department,
          compliance: pct(v.compliant, v.total),
        }));

  const avgCompliance =
    audits.length > 0
      ? Math.round(audits.reduce((s, a) => s + (a.compliance || 0), 0) / audits.length)
      : 100 - pct(nonCompliantChecklist.length, checklist.length || 1);

  const auditsCompleted = audits.filter((a) => a.status === "Completed").length;

  // --- Vulnerability areas (the "how vulnerable, by how much, how to fix" table) ---
  const vulnerabilityAreas: VulnerabilityArea[] = [
    {
      key: "checklist",
      label: "Compliance Checklist",
      exposurePct: pct(nonCompliantChecklist.length, checklist.length || 1),
      severityScore: pct(
        checklist.filter((c) => c.status === "Non-Compliant").length,
        checklist.length || 1
      ),
      openCount: nonCompliantChecklist.length,
      totalCount: checklist.length,
      topFixes: nonCompliantChecklist
        .slice(0, 3)
        .map((c) => `${c.clause}: ${c.title} — provide/renew evidence and close gap`),
    },
    {
      key: "findings",
      label: "Audit Findings",
      exposurePct: pct(openFindings.length, findings.length || 1),
      severityScore: pct(majorOpenFindings.length, findings.length || 1),
      openCount: openFindings.length,
      totalCount: findings.length,
      topFixes: majorOpenFindings.slice(0, 3).map((f) => `${f.code || ""} ${f.title} — remediate before ${f.dueDate ? new Date(f.dueDate).toLocaleDateString() : "due date"}`),
    },
    {
      key: "risks",
      label: "Risk Register",
      exposurePct: pct(openRisks.length, risks.length || 1),
      severityScore: pct(criticalOpenRisks.length, risks.length || 1),
      openCount: openRisks.length,
      totalCount: risks.length,
      topFixes: criticalOpenRisks
        .slice(0, 3)
        .map((r) => `${r.code || ""} ${r.title} — ${r.mitigationPlan || "mitigation plan needed"}`),
    },
    {
      key: "capa",
      label: "CAPA (Corrective/Preventive Actions)",
      exposurePct: pct(
        capas.filter((c) => c.status !== "Closed" && c.status !== "Verified").length,
        capas.length || 1
      ),
      severityScore: pct(overdueCapas.length, capas.length || 1),
      openCount: overdueCapas.length,
      totalCount: capas.length,
      topFixes: overdueCapas
        .slice(0, 3)
        .map((c) => `${c.code || ""} ${c.title} — overdue since ${c.dueDate ? new Date(c.dueDate).toLocaleDateString() : "n/a"}; ${c.correctiveAction || ""}`),
    },
    {
      key: "assets",
      label: "Assets",
      exposurePct: pct(nonCompliantAssets.length, assets.length || 1),
      severityScore: pct(
        assets.filter((a) => a.assessmentStatus === "Non-Compliant").length,
        assets.length || 1
      ),
      openCount: nonCompliantAssets.length,
      totalCount: assets.length,
      topFixes: nonCompliantAssets
        .slice(0, 3)
        .map((a) => `${a.assetTag || ""} ${a.assetName} — re-assess and remediate condition/controls`),
    },
    {
      key: "vendors",
      label: "Vendor / Third-Party Risk",
      exposurePct: pct(highRiskVendors.length, vendors.length || 1),
      severityScore: pct(
        vendors.filter((v) => v.residualRisk === "Critical").length,
        vendors.length || 1
      ),
      openCount: highRiskVendors.length,
      totalCount: vendors.length,
      topFixes: highRiskVendors
        .slice(0, 3)
        .map((v) => `${v.code || ""} ${v.vendorName} — strengthen controls (currently ${v.controlEffectiveness}) or re-negotiate data access`),
    },
  ];

  const overallExposure = Math.round(
    vulnerabilityAreas.reduce((s, a) => s + a.exposurePct, 0) / vulnerabilityAreas.length
  );
  const overallLabel =
    overallExposure >= 60 ? "High Exposure" : overallExposure >= 35 ? "Moderate Exposure" : "Low Exposure";

  return {
    overallExposure,
    overallLabel,
    auditsCompleted,
    auditsTotal: audits.length,
    avgCompliance,
    findingsBySeverity,
    findingsByStatus,
    risksByLevel,
    riskMatrix,
    capaByStatus,
    complianceByDept,
    assetCompliance,
    vendorResidualRisk,
    vulnerabilityAreas,
    criticalOpenRisks,
    overdueCapas,
  };
}
