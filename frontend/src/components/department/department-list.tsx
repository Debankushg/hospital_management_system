"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { QueryState } from "@/components/ui/query-state";
import { useDepartmentOverview } from "@/hooks/use-department-overview";
import type { DepartmentMember } from "@/types/department.types";
import { DepartmentCard } from "./department-card";
import { EditDutyForm } from "./edit-duty-form";
import { UnplacedAdminsNotice } from "./unplaced-admins-notice";

/** Departments assigned to the admin with all their members and a "Change duty time" action. */
export function DepartmentList() {
  const overview = useDepartmentOverview();
  const [editing, setEditing] = useState<DepartmentMember | null>(null);

  return (
    <>
      <QueryState isLoading={overview.isLoading} error={overview.error}>
        {overview.data?.unplacedAdmins.length ? <UnplacedAdminsNotice admins={overview.data.unplacedAdmins} /> : null}
        {overview.data?.departments.length ? (
          <div className="space-y-6">
            {overview.data.departments.map((d) => (
              <DepartmentCard key={d.area} department={d} onEditDuty={setEditing} />
            ))}
          </div>
        ) : (
          <EmptyState message="No work has been assigned to you yet. Ask the super admin to assign a department." />
        )}
      </QueryState>
      {editing && (
        <Modal title={`Duty time – ${editing.fullName}`} onClose={() => setEditing(null)}>
          <EditDutyForm member={editing} onDone={() => setEditing(null)} />
        </Modal>
      )}
    </>
  );
}
