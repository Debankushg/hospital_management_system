"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useThemeStore } from "@/store/theme.store";
import { cn } from "@/utils/cn";
import type { Theme } from "@/utils/theme.util";

const OPTIONS: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
];

/** Light / System / Dark switch. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn("inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-100/70 p-0.5", className)}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={active}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setTheme(value)}
            className={cn(
              "flex size-7 items-center justify-center rounded-full transition",
              active
                ? "bg-surface text-brand-ink shadow-[0_0_14px_-3px_var(--glow)] ring-1 ring-brand-200"
                : "text-slate-400 hover:text-slate-700",
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
