import { jsPDF } from "jspdf";
import autoTableImport from "jspdf-autotable";

// Defensive against interop differences between bundlers/runtimes (Vite's
// Rollup build vs. plain Node/ESM loaders resolve this package's default
// export differently) — this normalizes to the callable either way.
const autoTable = ((autoTableImport as any)?.default ?? autoTableImport) as typeof autoTableImport;
import type { Insights, VulnerabilityArea } from "../pages/summary/computeInsights";

export interface PdfMeta {
  title: string;
  subtitle?: string;
  classification?: string;
  preparedBy?: string;
  generatedAt?: Date;
}

export interface NarrativeData {
  headline: string;
  narrative: string;
  topConcerns: string[];
  recommendations: string[];
}

export type ReportType = "general" | "technical";

// -----------------------------------------------------------------------------
// Layout constants (A4, points)
// -----------------------------------------------------------------------------

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 42;
const CONTENT_W = PAGE_W - MARGIN * 2;
const HEADER_H = 24;
const FOOTER_H = 20;

// -----------------------------------------------------------------------------
// Brand palette — mirrors the app's `index.css` design tokens so the exported
// report reads as the same product, not a generic PDF.
// -----------------------------------------------------------------------------

const INK_950: [number, number, number] = [38, 38, 47];
const INK_900: [number, number, number] = [46, 46, 56];
const BRASS_400: [number, number, number] = [116, 201, 72];
const BRASS_500: [number, number, number] = [76, 175, 55];
const BRASS_600: [number, number, number] = [60, 140, 44];
const SLATE_400: [number, number, number] = [148, 163, 184];
const SLATE_500: [number, number, number] = [100, 116, 139];
const SLATE_600: [number, number, number] = [71, 85, 105];
const SLATE_700: [number, number, number] = [51, 65, 85];
const BORDER: [number, number, number] = [226, 232, 240];
const PANEL_BG: [number, number, number] = [248, 250, 252];
const RED_600: [number, number, number] = [220, 38, 38];
const AMBER_600: [number, number, number] = [217, 119, 6];
const WHITE: [number, number, number] = [255, 255, 255];

function toneColor(tone: "good" | "warn" | "bad"): [number, number, number] {
  return tone === "bad" ? RED_600 : tone === "warn" ? AMBER_600 : BRASS_600;
}

function exposureColor(pct: number): [number, number, number] {
  return pct >= 50 ? RED_600 : pct >= 25 ? AMBER_600 : BRASS_600;
}

// -----------------------------------------------------------------------------
// Small drawing helpers built around a running vertical cursor.
// -----------------------------------------------------------------------------

class ReportDoc {
  pdf: jsPDF;
  y: number;
  // Content pages get a reserved band at the top for the running header
  // (title + classification) and at the bottom for the footer (timestamp +
  // page number), both painted in a second pass once total page count is
  // known. Layout must never write into those bands.
  private contentTop = MARGIN + HEADER_H + 8;
  private contentBottom = PAGE_H - MARGIN - FOOTER_H - 8;

  constructor() {
    this.pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
    this.y = this.contentTop;
  }

  addPage() {
    this.pdf.addPage();
    this.y = this.contentTop;
  }

  /** Ensures at least `height` points remain before the bottom margin. */
  ensureSpace(height: number) {
    if (this.y + height > this.contentBottom) {
      this.addPage();
    }
  }

  color(c: [number, number, number], mode: "text" | "fill" | "draw" = "text") {
    if (mode === "text") this.pdf.setTextColor(...c);
    else if (mode === "fill") this.pdf.setFillColor(...c);
    else this.pdf.setDrawColor(...c);
  }

  hr(color: [number, number, number] = BORDER, gapAfter = 14) {
    this.ensureSpace(gapAfter + 2);
    this.color(color, "draw");
    this.pdf.setLineWidth(0.75);
    this.pdf.line(MARGIN, this.y, PAGE_W - MARGIN, this.y);
    this.y += gapAfter;
  }

