import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useMfaFlowStore } from "@/store/mfa-flow.store";
import { useCompleteSignIn } from "./use-complete-sign-in";

/** Login step 2. Accepts a 6-digit authenticator code or a recovery code. */
export function useVerifyMfaLogin() {
  const completeSignIn = useCompleteSignIn();

  return useMutation({
    mutationFn: (code: string) => {
      const mfaToken = useMfaFlowStore.getState().mfaToken;
      if (!mfaToken) throw new Error("Your login session expired. Please sign in again.");
      const value = code.trim();
      return authService.verifyMfaLogin(mfaToken, /^\d{6}$/.test(value) ? { code: value } : { recoveryCode: value });
    },
    onSuccess: ({ token, user }) => completeSignIn(token, user),
  });
}
