"use client";

import { Users } from "lucide-react";
import { useState } from "react";
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabs } from "@/components/ui/tabs";
import { usePatientAnalytics } from "@/hooks/use-patient-analytics";
import { formatBucket, formatNumber, RANGE_OPTIONS, rangeFor, type RangeKey } from "@/utils/chart-range.util";
import { ChartCard, Kpi } from "./chart-card";
import { AXIS_STYLE, GRID_STROKE, GradientDef } from "./chart-defs";
import { ChartTooltip } from "./chart-tooltip";

/** Patient volume for the whole hospital (aggregate counts). Shown to everyone. */
export function PatientsChart() {
  const [range, setRange] = useState<RangeKey>("30d");
  const params = rangeFor(range);
  const { data, isLoading, error } = usePatientAnalytics(params);
  const fmt = (b: string) => formatBucket(b, params.groupBy);

  return (
    <ChartCard
      title="Patients"
      description="Appointments by status and new patient registrations"
      icon={Users}
      controls={<Tabs options={RANGE_OPTIONS} value={range} onChange={setRange} />}
      isLoading={isLoading}
      error={error}
      kpis={
        data && (
          <>
            <Kpi label="Total patients" value={formatNumber(data.totals.totalPatients)} />
            <Kpi label="New in period" value={formatNumber(data.totals.newPatients)} />
            <Kpi label="Appointments" value={formatNumber(data.totals.appointments)} />
            <Kpi label="Patients checked" value={formatNumber(data.totals.checked)} />
          </>
        )
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data?.series ?? []} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <GradientDef id="g-checked" color="var(--chart-teal)" />
            <GradientDef id="g-approved" color="var(--chart-cyan)" from={0.4} />
            <GradientDef id="g-requested" color="var(--chart-amber)" from={0.4} />
          </defs>
          <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 4" vertical={false} />
          <XAxis dataKey="bucket" tickFormatter={fmt} axisLine={AXIS_STYLE} tickLine={false} minTickGap={24} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip labelFormatter={fmt} />} cursor={{ stroke: "var(--chart-teal)", strokeOpacity: 0.3 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "var(--color-slate-500)" }} />
          <Area type="monotone" stackId="a" dataKey="checked" name="Checked" stroke="var(--chart-teal)" strokeWidth={2} fill="url(#g-checked)" />
          <Area type="monotone" stackId="a" dataKey="approved" name="Approved" stroke="var(--chart-cyan)" strokeWidth={2} fill="url(#g-approved)" />
          <Area type="monotone" stackId="a" dataKey="requested" name="Requested" stroke="var(--chart-amber)" strokeWidth={2} fill="url(#g-requested)" />
          <Line type="monotone" dataKey="newPatients" name="New patients" stroke="var(--chart-violet)" strokeWidth={2.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
