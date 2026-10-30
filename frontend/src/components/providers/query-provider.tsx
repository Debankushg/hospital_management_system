"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef, useState, type ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/utils/get-error-message.util";

/** Mutations can opt into toasts with `meta: { successMessage, toastError }`. */
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: { successMessage?: string; toastError?: boolean };
  }
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: false, refetchOnWindowFocus: false } },
        mutationCache: new MutationCache({
          onSuccess: (_data, _vars, _ctx, mutation) => {
            const message = mutation.meta?.successMessage;
            if (message) toastRef.current.success(message);
          },
          onError: (error, _vars, _ctx, mutation) => {
            if (mutation.meta?.toastError) toastRef.current.error(getErrorMessage(error));
          },
        }),
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
