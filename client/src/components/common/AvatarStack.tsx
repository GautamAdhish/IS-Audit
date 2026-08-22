import React from "react";
import { cn } from "../../utils/cn";

const ringColors = [
  "bg-ink-800",
  "bg-brass-600",
  "bg-ink-600",
  "bg-brass-500",
  "bg-ink-700",
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

interface AvatarStackProps {
  names: string[];
  max?: number;
  className?: string;
}

// Overlapping initials-avatars with a "+N" overflow bubble, built entirely
// from names already present in data the app fetches elsewhere (no avatar
// images/new endpoints required).
const AvatarStack: React.FC<AvatarStackProps> = ({ names, max = 4, className }) => {
  const unique = Array.from(new Set(names.filter(Boolean)));
  const shown = unique.slice(0, max);
  const overflow = unique.length - shown.length;

  return (
    <div className={cn("flex items-center -space-x-2.5", className)}>
      {shown.map((name, i) => (
        <div
          key={name}
          title={name}
          className={cn(
            "w-9 h-9 rounded-full ring-2 ring-white grid place-items-center text-[11px] font-semibold text-white shrink-0",
            ringColors[i % ringColors.length],
          )}
        >
          {initials(name)}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-9 h-9 rounded-full ring-2 ring-white bg-slate-200 text-slate-600 grid place-items-center text-[11px] font-semibold shrink-0">
          +{overflow}
        </div>
      )}
    </div>
  );
};

export default AvatarStack;
