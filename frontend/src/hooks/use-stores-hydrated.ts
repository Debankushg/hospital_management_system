import { useAuthStore } from "@/store/auth.store";
import { useMfaFlowStore } from "@/store/mfa-flow.store";

/** True once both persisted stores have been loaded on the client. */
export function useStoresHydrated() {
  // Call both hooks unconditionally (no `&&` short-circuit) to keep hook order stable.
  const authHydrated = useAuthStore((s) => s.hydrated);
  const flowHydrated = useMfaFlowStore((s) => s.hydrated);
  return authHydrated && flowHydrated;
}
