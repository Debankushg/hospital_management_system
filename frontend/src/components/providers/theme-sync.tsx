"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";
import { applyTheme, readStoredTheme } from "@/utils/theme.util";

/** Loads the saved theme into the store and, while on "System", follows the OS setting live. */
export function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);
  const hydrate = useThemeStore((s) => s.hydrate);

  useEffect(() => {
    hydrate(readStoredTheme());
  }, [hydrate]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  return null;
}
