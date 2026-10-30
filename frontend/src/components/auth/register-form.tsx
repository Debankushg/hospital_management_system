"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { ROUTES } from "@/config/routes.config";
import { useRegister } from "@/hooks/use-register";
import type { RegisterFormValues } from "@/types/form.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { registerValidator } from "@/validators/auth.validator";
import { AuthCard } from "./auth-card";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export function RegisterForm() {
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerValidator) });

  if (registerUser.isSuccess) {
    return (
      <AuthCard title="Registration complete">
        <div className="space-y-4">
          <Alert tone="success">Your patient account was created. You can sign in now.</Alert>
          <Link href={ROUTES.login}>
            <Button className="w-full">Go to sign in</Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create patient account"
      footer={
        <>
          Already registered?{" "}
          <Link href={ROUTES.login} className="font-medium text-brand-ink hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit((v) => registerUser.mutate(v))} className="space-y-4" noValidate>
        {registerUser.isError && <Alert tone="error">{getErrorMessage(registerUser.error)}</Alert>}
        <FormField label="Full name" error={errors.fullName?.message}>
          <Input autoComplete="name" {...register("fullName")} />
        </FormField>
        <FormField label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </FormField>
        <FormField label="Phone (optional)" error={errors.phone?.message}>
          <Input type="tel" autoComplete="tel" {...register("phone")} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Date of birth" error={errors.dateOfBirth?.message}>
            <Input type="date" {...register("dateOfBirth")} />
          </FormField>
          <FormField label="Gender">
            <Select {...register("gender")}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </FormField>
        </div>
        <FormField label="Blood group">
          <Select {...register("bloodGroup")}>
            <option value="">Select</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Address" error={errors.address?.message}>
          <Input {...register("address")} />
        </FormField>
        <FormField
          label="Password"
          error={errors.password?.message}
          hint="10+ characters with upper, lower, digit and symbol"
        >
          <PasswordInput autoComplete="new-password" {...register("password")} />
        </FormField>
        <FormField label="Confirm password" error={errors.confirmPassword?.message}>
          <PasswordInput autoComplete="new-password" {...register("confirmPassword")} />
        </FormField>
        <Button type="submit" loading={registerUser.isPending} className="w-full">
          Register
        </Button>
      </form>
    </AuthCard>
  );
}
