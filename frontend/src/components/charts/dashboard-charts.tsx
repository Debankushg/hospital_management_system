"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/utils/cn";
import { DoctorsChart } from "./doctors-chart";
import { PatientsChart } from "./patients-chart";
import { RevenueChart } from "./revenue-chart";

/**
 * Charts on the dashboard, chosen by priority:
 *  - patient volume: everyone
 *  - revenue: super admin, accounts, reception
 *  - checked vs to-see per doctor: doctors and super admin
 */
export function DashboardCharts() {
  const user = useCurrentUser();
  if (!user) return null;

  const showRevenue = user.role === "super_admin" || !!user.capabilities?.viewChecked;
  const showDoctors = user.role === "super_admin" || !!user.capabilities?.doctor;
  const pair = showRevenue && showDoctors;

  return (
    <section className="space-y-6" aria-label="Charts">
      <PatientsChart />
      {(showRevenue || showDoctors) && (
        <div className={cn("grid gap-6", pair && "xl:grid-cols-2")}>
          {showRevenue && <RevenueChart />}
          {showDoctors && <DoctorsChart />}
        </div>
      )}
    </section>
  );
}