  /** Call before starting a new section. Unlike a forced page break, this
   * only inserts a divider (and never a blank page) when content is already
   * flowing on the current page — if we're at the top of a fresh page, it's
   * a no-op, so sections pack onto as few pages as they actually need. */
  sectionBreak() {
    if (this.y > this.contentTop + 4) {
      this.hr(BORDER, 22);
    }
  }

  sectionTitle(text: string, opts: { subtitle?: string } = {}) {
    this.ensureSpace(34);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(12.5);
    this.color(INK_900);
    this.pdf.text(text, MARGIN, this.y);
    this.y += 15;
    if (opts.subtitle) {
      this.pdf.setFont("helvetica", "normal");
      this.pdf.setFontSize(8.5);
      this.color(SLATE_500);
      this.pdf.text(opts.subtitle, MARGIN, this.y);
      this.y += 12;
    }
    this.color(BRASS_500, "draw");
    this.pdf.setLineWidth(2);
    this.pdf.line(MARGIN, this.y, MARGIN + 28, this.y);
    this.y += 14;
  }

  subheading(text: string) {
    this.ensureSpace(16);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(9.5);
    this.color(INK_900);
    this.pdf.text(text, MARGIN, this.y);
    this.y += 13;
  }

  paragraph(text: string, opts: { size?: number; color?: [number, number, number]; gap?: number } = {}) {
    const size = opts.size ?? 9.5;
    const color = opts.color ?? SLATE_700;
    const gap = opts.gap ?? 8;
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(size);
    this.color(color);
    const lines = this.pdf.splitTextToSize(text, CONTENT_W) as string[];
    const lineH = size * 1.42;
    for (const line of lines) {
      this.ensureSpace(lineH);
      this.pdf.text(line, MARGIN, this.y);
      this.y += lineH;
    }
    this.y += gap;
  }

  bulletList(items: string[], dot: [number, number, number], opts: { emptyLabel?: string } = {}) {
    if (items.length === 0) {
      if (opts.emptyLabel) this.paragraph(opts.emptyLabel, { size: 9, color: SLATE_400, gap: 4 });
      return;
    }
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(9);
    const lineH = 12.5;
    for (const item of items) {
      const lines = this.pdf.splitTextToSize(item, CONTENT_W - 14) as string[];
      this.ensureSpace(lineH * lines.length + 2);
      this.color(dot, "fill");
      this.pdf.circle(MARGIN + 2.5, this.y - 3, 2, "F");
      this.color(SLATE_700);
      lines.forEach((line, i) => {
        this.pdf.text(line, MARGIN + 12, this.y + i * lineH);
      });
      this.y += lineH * lines.length + 2;
    }
    this.y += 6;
  }

  /** A row of labelled stat "figurines" — metric value with a small caption. */
  metricsRow(metrics: { label: string; value: string; tone?: "good" | "warn" | "bad" }[]) {
    const cols = metrics.length;
    const cellW = CONTENT_W / cols;
    const rowH = 52;
    this.ensureSpace(rowH + 10);
    this.color(PANEL_BG, "fill");
    this.color(BORDER, "draw");
    this.pdf.setLineWidth(0.75);
    this.pdf.roundedRect(MARGIN, this.y, CONTENT_W, rowH, 4, 4, "FD");

    metrics.forEach((m, i) => {
      const cx = MARGIN + cellW * i + cellW / 2;
      if (i > 0) {
        this.color(BORDER, "draw");
        this.pdf.line(MARGIN + cellW * i, this.y + 8, MARGIN + cellW * i, this.y + rowH - 8);
      }
      this.pdf.setFont("helvetica", "bold");
      this.pdf.setFontSize(15);
      this.color(m.tone ? toneColor(m.tone) : INK_900);
      this.pdf.text(m.value, cx, this.y + 24, { align: "center" });

      this.pdf.setFont("helvetica", "normal");
      this.pdf.setFontSize(7);
      this.color(SLATE_500);
      const labelLines = this.pdf.splitTextToSize(m.label.toUpperCase(), cellW - 10) as string[];
      labelLines.slice(0, 2).forEach((line, li) => {
        this.pdf.text(line, cx, this.y + 36 + li * 8, { align: "center" });
      });
    });

    this.y += rowH + 16;
  }

