import { HeartPulse } from "lucide-react";

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      <span className="flex size-14 animate-glow-pulse items-center justify-center rounded-2xl bg-brand-600 text-white">
        <HeartPulse className="size-7" />
      </span>
      <p className="text-sm font-medium text-slate-500">Loading…</p>
    </div>
  );
}
