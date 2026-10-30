import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes.config";
import { useAuthStore } from "@/store/auth.store";
import { useMfaFlowStore } from "@/store/mfa-flow.store";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const clearFlow = useMfaFlowStore((s) => s.clear);

  return () => {
    logout();
    clearFlow();
    queryClient.clear();
    router.replace(ROUTES.login);
  };
}