  /** Thin horizontal percentage bar, e.g. for exposure levels. */
  miniBar(x: number, y: number, w: number, h: number, pct: number, color: [number, number, number]) {
    this.color(BORDER, "fill");
    this.pdf.roundedRect(x, y, w, h, h / 2, h / 2, "F");
    const filled = Math.max(h, (Math.min(100, Math.max(0, pct)) / 100) * w);
    this.color(color, "fill");
    this.pdf.roundedRect(x, y, filled, h, h / 2, h / 2, "F");
  }

  table(options: Parameters<typeof autoTable>[1]) {
    autoTable(this.pdf, {
      ...options,
      startY: this.y,
      // Continuation pages that autoTable adds internally (long tables) must
      // respect the same reserved header/footer bands as everything else,
      // since the header/footer pass later runs over every page in the doc.
      margin: { left: MARGIN, right: MARGIN, top: this.contentTop, bottom: PAGE_H - this.contentBottom },
      styles: {
        font: "helvetica",
        fontSize: 8.5,
        textColor: SLATE_700,
        lineColor: BORDER,
        lineWidth: 0.5,
        cellPadding: 6,
        ...(options.styles || {}),
      },
      headStyles: {
        fillColor: INK_950,
        textColor: WHITE,
        fontStyle: "bold",
        fontSize: 8,
        ...(options.headStyles || {}),
      },
      alternateRowStyles: { fillColor: PANEL_BG, ...(options.alternateRowStyles || {}) },
    });
    // @ts-expect-error — jspdf-autotable augments the doc instance at runtime
    this.y = (this.pdf as any).lastAutoTable.finalY + 18;
  }
}

// -----------------------------------------------------------------------------
// Cover page
// -----------------------------------------------------------------------------

function drawCoverPage(doc: ReportDoc, meta: PdfMeta) {
  const { pdf } = doc;

  pdf.setFillColor(...INK_950);
  pdf.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Subtle accent bar
  pdf.setFillColor(...BRASS_500);
  pdf.rect(0, 0, PAGE_W, 6, "F");

  pdf.setTextColor(...BRASS_400);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("IS-AUDIT", MARGIN, 120);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...SLATE_400);
  pdf.text("Information Security Audit Management", MARGIN, 134);

  pdf.setTextColor(...WHITE);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(27);
  const titleLines = pdf.splitTextToSize(meta.title, CONTENT_W) as string[];
  pdf.text(titleLines, MARGIN, 178);

  let subtitleBottom = 178 + titleLines.length * 32;
  if (meta.subtitle) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(203, 213, 225);
    pdf.text(meta.subtitle, MARGIN, subtitleBottom + 12);
    subtitleBottom += 12;
  }

  // Classification badge
  const badgeText = (meta.classification || "Internal Use Only").toUpperCase();
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  const badgeW = pdf.getTextWidth(badgeText) + 20;
  pdf.setDrawColor(...BRASS_500);
  pdf.setLineWidth(1);
  pdf.roundedRect(MARGIN, subtitleBottom + 30, badgeW, 20, 10, 10, "S");
  pdf.setTextColor(...BRASS_400);
  pdf.text(badgeText, MARGIN + badgeW / 2, subtitleBottom + 43.5, { align: "center" });

  // Metadata block
  pdf.setDrawColor(70, 70, 82);
  pdf.setLineWidth(1);
  pdf.line(MARGIN, PAGE_H - 150, PAGE_W - MARGIN, PAGE_H - 150);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  let y = PAGE_H - 128;
  const drawRow = (label: string, value: string) => {
    pdf.setTextColor(...SLATE_400);
    pdf.text(label.toUpperCase(), MARGIN, y);
    pdf.setTextColor(...WHITE);
    pdf.text(value, MARGIN + 130, y);
    y += 18;
  };
  drawRow("Classification", meta.classification || "Internal Use Only");
  drawRow("Prepared by", meta.preparedBy || "IS-Audit System");
  drawRow("Generated", (meta.generatedAt || new Date()).toLocaleString());
  drawRow("Contents", "Executive narrative, key metrics, findings & remediation plan");
}

