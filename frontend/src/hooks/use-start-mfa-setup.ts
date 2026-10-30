import { useMutation } from "@tanstack/react-query";
import { mfaService } from "@/services/mfa.service";
import { getMfaEnrolmentToken } from "@/utils/mfa-token.util";

/** Generates a new TOTP secret + QR code. */
export function useStartMfaSetup() {
  return useMutation({
    mutationFn: () => {
      const token = getMfaEnrolmentToken();
      if (!token) throw new Error("Session expired. Please sign in again.");
      return mfaService.setup(token);
    },
  });
}
