export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "hms-theme";

/** Same logic as the inline script in layout.tsx: runs before first paint to avoid a flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export const systemPrefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

/** Adds / removes the `dark` class on <html>. */
export function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", dark);
}

export function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}
