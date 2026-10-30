"use client";

import { useCallback, useState, type ReactNode } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useSessionRefresh } from "@/hooks/use-session-refresh";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

/** Frame for every signed-in page: auth guard + sidebar (drawer on mobile) + top bar + content container. */
export function DashboardShell({ children }: { children: ReactNode }) {
  useSessionRefresh();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <AuthGuard>
      <Sidebar open={menuOpen} onClose={closeMenu} />
      <div className="min-h-screen lg:pl-64">
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
