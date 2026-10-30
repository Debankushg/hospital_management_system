import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes.config";
import { useAuthStore } from "@/store/auth.store";
import { useMfaFlowStore } from "@/store/mfa-flow.store";
import type { PublicUser } from "@/types/user.types";

/** Stores the full session, clears temporary MFA tokens and goes to the dashboard. */
export function useCompleteSignIn() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const clearFlow = useMfaFlowStore((s) => s.clear);

  return (token: string, user: PublicUser) => {
    setSession(token, user);
    clearFlow();
    router.replace(ROUTES.dashboard);
  };
}
