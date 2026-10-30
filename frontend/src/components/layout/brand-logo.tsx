import { HeartPulse } from "lucide-react";
import { cn } from "@/utils/cn";

export function BrandLogo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl shadow-sm",
          light ? "bg-white/15 text-white ring-1 ring-white/30 shadow-[0_0_22px_-2px_rgb(94_234_212/0.8)]" : "bg-brand-600 text-white shadow-[0_0_18px_-3px_var(--glow)]",
        )}
      >
        <HeartPulse className="size-5" />
      </span>
      <span className={cn("text-base font-semibold tracking-tight", light ? "text-white" : "text-slate-900")}>
        Hospital MS
      </span>
    </div>
  );
}
