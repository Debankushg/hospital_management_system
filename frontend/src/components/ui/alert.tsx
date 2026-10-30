import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

const TONES = {
  error: { box: "border-red-200 bg-red-50 text-red-800", Icon: AlertCircle },
  success: { box: "border-emerald-200 bg-emerald-50 text-emerald-800", Icon: CheckCircle2 },
  info: { box: "border-brand-200 bg-brand-50 text-brand-ink", Icon: Info },
};

/** Inline message block (for form errors and notices). Transient feedback uses toasts instead. */
export function Alert({ tone = "info", children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  const { box, Icon } = TONES[tone];
  return (
    <div role="alert" className={cn("flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm", box)}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1 leading-relaxed">{children}</div>
    </div>
  );
}
