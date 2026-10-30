"use client";

import { Stethoscope } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Toolbar } from "@/components/layout/toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryState } from "@/components/ui/query-state";
import { useDoctors } from "@/hooks/use-doctors";
import type { Specialty } from "@/types/role.types";
import { DoctorCard } from "./doctor-card";
import { SpecialtyFilter } from "./specialty-filter";

export function DoctorsPageContent() {
  const [specialty, setSpecialty] = useState<Specialty | "">("");
  const doctors = useDoctors(specialty || undefined);

  return (
    <>
      <PageHeader title="Doctors" description="Find a specialist." />
      <Toolbar>
        <SpecialtyFilter value={specialty} onChange={setSpecialty} />
      </Toolbar>
      <QueryState isLoading={doctors.isLoading} error={doctors.error}>
        {doctors.data?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {doctors.data.map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Stethoscope} title="No doctors found" message="Try a different specialty." />
        )}
      </QueryState>
    </>
  );
}
