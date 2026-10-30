import { Compass } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/config/routes.config";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-ink">
        <Compass className="size-8" />
      </span>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Page not found</h1>
      <p className="max-w-sm text-slate-500">The page you are looking for does not exist or has been moved.</p>
      <Link
        href={ROUTES.dashboard}
        className="inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-[0_0_14px_-4px_var(--glow)] hover:brightness-110"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
