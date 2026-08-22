import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

type StatTone =
  | "neutral"
  | "green"
  | "amber"
  | "red"
  | "blue"
  | "purple"
  | "orange"
  | "indigo";

const toneMap: Record<
  StatTone,
  { icon: string; bg: string; ring: string; text: string }
> = {
  neutral: { icon: "text-ink-700", bg: "bg-slate-100", ring: "ring-slate-200", text: "text-ink-900" },
  green: { icon: "text-green-600", bg: "bg-green-50", ring: "ring-green-200", text: "text-green-600" },
  amber: { icon: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200", text: "text-amber-600" },
  red: { icon: "text-red-600", bg: "bg-red-50", ring: "ring-red-200", text: "text-red-600" },
  blue: { icon: "text-ink-600", bg: "bg-ink-500/10", ring: "ring-ink-500/20", text: "text-ink-900" },
  purple: { icon: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-200", text: "text-purple-600" },
  orange: { icon: "text-orange-600", bg: "bg-orange-50", ring: "ring-orange-200", text: "text-orange-600" },
  indigo: { icon: "text-indigo-600", bg: "bg-indigo-50", ring: "ring-indigo-200", text: "text-indigo-600" },
};

interface StatTileProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: StatTone;
  variant?: "figure" | "plain" | "card";
  className?: string;
}

// One stat-tile component covering every "number + label" treatment in the
// app: the board report's centered icon blocks ("figure"), the technical
// report's bare label/value pairs ("plain"), and the dashboard's card-style
// KPI grid ("card") — previously three separate hand-rolled implementations.
const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  variant = "figure",
  className,
}) => {
  const colors = toneMap[tone] ?? toneMap.neutral;

  if (variant === "plain") {
    return (
      <div className={className}>
        <p className="text-[11px] text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <p className={cn("text-2xl font-bold mt-0.5", colors.text)}>{value}</p>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "bg-white rounded-2xl shadow-[0_1px_3px_rgba(16,26,46,0.06)] p-4 flex items-center gap-3",
          className,
        )}
      >
        <div
          className={cn(
            "w-10 h-10 rounded-full grid place-items-center shrink-0 ring-1",
            colors.bg,
            colors.ring,
          )}
        >
          {Icon && <Icon className={cn("w-4.5 h-4.5", colors.icon)} />}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold text-ink-900 leading-tight truncate">
            {value}
          </p>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide truncate">
            {label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center text-center gap-2 px-3", className)}>
      <div
        className={cn(
          "w-16 h-16 rounded-2xl ring-1 grid place-items-center",
          colors.bg,
          colors.ring,
        )}
      >
        {Icon && <Icon className={cn("w-7 h-7", colors.icon)} />}
      </div>
      <p className="text-2xl font-bold text-ink-900 leading-none">{value}</p>
      <p className="text-xs text-slate-500 leading-snug max-w-[9rem]">{label}</p>
    </div>
  );
};

export default StatTile;
