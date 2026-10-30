"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { MfaKeyDisplay } from "@/components/auth/mfa-key-display";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Modal } from "@/components/ui/modal";
import { useRevealMfaSecret } from "@/hooks/use-reveal-mfa-secret";
import type { MfaDisableFormValues } from "@/types/form.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { mfaDisableValidator } from "@/validators/auth.validator";

/** Shows the MFA setup key again after re-entering the password and a current authenticator code. */
export function MfaSecretDialog({ onClose }: { onClose: () => void }) {
  const reveal = useRevealMfaSecret();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MfaDisableFormValues>({ resolver: zodResolver(mfaDisableValidator) });

  return (
    <Modal
      title="Your authenticator setup key"
      description="Use it to add this account to another device or app."
      onClose={onClose}
    >
      {reveal.data ? (
        <div className="space-y-4">
          <MfaKeyDisplay data={reveal.data} />
          <Alert tone="info">
            <span className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              Anyone with this key can generate your codes. Keep it private and never share it.
            </span>
          </Alert>
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit((v) => reveal.mutate(v))} className="space-y-4" noValidate>
          {reveal.isError && <Alert tone="error">{getErrorMessage(reveal.error)}</Alert>}
          <p className="text-sm text-slate-600">
            To protect your account, confirm it is you with your password and a current code from your authenticator app.
          </p>
          <FormField label="Password" error={errors.password?.message}>
            <PasswordInput autoComplete="current-password" autoFocus {...register("password")} />
          </FormField>
          <FormField label="Current 6-digit code" error={errors.code?.message}>
            <Input inputMode="numeric" autoComplete="one-time-code" {...register("code")} />
          </FormField>
          <Button type="submit" loading={reveal.isPending} className="w-full">
            Show my setup key
          </Button>
        </form>
      )}
    </Modal>
  );
}
