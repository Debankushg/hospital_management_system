import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
}

export function StatCard({ label, value, icon: Icon, href }: StatCardProps) {
  const card = (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-slate-200 bg-surface p-5 shadow-card",
        href && "transition hover:border-brand-300 hover:shadow-pop",
      )}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-ink shadow-[0_0_18px_-6px_var(--glow)] ring-1 ring-brand-200">
        <Icon className="size-6" />
      </span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      </div>
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}
