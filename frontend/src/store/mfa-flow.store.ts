import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Short-lived tokens between "password OK" and "fully signed in". Kept per browser tab. */
interface MfaFlowState {
  mfaToken: string | null;
  setupToken: string | null;
  hydrated: boolean;
  setMfaToken: (token: string) => void;
  setSetupToken: (token: string) => void;
  clear: () => void;
}

export const useMfaFlowStore = create<MfaFlowState>()(
  persist(
    (set) => ({
      mfaToken: null,
      setupToken: null,
      hydrated: false,
      setMfaToken: (mfaToken) => set({ mfaToken, setupToken: null }),
      setSetupToken: (setupToken) => set({ setupToken, mfaToken: null }),
      clear: () => set({ mfaToken: null, setupToken: null }),
    }),
    {
      name: "hms-mfa-flow",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ mfaToken: s.mfaToken, setupToken: s.setupToken }),
      skipHydration: true,
    },
  ),
);
