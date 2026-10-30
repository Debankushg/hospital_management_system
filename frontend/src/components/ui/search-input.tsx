import { Search } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";
import { Input } from "./input";

/** Text input with a search icon, used in table toolbars. */
export function SearchInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <div className={cn("relative w-full sm:w-72", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <Input type="search" className="pl-9" {...props} />
    </div>
  );
}
