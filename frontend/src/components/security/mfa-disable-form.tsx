"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useDisableMfa } from "@/hooks/use-disable-mfa";
import type { MfaDisableFormValues } from "@/types/form.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { mfaDisableValidator } from "@/validators/auth.validator";

export function MfaDisableForm() {
  const disable = useDisableMfa();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MfaDisableFormValues>({ resolver: zodResolver(mfaDisableValidator) });

  return (
    <form onSubmit={handleSubmit((v) => disable.mutate(v))} className="space-y-4" noValidate>
      {disable.isError && <Alert tone="error">{getErrorMessage(disable.error)}</Alert>}
      <FormField label="Password" error={errors.password?.message}>
        <PasswordInput autoComplete="current-password" {...register("password")} />
      </FormField>
      <FormField label="Authenticator code" error={errors.code?.message}>
        <Input inputMode="numeric" autoComplete="one-time-code" {...register("code")} />
      </FormField>
      <Button type="submit" variant="danger" loading={disable.isPending}>
        Disable two-factor authentication
      </Button>
    </form>
  );
}
