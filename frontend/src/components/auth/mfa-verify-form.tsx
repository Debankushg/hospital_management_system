"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { FullPageSpinner } from "@/components/ui/full-page-spinner";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/config/routes.config";
import { useStoresHydrated } from "@/hooks/use-stores-hydrated";
import { useVerifyMfaLogin } from "@/hooks/use-verify-mfa-login";
import { useMfaFlowStore } from "@/store/mfa-flow.store";
import type { MfaVerifyFormValues } from "@/types/form.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { mfaVerifyValidator } from "@/validators/auth.validator";
import { AuthCard } from "./auth-card";

export function MfaVerifyForm() {
  const router = useRouter();
  const hydrated = useStoresHydrated();
  const mfaToken = useMfaFlowStore((s) => s.mfaToken);
  const verify = useVerifyMfaLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MfaVerifyFormValues>({ resolver: zodResolver(mfaVerifyValidator) });

  useEffect(() => {
    if (hydrated && !mfaToken) router.replace(ROUTES.login);
  }, [hydrated, mfaToken, router]);

  if (!hydrated || !mfaToken) return <FullPageSpinner />;

  return (
    <AuthCard
      title="Two-factor verification"
      subtitle="Enter the 6-digit code from your authenticator app, or a recovery code"
      footer={
        <Link href={ROUTES.login} className="font-medium text-brand-ink hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit((v) => verify.mutate(v.code))} className="space-y-4" noValidate>
        {verify.isError && <Alert tone="error">{getErrorMessage(verify.error)}</Alert>}
        <FormField label="Code" error={errors.code?.message}>
          <Input inputMode="numeric" autoComplete="one-time-code" autoFocus {...register("code")} />
        </FormField>
        <Button type="submit" loading={verify.isPending} className="w-full">
          Verify
        </Button>
      </form>
    </AuthCard>
  );
}
