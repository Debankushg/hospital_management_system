"use client";

import { Stethoscope } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabs } from "@/components/ui/tabs";
import { useDoctorAnalytics } from "@/hooks/use-doctor-analytics";
import { formatNumber, WORKLOAD_OPTIONS, workloadRangeFor, type WorkloadRangeKey } from "@/utils/chart-range.util";
import { ChartCard, Kpi } from "./chart-card";
import { AXIS_STYLE, GRID_STROKE, GradientDef } from "./chart-defs";
import { ChartTooltip } from "./chart-tooltip";

/** Checked vs still-to-see patients for every doctor. Doctors and the super admin. */
export function DoctorsChart() {
  const [range, setRange] = useState<WorkloadRangeKey>("today");
  const { data, isLoading, error } = useDoctorAnalytics(workloadRangeFor(range));
  const total = (data?.totals.checked ?? 0) + (data?.totals.unchecked ?? 0);
  const rows = (data?.doctors ?? []).map((d) => ({ ...d, name: `Dr. ${d.doctorName.split(" ")[0]}` }));

  return (
    <ChartCard
      title="Doctors: checked vs to see"
      description="Every doctor's patients in the selected period"
      icon={Stethoscope}
      controls={<Tabs options={WORKLOAD_OPTIONS} value={range} onChange={setRange} />}
      isLoading={isLoading}
      error={error}
      kpis={
        data && (
          <>
            <Kpi label="Checked" value={formatNumber(data.totals.checked)} />
            <Kpi label="To see" value={formatNumber(data.totals.unchecked)} />
            <Kpi label="Completion" value={total ? `${Math.round((data.totals.checked / total) * 100)}%` : "–"} />
            <Kpi label="Doctors" value={rows.length} />
          </>
        )
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 6, right: 8, left: -18, bottom: 0 }} barGap={4}>
          <defs>
            <GradientDef id="g-doc-checked" color="var(--chart-teal)" from={0.95} to={0.3} />
            <GradientDef id="g-doc-unchecked" color="var(--chart-amber)" from={0.95} to={0.3} />
          </defs>
          <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 4" vertical={false} />
          <XAxis dataKey="name" axisLine={AXIS_STYLE} tickLine={false} interval={0} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--chart-teal)", fillOpacity: 0.08 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "var(--color-slate-500)" }} />
          <Bar dataKey="checked" name="Checked" fill="url(#g-doc-checked)" radius={[6, 6, 0, 0]} maxBarSize={32} />
          <Bar dataKey="unchecked" name="To see" fill="url(#g-doc-unchecked)" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
