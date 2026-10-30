"use client";

import { ArrowRight, Building2, ClipboardList, Users } from "lucide-react";
import Link from "next/link";
import { DepartmentList } from "@/components/department/department-list";
import { LeavesTable } from "@/components/leaves/leaves-table";
import { QueryState } from "@/components/ui/query-state";
import { ROUTES } from "@/config/routes.config";
import { useDepartmentOverview } from "@/hooks/use-department-overview";
import { useLeaves } from "@/hooks/use-leaves";
import { StatCard } from "./stat-card";

/** Dashboard for admins / super admin: department members, pending leave requests and quick stats. */
export function AdminDashboard() {
  const overview = useDepartmentOverview();
  const pending = useLeaves("pending");

  const departments = overview.data?.departments ?? [];
  const members = departments.reduce((n, d) => n + d.members.length, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Departments" value={departments.length} icon={Building2} href={ROUTES.department} />
        <StatCard label="Members" value={members} icon={Users} href={ROUTES.department} />
        <StatCard label="Pending leave requests" value={pending.data?.length ?? "–"} icon={ClipboardList} href={ROUTES.leaves} />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Pending leave requests</h2>
          <Link href={ROUTES.attendance} className="inline-flex items-center gap-1 text-sm font-medium text-brand-ink hover:text-brand-ink">
            Go to attendance
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <QueryState isLoading={pending.isLoading} error={pending.error}>
          <LeavesTable leaves={pending.data ?? []} emptyMessage="No pending leave requests." />
        </QueryState>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">My departments</h2>
        <DepartmentList />
      </section>
    </div>
  );
}
