"use client";

import { Wallet } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabs } from "@/components/ui/tabs";
import { SPECIALTY_LABELS } from "@/config/roles.config";
import { useRevenueAnalytics } from "@/hooks/use-revenue-analytics";
import type { Specialty } from "@/types/role.types";
import { formatBucket, formatNumber, RANGE_OPTIONS, rangeFor, type RangeKey } from "@/utils/chart-range.util";
import { ChartCard, Kpi } from "./chart-card";
import { AXIS_STYLE, GRID_STROKE, GradientDef } from "./chart-defs";
import { ChartTooltip } from "./chart-tooltip";

/** Revenue from checked visits (consultation fees). Super admin, accounts and reception. */
export function RevenueChart() {
  const [range, setRange] = useState<RangeKey>("30d");
  const params = rangeFor(range);
  const { data, isLoading, error } = useRevenueAnalytics(params);
  const fmt = (b: string) => formatBucket(b, params.groupBy);
  const top = data?.bySpecialty[0]?.revenue ?? 0;

  return (
    <ChartCard
      title="Revenue"
      description="Consultation fees of checked visits: collected vs pending"
      icon={Wallet}
      controls={<Tabs options={RANGE_OPTIONS} value={range} onChange={setRange} />}
      isLoading={isLoading}
      error={error}
      kpis={
        data && (
          <>
            <Kpi label="Collected" value={formatNumber(data.totals.collected)} hint={`${Math.round(data.totals.collectionRate * 100)}% of billed`} />
            <Kpi label="Pending" value={formatNumber(data.totals.pending)} hint={`of ${formatNumber(data.totals.revenue)} billed`} />
            <Kpi label="Checked visits" value={formatNumber(data.totals.visits)} />
            <Kpi label="Top specialty" value={data.bySpecialty[0] ? SPECIALTY_LABELS[data.bySpecialty[0].specialty as Specialty] ?? data.bySpecialty[0].specialty : "–"} />
          </>
        )
      }
    >
      <div className="flex h-full flex-col gap-3">
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.series ?? []} margin={{ top: 6, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <GradientDef id="g-collected" color="var(--chart-teal)" from={0.95} to={0.45} />
                <GradientDef id="g-pending" color="var(--chart-amber)" from={0.9} to={0.4} />
              </defs>
              <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="bucket" tickFormatter={fmt} axisLine={AXIS_STYLE} tickLine={false} minTickGap={24} />
              <YAxis tickFormatter={formatNumber} axisLine={false} tickLine={false} />
              <Tooltip
                content={<ChartTooltip labelFormatter={fmt} valueFormatter={formatNumber} />}
                cursor={{ fill: "var(--chart-teal)", fillOpacity: 0.08 }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 4 }} />
              <Bar dataKey="collected" name="Collected" stackId="rev" fill="url(#g-collected)" maxBarSize={36} />
              <Bar dataKey="pending" name="Pending" stackId="rev" fill="url(#g-pending)" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {!!data?.bySpecialty.length && (
          <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2" aria-label="Billed by specialty">
            {data.bySpecialty.slice(0, 4).map((s) => (
              <li key={s.specialty} className="flex items-center gap-3 text-xs">
                <span className="w-24 shrink-0 truncate text-slate-600">{SPECIALTY_LABELS[s.specialty as Specialty] ?? s.specialty}</span>
                <span className="h-1.5 flex-1 rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full bg-brand-500 shadow-[0_0_8px_var(--glow)]"
                    style={{ width: `${top ? Math.max(4, (s.revenue / top) * 100) : 0}%` }}
                  />
                </span>
                <span className="w-14 shrink-0 text-right font-medium text-slate-900">{formatNumber(s.revenue)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ChartCard>
  );
}
