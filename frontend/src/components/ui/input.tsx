import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

export const inputClassName =
  "h-10 w-full rounded-lg border border-slate-300 bg-surface px-3 text-sm text-slate-900 shadow-sm outline-none transition " +
  "placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 focus:shadow-[0_0_18px_-4px_var(--glow)] " +
  "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClassName, className)} {...props} />;
}
