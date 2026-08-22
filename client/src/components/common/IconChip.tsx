import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

type ChipTone = "neutral" | "green" | "amber" | "red" | "blue" | "purple" | "orange" | "indigo";

const toneClasses: Record<ChipTone, string> = {
  neutral: "bg-slate-100 text-slate-600",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  blue: "bg-ink-500/10 text-ink-700",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

interface IconChipProps {
  icon: LucideIcon;
  tone?: ChipTone;
  className?: string;
}

// Small rounded-square icon container used to give table rows and compact
// cards a visual anchor (e.g. one per department/audit in a table row)
// instead of plain text in the leading column.
const IconChip: React.FC<IconChipProps> = ({ icon: Icon, tone = "neutral", className }) => (
  <div
    className={cn(
      "w-9 h-9 rounded-xl grid place-items-center shrink-0",
      toneClasses[tone],
      className,
    )}
  >
    <Icon className="w-4 h-4" />
  </div>
);

export default IconChip;
