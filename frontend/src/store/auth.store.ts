import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PublicUser } from "@/types/user.types";

interface AuthState {
  token: string | null;
  user: PublicUser | null;
  /** True once persisted state has been loaded on the client. */
  hydrated: boolean;
  setSession: (token: string, user: PublicUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "hms-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ token: s.token, user: s.user }),
      // Rehydrated manually (see StoreHydrator) to avoid SSR/client markup mismatch.
      skipHydration: true,
    },
  ),
);
