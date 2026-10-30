import type { ReactNode } from "react";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { Alert } from "./alert";
import { ListSkeleton } from "./skeleton";

interface QueryStateProps {
  isLoading: boolean;
  error: unknown;
  /** Number of skeleton rows to show while loading. */
  rows?: number;
  children: ReactNode;
}

/** Shows a skeleton or an error instead of children while a query is not ready. */
export function QueryState({ isLoading, error, rows, children }: QueryStateProps) {
  if (isLoading) return <ListSkeleton rows={rows} />;
  if (error) return <Alert tone="error">{getErrorMessage(error)}</Alert>;
  return <>{children}</>;
}