// -----------------------------------------------------------------------------
// Running header / footer, applied to every content page after layout.
// -----------------------------------------------------------------------------

function drawRunningHeader(pdf: jsPDF, meta: PdfMeta, pageNumber: number, totalContentPages: number) {
  pdf.setDrawColor(...BORDER);
  pdf.setLineWidth(0.75);
  pdf.line(MARGIN, MARGIN + HEADER_H - 8, PAGE_W - MARGIN, MARGIN + HEADER_H - 8);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...INK_900);
  pdf.text(meta.title, MARGIN, MARGIN + 8);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...SLATE_500);
  pdf.text(meta.classification || "Internal Use Only", PAGE_W - MARGIN, MARGIN + 8, { align: "right" });

  pdf.setDrawColor(...BORDER);
  pdf.line(MARGIN, PAGE_H - MARGIN - FOOTER_H + 10, PAGE_W - MARGIN, PAGE_H - MARGIN - FOOTER_H + 10);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...SLATE_400);
  pdf.text(`Generated ${(meta.generatedAt || new Date()).toLocaleString()}`, MARGIN, PAGE_H - MARGIN - 4);
  pdf.text(`Page ${pageNumber} of ${totalContentPages}`, PAGE_W - MARGIN, PAGE_H - MARGIN - 4, { align: "right" });
}

// -----------------------------------------------------------------------------
// Section builders
// -----------------------------------------------------------------------------

function drawNarrative(doc: ReportDoc, narrative: NarrativeData | null, reportType: ReportType) {
  doc.sectionBreak();
  doc.sectionTitle("Executive Narrative", {
    subtitle:
      reportType === "general"
        ? "Board-level summary, written from this audit's live data"
        : "Technical summary, written from this audit's live data",
  });

  if (!narrative) {
    doc.paragraph(
      "An AI narrative was not generated before this report was exported, so this section is a placeholder. " +
        "Open the Summary Report page, click \u201cGenerate AI Narrative,\u201d then re-export to include it.",
      { size: 9, color: SLATE_500 }
    );
    return;
  }

  doc.pdf.setFont("helvetica", "bold");
  doc.pdf.setFontSize(11);
  doc.color(INK_900);
  doc.ensureSpace(20);
  const headlineLines = doc.pdf.splitTextToSize(narrative.headline, CONTENT_W) as string[];
  headlineLines.forEach((l) => {
    doc.ensureSpace(15);
    doc.pdf.text(l, MARGIN, doc.y);
    doc.y += 15;
  });
  doc.y += 4;

  narrative.narrative.split("\n\n").forEach((p) => doc.paragraph(p));

  if (narrative.topConcerns?.length) {
    doc.subheading((reportType === "general" ? "Top Concerns" : "Highest-Priority Exposures").toUpperCase());
    doc.bulletList(narrative.topConcerns, RED_600);
  }
  if (narrative.recommendations?.length) {
    doc.subheading("RECOMMENDATIONS");
    doc.bulletList(narrative.recommendations, BRASS_600);
  }
}

