import React from "react";

interface ComplianceHeroCardProps {
  value: number;
  label?: string;
}

// The reference's tactile "credit card" hero widget, adapted for the audit
// domain: a flat solid ink-950 block (no gradient) with the real overall
// compliance figure, a watermark icon, and a progress bar + caption whose
// tone is derived from the real value — no fabricated trend numbers.
const ComplianceHeroCard: React.FC<ComplianceHeroCardProps> = ({
  value,
  label = "Overall Compliance",
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const completedValue = normalizedValue;
  const incompleteValue = 100 - normalizedValue;

  const caption =
    normalizedValue >= 85
      ? "Strong compliance posture across tracked controls."
      : normalizedValue >= 70
        ? "Steady position, with room to close remaining gaps."
        : "Below target — prioritise open findings and CAPAs.";

  return (
    <div className="relative overflow-hidden bg-ink-950 rounded-3xl p-6 h-full flex flex-col items-center justify-center text-center shadow-[0_1px_3px_rgba(16,26,46,0.06)]">
      <div className="relative z-10 flex flex-col items-center">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
          {label}
        </p>

        <div className="relative mt-4 h-44 w-44">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#d7a84d 0 ${completedValue}%, rgba(148,163,184,0.25) ${completedValue}% 100%)`,
            }}
          />
          <div className="absolute inset-[16px] rounded-full bg-ink-950" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-white tracking-tight leading-none">
              {normalizedValue}
            </span>
            <span className="mt-1 text-xl text-brass-400">%</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-5 text-[10px] uppercase tracking-wide text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brass-400" /> Complete
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-400/60" /> Incomplete
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-5 w-full space-y-3">
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-brass-500"
            style={{ width: `${normalizedValue}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{caption}</p>
      </div>
    </div>
  );
};

export default ComplianceHeroCard;
