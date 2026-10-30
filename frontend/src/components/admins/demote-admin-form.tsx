"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { DEMOTION_ROLES, ROLE_LABELS } from "@/config/roles.config";
import { useDemoteAdmin } from "@/hooks/use-demote-admin";
import type { AdminWithAssignments } from "@/types/admin.types";
import { getErrorMessage } from "@/utils/get-error-message.util";

interface DemoteAdminFormProps {
  admin: AdminWithAssignments;
  onDone: () => void;
}

export function DemoteAdminForm({ admin, onDone }: DemoteAdminFormProps) {
  const demote = useDemoteAdmin();
  const [role, setRole] = useState<(typeof DEMOTION_ROLES)[number]>(
    (DEMOTION_ROLES as readonly string[]).includes(admin.baseRole ?? "")
      ? (admin.baseRole as (typeof DEMOTION_ROLES)[number])
      : "patient",
  );

  return (
    <div className="space-y-4">
      {demote.isError && <Alert tone="error">{getErrorMessage(demote.error)}</Alert>}
      <p className="text-sm text-slate-600">
        {admin.fullName} will lose admin rights and all assigned work areas.
      </p>
      <FormField label="New role">
        <Select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
          {DEMOTION_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </Select>
      </FormField>
      <Button
        variant="danger"
        className="w-full"
        loading={demote.isPending}
        onClick={() => demote.mutate({ userId: admin.id, role }, { onSuccess: onDone })}
      >
        Remove admin rights
      </Button>
    </div>
  );
}
