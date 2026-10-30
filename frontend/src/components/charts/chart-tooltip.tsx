interface TooltipEntry {
  name?: string | number;
  value?: number | string;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: readonly TooltipEntry[];
  /** Turns the x-axis value into a readable title. */
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number) => string;
}

/** Theme-aware tooltip (follows light / dark mode, soft neon glow). */
export function ChartTooltip({ active, label, payload, labelFormatter, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const title = label !== undefined ? (labelFormatter ? labelFormatter(String(label)) : String(label)) : "";

  return (
    <div className="min-w-36 rounded-lg border border-slate-200 bg-surface px-3 py-2.5 text-sm shadow-pop">
      {title && <p className="mb-1.5 font-medium text-slate-900">{title}</p>}
      <ul className="space-y-1">
        {payload.map((p) => (
          <li key={String(p.name)} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-slate-600">
              <span className="size-2 rounded-full" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
              {p.name}
            </span>
            <span className="font-semibold text-slate-900">
              {typeof p.value === "number" && valueFormatter ? valueFormatter(p.value) : p.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