function drawKeyMetrics(doc: ReportDoc, insights: Insights, reportType: ReportType) {
  doc.sectionBreak();
  doc.sectionTitle("Key Metrics", { subtitle: "Point-in-time snapshot across every tracked control area" });

  if (reportType === "general") {
    doc.metricsRow([
      { label: "Overall health", value: `${100 - insights.overallExposure}%`, tone: insights.overallExposure >= 60 ? "bad" : insights.overallExposure >= 35 ? "warn" : "good" },
      { label: "Audits completed", value: `${insights.auditsCompleted}/${insights.auditsTotal}`, tone: "good" },
      { label: "Avg. compliance", value: `${insights.avgCompliance}%`, tone: insights.avgCompliance >= 80 ? "good" : insights.avgCompliance >= 60 ? "warn" : "bad" },
      { label: "Serious risks open", value: `${insights.criticalOpenRisks.length}`, tone: insights.criticalOpenRisks.length > 0 ? "bad" : "good" },
    ]);
    const overallReadout =
      insights.overallExposure >= 60
        ? "A large share of the organisation's controls are not yet working as intended. Immediate management attention and budget are recommended to close the gap."
        : insights.overallExposure >= 35
        ? "Most controls are working, but a meaningful portion still need attention. Continued oversight is recommended to keep this from growing."
        : "The vast majority of controls are working as intended. Routine monitoring should be sufficient to keep it that way.";
    doc.paragraph(overallReadout);
  } else {
    doc.metricsRow([
      { label: "Overall exposure index", value: `${insights.overallExposure}%`, tone: insights.overallExposure >= 60 ? "bad" : insights.overallExposure >= 35 ? "warn" : "good" },
      { label: "Avg. compliance", value: `${insights.avgCompliance}%`, tone: insights.avgCompliance >= 80 ? "good" : insights.avgCompliance >= 60 ? "warn" : "bad" },
      { label: "Critical/high risks open", value: `${insights.criticalOpenRisks.length}`, tone: insights.criticalOpenRisks.length > 0 ? "bad" : "good" },
      { label: "Overdue CAPAs", value: `${insights.overdueCapas.length}`, tone: insights.overdueCapas.length > 0 ? "warn" : "good" },
    ]);
  }
}

function tallyTable(doc: ReportDoc, title: string, rows: { name: string; value: number }[], valueLabel = "Count") {
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  doc.subheading(title);
  doc.table({
    head: [[title.split(" by ")[1] ? title.split(" by ")[1] : "Category", valueLabel, "Share"]],
    body: rows.map((r) => [r.name, String(r.value), `${Math.round((r.value / total) * 100)}%`]),
    theme: "grid",
    columnStyles: { 1: { halign: "right", cellWidth: 60 }, 2: { halign: "right", cellWidth: 60 } },
  });
}

