import { useMutation } from "@tanstack/react-query";
import { mfaService } from "@/services/mfa.service";
import type { MfaDisableFormValues } from "@/types/form.types";

/** Re-shows the MFA setup key after the user proves it is them (password + current code). */
export function useRevealMfaSecret() {
  return useMutation({
    mutationFn: ({ password, code }: MfaDisableFormValues) => mfaService.revealSecret(password, code),
  });
}
