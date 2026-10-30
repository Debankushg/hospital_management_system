"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NAV_ITEMS } from "@/config/nav.config";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/utils/cn";
import { hasAccess } from "@/utils/role.util";
import { BrandLogo } from "./brand-logo";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useCurrentUser();
  const items = NAV_ITEMS.filter((item) => hasAccess(user, item.roles, item.capability));

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Main">
      {items.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-50 text-brand-ink shadow-[inset_3px_0_0_var(--color-brand-500),0_0_18px_-8px_var(--glow)]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <Icon className={cn("size-[18px] shrink-0", active ? "text-brand-ink" : "text-slate-400 group-hover:text-slate-600")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

interface SidebarProps {
  /** Mobile drawer state. The desktop sidebar is always visible. */
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Close the mobile menu after navigating.
  useEffect(() => onClose(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-slate-100 px-5">
          <BrandLogo />
        </div>
        <NavList />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 animate-fade-in bg-black/55" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] animate-slide-in-left flex-col bg-surface shadow-pop">
            <div className="flex h-16 items-center border-b border-slate-100 px-5">
              <BrandLogo />
            </div>
            <NavList onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
