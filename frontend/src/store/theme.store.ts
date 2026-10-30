import { create } from "zustand";
import { applyTheme, THEME_STORAGE_KEY, type Theme } from "@/utils/theme.util";

interface ThemeState {
  theme: Theme;
  /** Used by ThemeSync to load the saved choice without writing it back. */
  hydrate: (theme: Theme) => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",
  hydrate: (theme) => set({ theme }),
  setTheme: (theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* storage blocked: the choice just lasts for this visit */
    }
    applyTheme(theme);
    set({ theme });
  },
}));
