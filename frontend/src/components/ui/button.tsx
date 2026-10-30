import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";
import { Spinner } from "./spinner";

type Variant = "primary" | "secondary" | "danger" | "dangerSoft" | "ghost" | "soft";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_0_14px_-4px_var(--glow)] hover:shadow-[0_0_24px_-2px_var(--glow)] hover:brightness-110 active:brightness-95",
  secondary: "border border-slate-300 bg-surface text-slate-700 shadow-sm hover:border-brand-400 hover:bg-slate-50 active:bg-slate-100",
  danger: "bg-red-600 text-white shadow-sm hover:shadow-[0_0_20px_-4px_rgb(244_63_94/0.7)] hover:brightness-110 active:brightness-95",
  dangerSoft:
    "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-100 hover:shadow-[0_0_16px_-4px_rgb(244_63_94/0.6)]",
  soft: "bg-brand-50 text-brand-ink hover:bg-brand-100",
  ghost: "text-slate-600 hover:bg-slate-100",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-55",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  );
}
