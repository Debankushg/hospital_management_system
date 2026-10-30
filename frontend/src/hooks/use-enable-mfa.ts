import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { mfaService } from "@/services/mfa.service";
import { getMfaEnrolmentToken } from "@/utils/mfa-token.util";

/** Confirms the first code. Returns the new full token, the user and the one-time recovery codes. */
export function useEnableMfa() {
  return useMutation({
    mutationFn: async (code: string) => {
      const token = getMfaEnrolmentToken();
      if (!token) throw new Error("Session expired. Please sign in again.");
      const { token: fullToken, recoveryCodes } = await mfaService.enable(token, code);
      const { user } = await authService.me(fullToken);
      return { token: fullToken, user, recoveryCodes };
    },
  });
}
