"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useMfaFlowStore } from "@/store/mfa-flow.store";

/** Loads persisted zustand state after mount (stores use skipHydration to avoid SSR mismatches). */
export function StoreHydrator() {
  useEffect(() => {
    Promise.all([useAuthStore.persist.rehydrate(), useMfaFlowStore.persist.rehydrate()]).then(() => {
      useAuthStore.setState({ hydrated: true });
      useMfaFlowStore.setState({ hydrated: true });
    });
  }, []);

  return null;
}
