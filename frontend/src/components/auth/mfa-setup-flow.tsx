"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useEnableMfa } from "@/hooks/use-enable-mfa";
import { useStartMfaSetup } from "@/hooks/use-start-mfa-setup";
import type { MfaCodeFormValues } from "@/types/form.types";
import type { PublicUser } from "@/types/user.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { mfaCodeValidator } from "@/validators/auth.validator";
import { MfaKeyDisplay } from "./mfa-key-display";
import { RecoveryCodes } from "./recovery-codes";

interface MfaSetupFlowProps {
  /** Called when the user confirms they saved their recovery codes. */
  onComplete: (token: string, user: PublicUser) => void;
}

/** Three steps: generate QR code -> confirm a code -> save recovery codes. */
export function MfaSetupFlow({ onComplete }: MfaSetupFlowProps) {
  const start = useStartMfaSetup();
  const enable = useEnableMfa();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MfaCodeFormValues>({ resolver: zodResolver(mfaCodeValidator) });

  if (enable.data) {
    const { token, user, recoveryCodes } = enable.data;
    return (
      <div className="space-y-4">
        <Alert tone="success">Two-factor authentication is now enabled.</Alert>
        <RecoveryCodes codes={recoveryCodes} />
        <Button className="w-full" onClick={() => onComplete(token, user)}>
          I have saved my codes – continue
        </Button>
      </div>
    );
  }

  if (!start.data) {
    return (
      <div className="space-y-4">
        {start.isError && <Alert tone="error">{getErrorMessage(start.error)}</Alert>}
        <p className="text-sm text-slate-600">
          You will need an authenticator app such as Google Authenticator, Authy or Microsoft Authenticator.
        </p>
        <Button className="w-full" loading={start.isPending} onClick={() => start.mutate()}>
          Generate QR code
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((v) => enable.mutate(v.code))} className="space-y-4" noValidate>
      {enable.isError && <Alert tone="error">{getErrorMessage(enable.error)}</Alert>}
      <p className="text-sm text-slate-600">Scan this QR code with your authenticator app, then enter the code it shows.</p>
      <MfaKeyDisplay data={start.data} />
      <FormField label="6-digit code" error={errors.code?.message}>
        <Input inputMode="numeric" autoComplete="one-time-code" {...register("code")} />
      </FormField>
      <Button type="submit" loading={enable.isPending} className="w-full">
        Enable two-factor authentication
      </Button>
    </form>
  );
}
