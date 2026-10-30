"use client";

import type { ReactNode } from "react";
import { Overlay } from "./overlay";

const SIZES = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" } as const;

interface ModalProps {
  title: string;
  description?: string;
  onClose: () => void;
  size?: keyof typeof SIZES;
  footer?: ReactNode;
  children: ReactNode;
}

/** Centered dialog for short forms. Large detail views use `Drawer`. */
export function Modal({ size = "md", ...props }: ModalProps) {
  return <Overlay placement="center" widthClassName={SIZES[size]} {...props} />;
}
