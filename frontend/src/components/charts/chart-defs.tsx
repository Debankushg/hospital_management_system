/** Vertical neon gradient used to fill areas and bars. `id` is referenced as url(#id). */
export function GradientDef({ id, color, from = 0.55, to = 0.02 }: { id: string; color: string; from?: number; to?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={from} />
      <stop offset="100%" stopColor={color} stopOpacity={to} />
    </linearGradient>
  );
}

export const AXIS_STYLE = { stroke: "var(--color-slate-200)" } as const;
export const GRID_STROKE = "var(--color-slate-200)";
