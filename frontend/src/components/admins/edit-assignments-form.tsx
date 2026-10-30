"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useUpdateAssignments } from "@/hooks/use-update-assignments";
import type { AdminWithAssignments } from "@/types/admin.types";
import type { UpdateAssignmentsFormValues } from "@/types/form.types";
import type { Role } from "@/types/role.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { updateAssignmentsValidator } from "@/validators/admin.validator";
import { AssignmentsPicker } from "./assignments-picker";
import { BaseRoleSelect } from "./base-role-select";

interface EditAssignmentsFormProps {
  admin: AdminWithAssignments;
  onDone: () => void;
}

export function EditAssignmentsForm({ admin, onDone }: EditAssignmentsFormProps) {
  const update = useUpdateAssignments();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateAssignmentsFormValues>({
    resolver: zodResolver(updateAssignmentsValidator),
    defaultValues: {
      baseRole: (admin.baseRole as UpdateAssignmentsFormValues["baseRole"]) ?? undefined,
      assignments: admin.assignments.map((a) => ({ area: a.area, notes: a.notes ?? undefined })),
    },
  });

  return (
    <form
      onSubmit={handleSubmit((v) =>
        update.mutate(
          { userId: admin.id, assignments: v.assignments, baseRole: v.baseRole as Role },
          { onSuccess: onDone },
        ),
      )}
      className="space-y-4"
    >
      {update.isError && <Alert tone="error">{getErrorMessage(update.error)}</Alert>}
      <BaseRoleSelect {...register("baseRole")} error={errors.baseRole?.message} />
      <Controller
        control={control}
        name="assignments"
        render={({ field }) => (
          <AssignmentsPicker
            adminId={admin.id}
            value={field.value}
            onChange={field.onChange}
            error={errors.assignments?.message}
          />
        )}
      />
      <Button type="submit" loading={update.isPending} className="w-full">
        Save work assignments
      </Button>
    </form>
  );
}
