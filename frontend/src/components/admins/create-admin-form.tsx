"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useCreateAdmin } from "@/hooks/use-create-admin";
import type { CreateAdminFormValues } from "@/types/form.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { createAdminValidator } from "@/validators/admin.validator";
import { AssignmentsPicker } from "./assignments-picker";
import { BaseRoleSelect } from "./base-role-select";

export function CreateAdminForm({ onDone }: { onDone: () => void }) {
  const createAdmin = useCreateAdmin();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminValidator),
    defaultValues: { assignments: [], baseRole: undefined },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => createAdmin.mutate(v, { onSuccess: onDone }))}
      className="space-y-4"
      noValidate
    >
      {createAdmin.isError && <Alert tone="error">{getErrorMessage(createAdmin.error)}</Alert>}
      <FormField label="Full name" error={errors.fullName?.message}>
        <Input {...register("fullName")} />
      </FormField>
      <FormField label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} />
      </FormField>
      <FormField label="Phone (optional)" error={errors.phone?.message}>
        <Input type="tel" {...register("phone")} />
      </FormField>
      <FormField label="Temporary password" error={errors.password?.message}>
        <PasswordInput autoComplete="new-password" {...register("password")} />
      </FormField>
      <BaseRoleSelect {...register("baseRole")} error={errors.baseRole?.message} />
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
      <Button type="submit" loading={createAdmin.isPending} className="w-full">
        Create admin
      </Button>
    </form>
  );
}
