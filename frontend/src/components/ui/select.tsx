import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";
import { inputClassName } from "./input";

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(inputClassName, "pr-8", className)} {...props}>
      {children}
    </select>
  );
}
