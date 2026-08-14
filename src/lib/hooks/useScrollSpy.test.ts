import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getPageScrollElement, prefersReducedMotion, scrollPageTo } from "./useScrollSpy";

// scrollPageTo reads window/document directly, so mock the minimal surface it touches
function setupDom(reducedMotion: boolean): { scrollTo: ReturnType<typeof vi.fn> } {
  const windowScrollTo = vi.fn();
  const scrollingElement = { scrollTo: windowScrollTo };

  vi.stubGlobal("window", {
    scrollTo: windowScrollTo,
    matchMedia: vi.fn(() => ({ matches: reducedMotion })),
  });
  vi.stubGlobal("document", {
    body: { scrollHeight: 0, clientHeight: 100, scrollTop: 0 },
    documentElement: { scrollHeight: 0, clientHeight: 100 },
    scrollingElement,
  });

  return { scrollTo: windowScrollTo };
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("prefersReducedMotion", () => {
  it("returns false when the user prefers smooth motion", () => {
    setupDom(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  it("returns true when the user prefers reduced motion", () => {
    setupDom(true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it("returns false when matchMedia is unavailable", () => {
    vi.stubGlobal("window", { matchMedia: undefined });
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe("scrollPageTo", () => {
  it("scrolls smoothly by default", () => {
    const { scrollTo } = setupDom(false);
    scrollPageTo(500);
    expect(scrollTo).toHaveBeenCalledWith({ top: 500, behavior: "smooth" });
  });

  it("falls back to instant scrolling when reduced motion is preferred", () => {
    const { scrollTo } = setupDom(true);
    scrollPageTo(500);
    expect(scrollTo).toHaveBeenCalledWith({ top: 500, behavior: "auto" });
  });

  it("keeps an explicit instant behavior when motion is fine", () => {
    const { scrollTo } = setupDom(false);
    scrollPageTo(500, "instant");
    expect(scrollTo).toHaveBeenCalledWith({ top: 500, behavior: "instant" });
  });

  it("targets document.body when the body is the scroll container", () => {
    const bodyScrollTo = vi.fn();
    vi.stubGlobal("window", {
      scrollTo: vi.fn(),
      matchMedia: vi.fn(() => ({ matches: false })),
    });
    vi.stubGlobal("document", {
      body: { scrollHeight: 2000, clientHeight: 100, scrollTop: 0, scrollTo: bodyScrollTo },
      documentElement: { scrollHeight: 100, clientHeight: 100 },
    });

    scrollPageTo(300);
    expect(bodyScrollTo).toHaveBeenCalledWith({ top: 300, behavior: "smooth" });
    expect(getPageScrollElement()).toBe(document.body);
  });
});
