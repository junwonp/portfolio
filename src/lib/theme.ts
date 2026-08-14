export type Theme = "light" | "dark";
export type ThemePreference = Theme | null; // null = follow the OS

const THEME_STORAGE_KEY = "theme";

// The boot script in layout.tsx applies html.dark before paint, so the class
// is the single source of truth for the *effective* theme
export function isDarkThemeActive(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function isSystemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function readThemePreference(): ThemePreference {
  if (typeof localStorage === "undefined") return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch {
    return null;
  }
}

export function applyTheme(isDark: boolean): void {
  document.documentElement.classList.toggle("dark", isDark);
  notifyThemeChange();
}

export function applyPreference(preference: ThemePreference): void {
  try {
    if (preference === null) localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Private browsing can block storage — the session still gets the theme
  }
  applyTheme(preference === "dark" || (preference === null && isSystemDark()));
}

export function toggleTheme(): boolean {
  const nextDark = !isDarkThemeActive();
  // Picking the color the OS already shows means "follow the system" —
  // store nothing so future OS changes keep working
  const preference: ThemePreference =
    nextDark === isSystemDark() ? null : nextDark ? "dark" : "light";
  applyPreference(preference);
  return nextDark;
}

// Minimal external store so components can react to theme changes
// without touching React state in effects
const listeners = new Set<() => void>();

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getThemeSnapshot(): boolean {
  return isDarkThemeActive();
}

function notifyThemeChange(): void {
  for (const listener of listeners) listener();
}
