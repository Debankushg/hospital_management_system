"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ROUTES } from "@/config/routes.config";
import { useLogin } from "@/hooks/use-login";
import type { LoginFormValues } from "@/types/form.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { loginValidator } from "@/validators/auth.validator";
import { AuthCard } from "./auth-card";

export function LoginForm() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginValidator) });

  return (
    <AuthCard
      title="Sign in"
      subtitle="Use your hospital account"
      footer={
        <>
          New patient?{" "}
          <Link href={ROUTES.register} className="font-medium text-brand-ink hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit((v) => login.mutate(v))} className="space-y-4" noValidate>
        {login.isError && <Alert tone="error">{getErrorMessage(login.error)}</Alert>}
        <FormField label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </FormField>
        <FormField label="Password" error={errors.password?.message}>
          <PasswordInput autoComplete="current-password" {...register("password")} />
        </FormField>
        <Button type="submit" loading={login.isPending} className="w-full">
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
