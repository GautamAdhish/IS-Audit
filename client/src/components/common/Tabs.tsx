import React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "../../utils/cn";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

// A trigger-only segmented control — the app renders each mode's content
// itself (below/beside this), so there's no Tabs.Content here by design.
const Tabs: React.FC<TabsProps> = ({ items, value, onValueChange, className }) => (
  <RadixTabs.Root value={value} onValueChange={onValueChange} className={className}>
    <RadixTabs.List className="inline-flex items-center gap-1 rounded-lg border border-ink-900/10 bg-white p-1">
      {items.map((item) => (
        <RadixTabs.Trigger
          key={item.value}
          value={item.value}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-slate-500 transition-colors",
            "hover:text-ink-900",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:ring-offset-1",
            "data-[state=active]:bg-brass-500 data-[state=active]:text-ink-950",
          )}
        >
          {item.icon}
          {item.label}
        </RadixTabs.Trigger>
      ))}
    </RadixTabs.List>
  </RadixTabs.Root>
);

export default Tabs;
