export type Theme = "light" | "dark";

const STORAGE_KEY = "app-theme";

export const getStoredTheme = (): Theme | null => {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "light" || v === "dark") return v;
  return null;
};

export const detectSystemTheme = (): Theme => {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const applyTheme = (theme: Theme) => {
  try {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (err) {
    // ignore (SSR or unavailable)
    console.warn("Failed to apply theme", err);
  }
};

export const initTheme = () => {
  const stored = getStoredTheme();
  const theme = stored || detectSystemTheme();
  applyTheme(theme);
  return theme;
};

export const toggleTheme = (current: Theme) => {
  const next: Theme = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
};

export const getCurrentTheme = (): Theme => {
  const stored = getStoredTheme();
  if (stored) return stored;
  return detectSystemTheme();
};
