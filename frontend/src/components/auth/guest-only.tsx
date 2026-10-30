"use client";

import type { ReactNode } from "react";
import { FullPageSpinner } from "@/components/ui/full-page-spinner";
import { useRequireGuest } from "@/hooks/use-require-guest";

/** Renders children only for signed-out users (login / register pages). */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { ready } = useRequireGuest();
  return ready ? <>{children}</> : <FullPageSpinner />;
}
