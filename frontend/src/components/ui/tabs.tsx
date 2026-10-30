import { cn } from "@/utils/cn";

interface TabsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/** Segmented control for switching between list filters. */
export function Tabs<T extends string>({ options, value, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-slate-200/60 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition",
            value === o.value ? "bg-surface text-slate-900 shadow-[0_0_14px_-4px_var(--glow)] ring-1 ring-brand-200" : "text-slate-600 hover:text-slate-900",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
