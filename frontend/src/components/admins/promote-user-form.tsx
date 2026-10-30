"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { ROLE_LABELS } from "@/config/roles.config";
import { usePromoteUser } from "@/hooks/use-promote-user";
import { useUsers } from "@/hooks/use-users";
import type { PromoteUserFormValues } from "@/types/form.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { promoteUserValidator } from "@/validators/admin.validator";
import { AssignmentsPicker } from "./assignments-picker";

export function PromoteUserForm({ onDone }: { onDone: () => void }) {
  const users = useUsers();
  const promote = usePromoteUser();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PromoteUserFormValues>({
    resolver: zodResolver(promoteUserValidator),
    defaultValues: { userId: "", baseRole: "", assignments: [] },
  });

  // Only staff can become admins; they keep their profession (patients are never listed).
  const candidates = (users.data ?? []).filter(
    (u) => u.isActive && u.role !== "admin" && u.role !== "super_admin" && u.role !== "patient",
  );

  const onSubmit = (v: PromoteUserFormValues) => promote.mutate(v, { onSuccess: onDone });
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      {promote.isError && <Alert tone="error">{getErrorMessage(promote.error)}</Alert>}
      <FormField label="User to promote" error={errors.userId?.message}>
        <Select {...register("userId")} disabled={users.isLoading}>
          <option value="">Select a user</option>
          {candidates.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName} – {ROLE_LABELS[u.role]} ({u.email})
            </option>
          ))}
        </Select>
      </FormField>
      <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
        A doctor, receptionist, pathologist or accounts user keeps that as their profession and is listed only in that
        department as e.g. “Doctor, Admin” – not under the other departments they manage.
      </p>
      <Controller
        control={control}
        name="assignments"
        render={({ field }) => (
          <AssignmentsPicker
            value={field.value}
            onChange={field.onChange}
            error={errors.assignments?.message}
          />
        )}
      />
      <Button type="submit" loading={promote.isPending} className="w-full">
        Promote to admin
      </Button>
    </form>
  );
}
