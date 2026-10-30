"use client";

import { KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { MfaSetupFlow } from "@/components/auth/mfa-setup-flow";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthStore } from "@/store/auth.store";
import { MfaDisableForm } from "./mfa-disable-form";
import { MfaSecretDialog } from "./mfa-secret-dialog";

export function MfaSettings() {
  const user = useCurrentUser();
  const setSession = useAuthStore((s) => s.setSession);
  const [showKey, setShowKey] = useState(false);
  if (!user) return null;

  return (
    <Card className="max-w-xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-ink">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Two-factor authentication</h2>
            <p className="text-sm text-slate-500">A 6-digit code from your authenticator app is required at sign-in.</p>
          </div>
        </div>
        <Badge tone={user.mfaEnabled ? "green" : "amber"}>{user.mfaEnabled ? "Enabled" : "Disabled"}</Badge>
      </div>

      {!user.mfaEnabled && <MfaSetupFlow onComplete={setSession} />}

      {user.mfaEnabled && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-4">
          <div>
            <p className="text-sm font-medium text-slate-900">Authenticator setup key</p>
            <p className="text-sm text-slate-500">Add this account to another device or app.</p>
          </div>
          <Button variant="secondary" onClick={() => setShowKey(true)}>
            <KeyRound className="size-4" />
            Show key
          </Button>
        </div>
      )}

      {user.mfaEnabled && user.role === "patient" && <MfaDisableForm />}
      {user.mfaEnabled && user.role !== "patient" && (
        <Alert tone="info">Two-factor authentication is mandatory for staff accounts and cannot be disabled.</Alert>
      )}

      {showKey && <MfaSecretDialog onClose={() => setShowKey(false)} />}
    </Card>
  );
}
