import type { ReactNode } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <BrandLogo className="mb-8 lg:hidden" />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{subtitle}</p>}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-card sm:p-7">{children}</div>
      {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
    </div>
  );
}
