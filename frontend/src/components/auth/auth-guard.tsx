"use client";

import type { ReactNode } from "react";
import { FullPageSpinner } from "@/components/ui/full-page-spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";

/** Renders children only for signed-in users; redirects to /login otherwise. */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { ready } = useRequireAuth();
  return ready ? <>{children}</> : <FullPageSpinner />;
}
