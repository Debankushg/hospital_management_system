import { useMutation } from "@tanstack/react-query";
import { mfaService } from "@/services/mfa.service";
import { useAuthStore } from "@/store/auth.store";
import type { MfaDisableFormValues } from "@/types/form.types";

export function useDisableMfa() {
  return useMutation({
    meta: { successMessage: "Two-factor authentication disabled" },
    mutationFn: ({ password, code }: MfaDisableFormValues) => mfaService.disable(password, code),
    onSuccess: () => {
      const { token, user, setSession } = useAuthStore.getState();
      if (token && user) setSession(token, { ...user, mfaEnabled: false });
    },
  });
}
