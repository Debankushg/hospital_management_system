import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel />
      <main className="relative flex items-center justify-center px-4 py-16 sm:px-8">
        <ThemeToggle className="absolute right-4 top-4 sm:right-8 sm:top-6" />
        {children}
      </main>
    </div>
  );
}
