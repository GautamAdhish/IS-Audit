import React from "react";
import type { LucideIcon } from "lucide-react";
import StatTile from "../../components/common/StatTile";

const toneMap = {
  good: "green",
  warn: "amber",
  bad: "red",
  neutral: "neutral",
} as const;

// A plain-language "figurine" stat block for the board report — a big icon,
// a big number, and one sentence. No codes, no jargon, no chart literacy
// required to read it. Thin wrapper around the shared StatTile so this and
// TechnicalReport's headline metrics share one implementation.
const Figurine: React.FC<{
  icon: LucideIcon;
  value: string | number;
  label: string;
  tone?: "good" | "warn" | "bad" | "neutral";
}> = ({ icon, value, label, tone = "neutral" }) => (
  <StatTile
    icon={icon}
    value={value}
    label={label}
    tone={toneMap[tone]}
    variant="figure"
  />
);

export default Figurine;
