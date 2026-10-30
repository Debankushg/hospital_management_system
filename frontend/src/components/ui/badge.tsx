import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Tone = "gray" | "green" | "red" | "teal" | "amber" | "purple" | "dark";

const TONES: Record<Tone, string> = {
  gray: "bg-slate-100 text-slate-700 ring-slate-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  teal: "bg-brand-50 text-brand-ink ring-brand-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  purple: "bg-violet-50 text-violet-700 ring-violet-200",
  dark: "bg-neutral-800 text-white ring-neutral-600",
};

export function Badge({ tone = "gray", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}
