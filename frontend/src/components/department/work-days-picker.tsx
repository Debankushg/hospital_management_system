import { WEEK_DAYS } from "@/config/hr.config";
import { cn } from "@/utils/cn";

interface WorkDaysPickerProps {
  value: number[];
  onChange: (value: number[]) => void;
  error?: string;
}

export function WorkDaysPicker({ value, onChange, error }: WorkDaysPickerProps) {
  const toggle = (day: number) =>
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day].sort());

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-700">Working days</p>
      <div className="flex flex-wrap gap-2">
        {WEEK_DAYS.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => toggle(d.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm",
              value.includes(d.value)
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-300 bg-surface text-slate-600 hover:bg-slate-50",
            )}
          >
            {d.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
