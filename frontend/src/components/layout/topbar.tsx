"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandLogo } from "./brand-logo";
import { UserMenu } from "./user-menu";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-surface/85 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="-ml-2 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <BrandLogo className="lg:hidden" />
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
