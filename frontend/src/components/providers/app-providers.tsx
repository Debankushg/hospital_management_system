import type { ReactNode } from "react";
import { DialogProvider } from "./dialog-provider";
import { QueryProvider } from "./query-provider";
import { StoreHydrator } from "./store-hydrator";
import { ThemeSync } from "./theme-sync";
import { ToastProvider } from "./toast-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <QueryProvider>
        <DialogProvider>
          <ThemeSync />
          <StoreHydrator />
          {children}
        </DialogProvider>
      </QueryProvider>
    </ToastProvider>
  );
}
