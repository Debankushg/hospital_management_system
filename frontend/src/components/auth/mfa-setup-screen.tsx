"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FullPageSpinner } from "@/components/ui/full-page-spinner";
import { ROUTES } from "@/config/routes.config";
import { useCompleteSignIn } from "@/hooks/use-complete-sign-in";
import { useStoresHydrated } from "@/hooks/use-stores-hydrated";
import { useAuthStore } from "@/store/auth.store";
import { useMfaFlowStore } from "@/store/mfa-flow.store";
import { AuthCard } from "./auth-card";
import { MfaSetupFlow } from "./mfa-setup-flow";

/** Forced MFA enrolment shown after login for staff accounts without MFA. */
export function MfaSetupScreen() {
  const router = useRouter();
  const hydrated = useStoresHydrated();
  const setupToken = useMfaFlowStore((s) => s.setupToken);
  const token = useAuthStore((s) => s.token);
  const completeSignIn = useCompleteSignIn();

  const allowed = !!setupToken || !!token;

  useEffect(() => {
    if (hydrated && !allowed) router.replace(ROUTES.login);
  }, [hydrated, allowed, router]);

  if (!hydrated || !allowed) return <FullPageSpinner />;

  return (
    <AuthCard title="Set up two-factor authentication" subtitle="Required for all staff accounts">
      <MfaSetupFlow onComplete={completeSignIn} />
    </AuthCard>
  );
}