function drawGeneralBreakdown(doc: ReportDoc, insights: Insights) {
  doc.sectionBreak();
  doc.sectionTitle("What Kind of Issues Did We Find", { subtitle: "In plain terms — no technical detail" });

  const plainSeverity = insights.findingsBySeverity.map((s) => ({
    name: s.name === "Major" ? "Needs urgent fix" : s.name === "Minor" ? "Needs a fix" : "Just a note",
    value: s.value,
  }));
  doc.table({
    head: [["Issue type", "Count"]],
    body: plainSeverity.map((s) => [s.name, String(s.value)]),
    theme: "grid",
    columnStyles: { 1: { halign: "right", cellWidth: 70 } },
  });

  doc.subheading("COMPLIANCE BY DEPARTMENT");
  doc.table({
    head: [["Department", "Compliance"]],
    body: insights.complianceByDept.map((d) => [d.department, `${d.compliance}%`]),
    theme: "grid",
    columnStyles: { 1: { halign: "right", cellWidth: 70 } },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 1) {
        const v = parseInt(String(data.cell.raw), 10);
        data.cell.styles.textColor = exposureColor(100 - v);
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  doc.sectionBreak();
  doc.sectionTitle("Where We're Most Exposed", { subtitle: "The three areas needing the most attention right now" });
  const worst = [...insights.vulnerabilityAreas].sort((a, b) => b.exposurePct - a.exposurePct).slice(0, 3);
  worst.forEach((a) => drawAreaCard(doc, a, { short: true }));
}

function drawAreaCard(doc: ReportDoc, a: VulnerabilityArea, opts: { short?: boolean } = {}) {
  const barY = doc.y;
  doc.ensureSpace(46);
  doc.pdf.setFont("helvetica", "bold");
  doc.pdf.setFontSize(9.5);
  doc.color(INK_900);
  doc.pdf.text(a.label, MARGIN, doc.y);

  doc.pdf.setFont("helvetica", "bold");
  doc.pdf.setFontSize(9.5);
  doc.color(exposureColor(a.exposurePct));
  doc.pdf.text(`${a.exposurePct}% exposed`, PAGE_W - MARGIN, doc.y, { align: "right" });
  doc.y += 8;

  doc.miniBar(MARGIN, doc.y, CONTENT_W, 5, a.exposurePct, exposureColor(a.exposurePct));
  doc.y += 14;

  doc.pdf.setFont("helvetica", "normal");
  doc.pdf.setFontSize(8.5);
  doc.color(SLATE_600);
  doc.pdf.text(
    `${a.openCount} of ${a.totalCount} items still need work \u00b7 trajectory: ${a.trajectory}`,
    MARGIN,
    doc.y
  );
  doc.y += 14;

  if (!opts.short && a.topFixes.length) {
    doc.bulletList(a.topFixes, BRASS_600);
  }
  void barY;
  doc.y += 6;
}

function drawTechnicalBreakdown(doc: ReportDoc, insights: Insights) {
  doc.sectionBreak();
  doc.sectionTitle("Findings & Risk Breakdown", { subtitle: "Counts and share across every open register" });

  tallyTable(doc, "Findings by Severity", insights.findingsBySeverity);
  tallyTable(doc, "Findings by Status", insights.findingsByStatus);
  tallyTable(doc, "Risk Register by Level", insights.risksByLevel);
  tallyTable(doc, "CAPA by Status", insights.capaByStatus);

  doc.subheading("COMPLIANCE BY DEPARTMENT");
  doc.table({
    head: [["Department", "Compliance"]],
    body: insights.complianceByDept.map((d) => [d.department, `${d.compliance}%`]),
    theme: "grid",
    columnStyles: { 1: { halign: "right", cellWidth: 70 } },
  });

  tallyTable(doc, "Asset Compliance Status", insights.assetCompliance);
  tallyTable(doc, "Vendor Residual Risk", insights.vendorResidualRisk);
}

function drawPredictedRisks(doc: ReportDoc, insights: Insights) {
  doc.sectionBreak();
  doc.sectionTitle("Predicted Risk Ranking", {
    subtitle: "Control areas ranked by where the next exposure is likeliest to surface",
  });
  doc.table({
    head: [["Area", "Predicted Score", "Trajectory", "Exposure", "Severity Weight"]],
    body: insights.predictedRisks.map((a) => [
      a.label,
      `${a.predictedScore}`,
      a.trajectory,
      `${a.exposurePct}%`,
      `${a.severityScore}%`,
    ]),
    theme: "grid",
    columnStyles: {
      1: { halign: "right", cellWidth: 95 },
      2: { halign: "center", cellWidth: 75 },
      3: { halign: "right", cellWidth: 62 },
      4: { halign: "right", cellWidth: 75 },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 2) {
        const v = String(data.cell.raw);
        data.cell.styles.textColor = v === "Escalating" ? RED_600 : v === "Improving" ? BRASS_600 : AMBER_600;
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  if (insights.criticalOpenRisks.length) {
    doc.subheading("CRITICAL / HIGH OPEN RISKS");
    doc.table({
      head: [["Code", "Title", "Likel.", "Impact", "Score", "Level", "Mitigation Plan"]],
      body: insights.criticalOpenRisks.slice(0, 15).map((r: any) => [
        r.code || "\u2014",
        r.title || "\u2014",
        r.likelihood ?? "\u2014",
        r.impact ?? "\u2014",
        r.riskScore ?? "\u2014",
        r.level || "\u2014",
        r.mitigationPlan || "Mitigation plan needed",
      ]),
      theme: "grid",
      styles: { fontSize: 7.5 },
      columnStyles: {
        0: { cellWidth: 45 },
        2: { halign: "center", cellWidth: 40 },
        3: { halign: "center", cellWidth: 40 },
        4: { halign: "center", cellWidth: 38 },
        5: { halign: "center", cellWidth: 46 },
      },
    });
  }
}

function drawRemediationPlan(doc: ReportDoc, insights: Insights) {
  doc.sectionBreak();
  doc.sectionTitle("Vulnerability Detail & Remediation Plan", {
    subtitle: "Exposure by control area, predicted trajectory, and specific corrective actions pulled from the register",
  });

  doc.table({
    head: [["Area", "Exposure", "Severity", "Trajectory", "Open/Total", "Recommended Fixes"]],
    body: insights.vulnerabilityAreas.map((a) => [
      a.label,
      `${a.exposurePct}%`,
      `${a.severityScore}%`,
      a.trajectory,
      `${a.openCount}/${a.totalCount}`,
      a.topFixes.length ? a.topFixes.map((f) => `\u2022 ${f}`).join("\n") : "No open items",
    ]),
    theme: "grid",
    styles: { fontSize: 7.5, valign: "top" },
    columnStyles: {
      0: { cellWidth: 76, fontStyle: "bold" },
      1: { halign: "right", cellWidth: 50 },
      2: { halign: "right", cellWidth: 48 },
      3: { halign: "center", cellWidth: 58 },
      4: { halign: "center", cellWidth: 55 },
    },
    didParseCell: (data) => {
      if (data.section === "body") {
        if (data.column.index === 1) {
          const v = parseInt(String(data.cell.raw), 10);
          data.cell.styles.textColor = exposureColor(v);
          data.cell.styles.fontStyle = "bold";
        }
        if (data.column.index === 3) {
          const v = String(data.cell.raw);
          data.cell.styles.textColor = v === "Escalating" ? RED_600 : v === "Improving" ? BRASS_600 : AMBER_600;
          data.cell.styles.fontStyle = "bold";
        }
        if (data.column.index === 5 && String(data.cell.raw).startsWith("No open items")) {
          data.cell.styles.textColor = SLATE_400;
          data.cell.styles.fontStyle = "italic";
        }
      }
    },
  });
}

// -----------------------------------------------------------------------------
// Public entry point
// -----------------------------------------------------------------------------

export async function exportReportToPdf(
  insights: Insights,
  reportType: ReportType,
  narrative: NarrativeData | null,
  meta: PdfMeta,
  filename: string
): Promise<void> {
  const doc = new ReportDoc();

  drawCoverPage(doc, meta);
  doc.addPage();
  drawNarrative(doc, narrative, reportType);
  drawKeyMetrics(doc, insights, reportType);

  if (reportType === "general") {
    drawGeneralBreakdown(doc, insights);
  } else {
    drawTechnicalBreakdown(doc, insights);
    drawPredictedRisks(doc, insights);
  }

  drawRemediationPlan(doc, insights);

  // ---------------------------------------------------------------------------
  // Header / footer pass. getNumberOfPages() belongs directly to the jsPDF
  // instance and must not be accessed through pdf.internal.
  // ---------------------------------------------------------------------------
  const { pdf } = doc;
  const totalPages = pdf.getNumberOfPages();
  const totalContentPages = Math.max(0, totalPages - 1); // page 1 is the cover

  for (let pageNumber = 2; pageNumber <= totalPages; pageNumber++) {
    pdf.setPage(pageNumber);
    drawRunningHeader(pdf, meta, pageNumber - 1, totalContentPages);
  }

  pdf.save(filename);
}
