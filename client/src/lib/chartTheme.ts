// Single source of truth for Recharts styling so every chart (dashboard +
// summary report) stays visually in sync with the ink/brass design tokens
// instead of each file hardcoding its own copy of the same hex values.
export const CHART_COLORS = {
  good: "#4caf37",
  warn: "#f59e0b",
  bad: "#ef4444",
  badStrong: "#dc2626",
  neutral: "#64748b",
  grid: "#f1f5f9",
  ink: "#383842",
};

export function complianceColor(value: number): string {
  if (value >= 85) return CHART_COLORS.good;
  if (value >= 70) return CHART_COLORS.warn;
  return CHART_COLORS.bad;
}

export const chartAxisTick = { fontSize: 11, fill: CHART_COLORS.neutral };

export const chartGridProps = {
  strokeDasharray: "3 3",
  stroke: CHART_COLORS.grid,
};

export const chartTooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

// Rounded-top bars + flat (non-gradient) translucent area fills, used by the
// bento-style dashboard cards. Kept as plain numbers/opacities rather than an
// SVG <linearGradient> so area charts stay a flat solid fill, per the
// no-gradients rule — only the bar corner radius is genuinely new here.
export const barRadius: [number, number, number, number] = [8, 8, 0, 0];
export const areaFillOpacity = 0.16;
