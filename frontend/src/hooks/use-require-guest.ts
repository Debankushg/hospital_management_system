import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/config/routes.config";
import { useAuthStore } from "@/store/auth.store";
import { useStoresHydrated } from "./use-stores-hydrated";

/** For login/register: sends already signed-in users to the dashboard. */
export function useRequireGuest() {
  const router = useRouter();
  const hydrated = useStoresHydrated();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (hydrated && token) router.replace(ROUTES.dashboard);
  }, [hydrated, token, router]);

  return { ready: hydrated && !token };
}
