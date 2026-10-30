import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ADMIN_AREA_LABELS } from "@/config/roles.config";
import type { Department, DepartmentMember } from "@/types/department.types";
import { DepartmentMembersTable } from "./department-members-table";

interface DepartmentCardProps {
  department: Department;
  onEditDuty: (member: DepartmentMember) => void;
}

export function DepartmentCard({ department, onEditDuty }: DepartmentCardProps) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-ink">
          <Building2 className="size-[18px]" />
        </span>
        <h2 className="text-base font-semibold text-slate-900">{ADMIN_AREA_LABELS[department.area]}</h2>
        <Badge tone="gray">
          {department.members.length} {department.members.length === 1 ? "member" : "members"}
        </Badge>
        {department.notes && <span className="text-sm text-slate-500">· {department.notes}</span>}
      </div>
      <DepartmentMembersTable members={department.members} onEditDuty={onEditDuty} />
    </section>
  );
}
