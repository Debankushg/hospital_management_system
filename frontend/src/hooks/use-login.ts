import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes.config";
import { authService } from "@/services/auth.service";
import { useMfaFlowStore } from "@/store/mfa-flow.store";
import type { LoginFormValues } from "@/types/form.types";
import { useCompleteSignIn } from "./use-complete-sign-in";

/** Login step 1. Routes the user to the dashboard, MFA verification or MFA enrolment. */
export function useLogin() {
  const router = useRouter();
  const completeSignIn = useCompleteSignIn();
  const setMfaToken = useMfaFlowStore((s) => s.setMfaToken);
  const setSetupToken = useMfaFlowStore((s) => s.setSetupToken);

  return useMutation({
    mutationFn: ({ email, password }: LoginFormValues) => authService.login(email, password),
    onSuccess: (result) => {
      if (result.status === "authenticated") return completeSignIn(result.token, result.user);
      if (result.status === "mfa_required") {
        setMfaToken(result.mfaToken);
        return router.replace(ROUTES.mfaVerify);
      }
      setSetupToken(result.setupToken);
      router.replace(ROUTES.mfaSetup);
    },
  });
}
