"use client";

import type { ReactNode } from "react";
import { Overlay } from "./overlay";

/** Full class names so Tailwind can detect them. */
const SIZES = { md: "sm:max-w-xl", lg: "sm:max-w-2xl" } as const;

interface DrawerProps {
  title: string;
  description?: string;
  onClose: () => void;
  size?: keyof typeof SIZES;
  footer?: ReactNode;
  children: ReactNode;
}

/** Right-hand side panel for detail views (patient, consultation, assigning a doctor). */
export function Drawer({ size = "md", ...props }: DrawerProps) {
  return <Overlay placement="right" widthClassName={SIZES[size]} {...props} />;
}
