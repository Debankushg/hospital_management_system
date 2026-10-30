"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { NAV_ITEMS } from "@/config/nav.config";
import { ROLE_DESCRIPTIONS } from "@/config/dashboard.config";
import { ROUTES } from "@/config/routes.config";
import { useCurrentUser } from "@/hooks/use-current-user";
import { RoleBadge } from "@/components/users/role-badge";
import { hasAccess } from "@/utils/role.util";
import { DashboardCharts } from "@/components/charts/dashboard-charts";
import { AdminDashboard } from "./admin-dashboard";
import { MyAttendanceCard } from "./my-attendance-card";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

export function DashboardOverview() {
  const user = useCurrentUser();
  if (!user) return null;

  const isAdmin = user.role === "admin" || user.role === "super_admin";
  // Attendance is tracked for staff, not for patients or the super admin.
  const tracksAttendance = user.role !== "patient" && user.role !== "super_admin";
  const shortcuts = NAV_ITEMS.filter((i) => i.href !== ROUTES.dashboard && hasAccess(user, i.roles, i.capability));

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand-600 via-brand-700 to-brand-900 dark:from-brand-700 dark:via-brand-900 dark:to-[#06131f] p-6 text-white shadow-[0_0_44px_-14px_var(--glow)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-28 size-56 rounded-full bg-violet-400/25 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="relative space-y-3">
          <p className="text-sm font-medium text-white/80">{greeting()}</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{user.fullName}</h1>
          <RoleBadge role={user.role} baseRole={user.baseRole} />
          <p className="max-w-2xl text-sm leading-relaxed text-white/85">{ROLE_DESCRIPTIONS[user.role]}</p>
        </div>
      </section>

      <DashboardCharts />

      {tracksAttendance && <MyAttendanceCard />}

      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Quick links</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shortcuts.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-surface p-5 shadow-card transition hover:border-brand-300 hover:shadow-pop"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-ink">
                  <Icon className="size-5" />
                </span>
                <span className="flex-1 font-medium text-slate-900">{label}</span>
                <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-ink" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
