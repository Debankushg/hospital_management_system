import type { ReactNode } from "react";

/** Filter / search row that sits between the page header and a table. */
export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-center gap-3">{children}</div>;
}
