import { useAuthStore } from "@/store/auth.store";
import { useMfaFlowStore } from "@/store/mfa-flow.store";

/** Token to use for MFA enrolment: the forced-setup token (staff) or the session token (voluntary). */
export function getMfaEnrolmentToken(): string | null {
  return useMfaFlowStore.getState().setupToken ?? useAuthStore.getState().token;
}
