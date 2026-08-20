import React, { useMemo, useState } from "react";
import { Printer, Users, ShieldAlert } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import { useSummaryData } from "./summary/useSummaryData";
import { computeInsights } from "./summary/computeInsights";
import GeneralReport from "./summary/GeneralReport";
import TechnicalReport from "./summary/TechnicalReport";
import AINarrativePanel from "./summary/AINarrativePanel";

type ReportType = "general" | "technical";

export default function SummaryPage() {
  const data = useSummaryData();
  const [reportType, setReportType] = useState<ReportType>("general");
  const insights = useMemo(() => computeInsights(data), [data]);

  return (
    <div>
      <div className="print:hidden">
        <PageHeader
          title="Summary Report"
          subtitle="Generate a board-ready overview or a full technical report for auditors"
          action={
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-950 text-white text-sm font-medium hover:opacity-90 transition"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
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
      </div>

      {/* Print-only header, shown only when printing so the exported PDF is labeled */}
      <div className="hidden print:block mb-4">
        <h1 className="text-xl font-bold text-ink-900">
          {reportType === "general"
            ? "General Summary Report — Board"
            : "Technical Summary Report — Auditors"}
        </h1>
        <p className="text-xs text-slate-500">
          Generated {new Date().toLocaleString()}
        </p>
      </div>

      {data.loading ? (
        <div className="py-24 text-center text-sm text-slate-400">
          Loading audit data…
        </div>
      ) : data.error ? (
        <div className="py-24 text-center text-sm text-red-500">
          {data.error}
        </div>
      ) : reportType === "general" ? (
        <div className="space-y-6">
          <AINarrativePanel
            key="general"
            reportType="general"
            insights={insights}
          />
          <GeneralReport insights={insights} />
        </div>
      ) : (
        <div className="space-y-6">
          <AINarrativePanel
            key="technical"
            reportType="technical"
            insights={insights}
          />
          <TechnicalReport insights={insights} />
        </div>
      )}
    </div>
  );
}
