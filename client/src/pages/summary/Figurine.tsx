import React from "react";
import type { LucideIcon } from "lucide-react";

// A plain-language "figurine" stat block for the board report — a big icon,
// a big number, and one sentence. No codes, no jargon, no chart literacy
// required to read it.
const Figurine: React.FC<{
  icon: LucideIcon;
  value: string | number;
  label: string;
  tone?: "good" | "warn" | "bad" | "neutral";
}> = ({ icon: Icon, value, label, tone = "neutral" }) => {
  const toneMap = {
    good: { bg: "bg-green-50", ring: "ring-green-200", icon: "text-green-600" },
    warn: { bg: "bg-amber-50", ring: "ring-amber-200", icon: "text-amber-600" },
    bad: { bg: "bg-red-50", ring: "ring-red-200", icon: "text-red-600" },
    neutral: { bg: "bg-slate-50", ring: "ring-slate-200", icon: "text-ink-700" },
  }[tone];

  return (
    <div className="flex flex-col items-center text-center gap-2 px-3">
      <div className={`w-16 h-16 rounded-2xl ${toneMap.bg} ring-1 ${toneMap.ring} grid place-items-center`}>
        <Icon className={`w-7 h-7 ${toneMap.icon}`} />
      </div>
      <p className="text-2xl font-bold text-ink-900 leading-none">{value}</p>
      <p className="text-xs text-slate-500 leading-snug max-w-[9rem]">{label}</p>
    </div>
  );
};

export default Figurine;
