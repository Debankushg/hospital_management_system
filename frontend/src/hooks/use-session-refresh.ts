import { useEffect } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

/**
 * Re-reads the signed-in user once per page load so role / capability changes made by the super admin
 * (promotion, demotion, new assignments) show up without logging in again.
 */
export function useSessionRefresh() {
  useEffect(() => {
    const { token } = useAuthStore.getState();
    if (!token) return;
    authService
      .me()
      .then(({ user }) => useAuthStore.getState().token === token && useAuthStore.getState().setSession(token, user))
      .catch(() => undefined); // a 401 already logs the user out in api-client
  }, []);
}
