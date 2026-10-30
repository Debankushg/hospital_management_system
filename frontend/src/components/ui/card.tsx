import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-xl border border-slate-200 bg-surface p-6 shadow-card", className)} {...props} />;
}
