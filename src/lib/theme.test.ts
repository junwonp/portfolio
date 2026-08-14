import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  applyPreference,
  applyTheme,
  isDarkThemeActive,
  isSystemDark,
  readThemePreference,
  subscribeTheme,
  toggleTheme,
} from "./theme";

type ClassList = {
  contains: (token: string) => boolean;
  toggle: (token: string, force?: boolean) => boolean;
};

function makeClassList(initial: string[] = []): ClassList {
  const set = new Set(initial);
  return {
    contains: (token) => set.has(token),
    toggle: (token, force) => {
      const next = force ?? !set.has(token);
      if (next) set.add(token);
      else set.delete(token);
      return next;
    },
  };
}

interface Dom {
  classList: ClassList;
  storage: Map<string, string>;
  matchMedia: ReturnType<typeof vi.fn>;
}

function setupDom(options: { darkClass?: boolean; systemDark?: boolean } = {}): Dom {
  const { darkClass = false, systemDark = false } = options;
  const classList = makeClassList(darkClass ? ["dark"] : []);
  const storage = new Map<string, string>();
  const matchMedia = vi.fn(() => ({ matches: systemDark }));
  vi.stubGlobal("document", { documentElement: { classList } });
  vi.stubGlobal("window", { matchMedia });
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => void storage.set(key, value),
    removeItem: (key: string) => void storage.delete(key),
  });
  return { classList, storage, matchMedia };
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("isDarkThemeActive", () => {
  it("reflects the html.dark class", () => {
    const { classList } = setupDom({ darkClass: true });
    expect(isDarkThemeActive()).toBe(true);
    expect(classList.contains("dark")).toBe(true);
  });

  it("returns false without the dark class", () => {
    setupDom();
    expect(isDarkThemeActive()).toBe(false);
  });

  it("returns false outside the browser", () => {
    expect(isDarkThemeActive()).toBe(false);
  });
});

describe("isSystemDark", () => {
  it("reads the OS color scheme", () => {
    const dom = setupDom({ systemDark: true });
    expect(isSystemDark()).toBe(true);
    expect(dom.matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");

    setupDom({ systemDark: false });
    expect(isSystemDark()).toBe(false);
  });
});

describe("readThemePreference", () => {
  it("returns the stored preference", () => {
    const { storage } = setupDom();
    storage.set("theme", "dark");
    expect(readThemePreference()).toBe("dark");
    storage.set("theme", "light");
    expect(readThemePreference()).toBe("light");
  });

  it("falls back to null for missing or invalid values", () => {
    const { storage } = setupDom();
    expect(readThemePreference()).toBeNull();
    storage.set("theme", "sepia");
    expect(readThemePreference()).toBeNull();
  });

  it("returns null when storage throws", () => {
    setupDom();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => {
        throw new Error("blocked");
      }),
    });
    expect(readThemePreference()).toBeNull();
  });
});

describe("applyTheme", () => {
  it("toggles the html.dark class", () => {
    const { classList } = setupDom();
    applyTheme(true);
    expect(classList.contains("dark")).toBe(true);
    applyTheme(false);
    expect(classList.contains("dark")).toBe(false);
  });
});

describe("applyPreference", () => {
  it("applies and stores an explicit dark preference", () => {
    const { classList, storage } = setupDom();
    applyPreference("dark");
    expect(classList.contains("dark")).toBe(true);
    expect(storage.get("theme")).toBe("dark");
  });

  it("applies and stores an explicit light preference", () => {
    const { classList, storage } = setupDom({ darkClass: true });
    applyPreference("light");
    expect(classList.contains("dark")).toBe(false);
    expect(storage.get("theme")).toBe("light");
  });

  it("follows the OS when no preference is stored", () => {
    const { storage } = setupDom({ systemDark: true });
    applyPreference(null);
    expect(isDarkThemeActive()).toBe(true);
    expect(storage.has("theme")).toBe(false);
  });

  it("turns light when the OS is light and no preference is stored", () => {
    setupDom({ systemDark: false });
    applyPreference(null);
    expect(isDarkThemeActive()).toBe(false);
  });

  it("swallows storage failures without throwing", () => {
    setupDom();
    vi.stubGlobal("localStorage", {
      setItem: vi.fn(() => {
        throw new Error("blocked");
      }),
      removeItem: vi.fn(),
    });
    expect(() => applyPreference("dark")).not.toThrow();
    expect(isDarkThemeActive()).toBe(true);
  });
});

describe("toggleTheme", () => {
  it("switches to dark and stores it when it differs from the system", () => {
    const { classList, storage } = setupDom({ systemDark: false, darkClass: false });
    expect(toggleTheme()).toBe(true);
    expect(classList.contains("dark")).toBe(true);
    expect(storage.get("theme")).toBe("dark");
  });

  it("returns to following the system when the choice matches it", () => {
    // System is light; the user had forced dark and now picks light again
    const { classList, storage } = setupDom({ systemDark: false, darkClass: true });
    storage.set("theme", "dark");

    expect(toggleTheme()).toBe(false);
    expect(classList.contains("dark")).toBe(false);
    // Light matches the system, so the preference is cleared (auto mode)
    expect(storage.has("theme")).toBe(false);
  });

  it("clears the stored preference when picking dark over a dark system", () => {
    // System is dark; the user had forced light and now picks dark again
    const { classList, storage } = setupDom({ systemDark: true, darkClass: false });
    storage.set("theme", "light");

    expect(toggleTheme()).toBe(true);
    expect(classList.contains("dark")).toBe(true);
    expect(storage.has("theme")).toBe(false);
  });
});

describe("theme store", () => {
  it("notifies subscribers when the preference changes", () => {
    setupDom();
    const listener = vi.fn();
    subscribeTheme(listener);

    applyPreference("dark");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("stops notifying after unsubscribe", () => {
    setupDom();
    const listener = vi.fn();
    const unsubscribe = subscribeTheme(listener);
    unsubscribe();

    applyPreference("dark");
    expect(listener).not.toHaveBeenCalled();
  });
});
