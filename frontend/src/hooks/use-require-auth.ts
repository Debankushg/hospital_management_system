import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/config/routes.config";
import { useAuthStore } from "@/store/auth.store";
import { useStoresHydrated } from "./use-stores-hydrated";

/** Redirects to /login when signed out. `ready` is true once the user is known to be signed in. */
export function useRequireAuth() {
  const router = useRouter();
  const hydrated = useStoresHydrated();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (hydrated && !token) router.replace(ROUTES.login);
  }, [hydrated, token, router]);

  return { ready: hydrated && !!token };
}
