"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { CREATABLE_ROLES, ROLE_LABELS, SPECIALTIES, SPECIALTY_LABELS } from "@/config/roles.config";
import { useCreateUser } from "@/hooks/use-create-user";
import type { CreateUserFormValues } from "@/types/form.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { createUserValidator } from "@/validators/user.validator";

export function CreateUserForm({ onDone }: { onDone: () => void }) {
  const createUser = useCreateUser();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserValidator),
    defaultValues: { role: "receptionist" },
  });
  const isDoctor = watch("role") === "doctor";

  return (
    <form
      onSubmit={handleSubmit((v) => createUser.mutate(v, { onSuccess: onDone }))}
      className="space-y-4"
      noValidate
    >
      {createUser.isError && <Alert tone="error">{getErrorMessage(createUser.error)}</Alert>}
      <FormField label="Role" error={errors.role?.message}>
        <Select {...register("role")}>
          {CREATABLE_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Full name" error={errors.fullName?.message}>
        <Input {...register("fullName")} />
      </FormField>
      <FormField label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} />
      </FormField>
      <FormField label="Phone (optional)" error={errors.phone?.message}>
        <Input type="tel" {...register("phone")} />
      </FormField>
      <FormField
        label="Temporary password"
        error={errors.password?.message}
        hint="The user must set up MFA on first sign-in (staff)."
      >
        <PasswordInput autoComplete="new-password" {...register("password")} />
      </FormField>

      {isDoctor && (
        <>
          <FormField label="Specialty" error={errors.specialty?.message}>
            <Select {...register("specialty")}>
              <option value="">Select specialty</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {SPECIALTY_LABELS[s]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="License number" error={errors.licenseNo?.message}>
            <Input {...register("licenseNo")} />
          </FormField>
          <FormField label="Consultation fee (optional)" error={errors.consultationFee?.message}>
            <Input inputMode="decimal" {...register("consultationFee")} />
          </FormField>
        </>
      )}

      <Button type="submit" loading={createUser.isPending} className="w-full">
        Create user
      </Button>
    </form>
  );
}
