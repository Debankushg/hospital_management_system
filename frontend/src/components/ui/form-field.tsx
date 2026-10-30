import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, error, hint, children }: FormFieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && !error && <span className="block text-xs leading-relaxed text-slate-500">{hint}</span>}
      {error && (
        <span className="flex items-center gap-1 text-xs font-medium text-red-600">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </span>
      )}
    </label>
  );
}
