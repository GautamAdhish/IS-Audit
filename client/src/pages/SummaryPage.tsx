import React, { useMemo, useRef, useState } from "react";
import { FileDown, Loader2, Users, ShieldAlert } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useSummaryData } from "./summary/useSummaryData";
import { computeInsights } from "./summary/computeInsights";
import GeneralReport from "./summary/GeneralReport";
import TechnicalReport from "./summary/TechnicalReport";
import AINarrativePanel from "./summary/AINarrativePanel";
import { exportSectionsToPdf } from "../lib/exportPdf";

type ReportType = "general" | "technical";

export default function SummaryPage() {
  const data = useSummaryData();
  const { user } = useAuth();
  const [reportType, setReportType] = useState<ReportType>("general");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const insights = useMemo(() => computeInsights(data), [data]);
  const reportRef = useRef<HTMLDivElement>(null);

  const reportTitle =
    reportType === "general" ? "General Summary Report — Board" : "Technical Summary Report — Auditors";

  const handleExport = async () => {
    if (!reportRef.current || exporting) return;
    setExporting(true);
    setExportError("");
    try {
      const dateStamp = new Date().toISOString().slice(0, 10);
      await exportSectionsToPdf(
        reportRef.current,
        {
          title: reportTitle,
          subtitle:
            reportType === "general"
              ? "Board-ready overview of security & compliance posture"
              : "Full technical detail for auditors — exposure, trajectory, remediation",
          classification: "Confidential — Internal Use Only",
          preparedBy: user?.name || user?.email || "IS-Audit System",
          generatedAt: new Date(),
        },
        `IS-Audit-${reportType}-report-${dateStamp}.pdf`
      );
    } catch (e: any) {
      setExportError(e.message || "Failed to generate PDF.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Summary Report"
        subtitle="Generate a board-ready overview or a full technical report for auditors"
        action={
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={handleExport}
              disabled={exporting || data.loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-950 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              {exporting ? "Preparing PDF…" : "Download PDF"}
            </button>
            {exportError && <p className="text-xs text-red-500">{exportError}</p>}
          </div>
        }
      />

      {/* Report type toggle */}
      <div className="inline-flex rounded-lg border border-ink-900/10 bg-white p-1 mb-6">
        <button
          onClick={() => setReportType("general")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
            reportType === "general"
              ? "bg-brass-500 text-ink-950"
              : "text-slate-500 hover:text-ink-900"
          }`}
        >
          <Users className="w-4 h-4" />
          General Report
          <span className="text-[10px] font-normal opacity-75">(Board)</span>
        </button>
        <button
          onClick={() => setReportType("technical")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
            reportType === "technical"
              ? "bg-brass-500 text-ink-950"
              : "text-slate-500 hover:text-ink-900"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Technical Report
          <span className="text-[10px] font-normal opacity-75">
            (Auditors)
          </span>
        </button>
      </div>

      {data.loading ? (
        <div className="py-24 text-center text-sm text-slate-400">
          Loading audit data…
        </div>
      ) : data.error ? (
        <div className="py-24 text-center text-sm text-red-500">
          {data.error}
        </div>
      ) : (
        // This is exactly what gets captured for the PDF — nothing outside
        // this ref (page header, report-type toggle, download button) is
        // ever included, so we don't need any print-media trickery to hide
        // app chrome from the export.
        <div ref={reportRef}>
          {reportType === "general" ? (
            <div className="space-y-6">
              <AINarrativePanel key="general" reportType="general" insights={insights} />
              <GeneralReport insights={insights} />
            </div>
          ) : (
            <div className="space-y-6">
              <AINarrativePanel key="technical" reportType="technical" insights={insights} />
              <TechnicalReport insights={insights} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
