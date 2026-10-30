import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/utils/get-error-message.util";

interface ChartCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  /** Range selector etc., shown top right. */
  controls?: ReactNode;
  isLoading: boolean;
  error: unknown;
  /** Small KPI row above the chart. */
  kpis?: ReactNode;
  children: ReactNode;
}

/** Shared frame for dashboard charts: header, range controls, KPIs, loading and error states. */
export function ChartCard({ title, description, icon: Icon, controls, isLoading, error, kpis, children }: ChartCardProps) {
  return (
    <section className="neon-chart rounded-xl border border-slate-200 bg-surface p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-ink shadow-[0_0_18px_-6px_var(--glow)] ring-1 ring-brand-200">
            <Icon className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
        </div>
        {controls}
      </div>

      {error ? (
        <Alert tone="error">{getErrorMessage(error)}</Alert>
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          {kpis && <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{kpis}</div>}
          <div className="h-72 w-full">{children}</div>
        </>
      )}
    </section>
  );
}

export function Kpi({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-3">
      <p className="truncate text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 truncate text-xl font-semibold tracking-tight text-slate-900" title={String(value)}>
        {value}
      </p>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
