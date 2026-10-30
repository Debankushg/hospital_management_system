"use client";

import { ChevronDown, Lock, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/users/role-badge";
import { ROUTES } from "@/config/routes.config";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLogout } from "@/hooks/use-logout";

export function UserMenu() {
  const user = useCurrentUser();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2 transition hover:bg-slate-100"
      >
        <Avatar name={user.fullName} />
        <span className="hidden text-left leading-tight sm:block">
          <span className="block max-w-40 truncate text-sm font-medium text-slate-900">{user.fullName}</span>
          <span className="block max-w-40 truncate text-xs text-slate-500">{user.email}</span>
        </span>
        <ChevronDown className="size-4 text-slate-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-64 animate-scale-in overflow-hidden rounded-xl border border-slate-200 bg-surface shadow-pop"
        >
          <div className="space-y-2 border-b border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <Avatar name={user.fullName} className="size-10" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{user.fullName}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <RoleBadge role={user.role} baseRole={user.baseRole} />
          </div>
          <div className="p-1.5">
            <Link
              href={ROUTES.security}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <Lock className="size-4 text-slate-400" />
              Security &amp; MFA
            </Link>
            <button
              role="menuitem"
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
