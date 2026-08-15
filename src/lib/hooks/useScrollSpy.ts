import { useEffect, useRef, useState } from "react";

export function getPageScrollElement(): HTMLElement {
  if (typeof document === "undefined") return {} as HTMLElement;
  const body = document.body;
  const doc = document.documentElement;

  if (body.scrollHeight > body.clientHeight && doc.scrollHeight <= doc.clientHeight) {
    return body;
  }

  return (document.scrollingElement as HTMLElement | null) ?? doc;
}

export function getPageScrollHeight(): number {
  if (typeof document === "undefined") return 0;
  const body = document.body;
  const doc = document.documentElement;

  return Math.max(
    body.offsetHeight,
    body.scrollHeight,
    doc.clientHeight,
    doc.offsetHeight,
    doc.scrollHeight,
  );
}

export function getPageScrollY(): number {
  if (typeof window === "undefined") return 0;
  const scrollElement = getPageScrollElement();
  return scrollElement === document.body ? document.body.scrollTop : window.scrollY;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function scrollPageTo(top: number, behavior: ScrollBehavior = "smooth"): void {
  if (typeof window === "undefined") return;
  // The global CSS kill-switch cannot stop JS-driven scrolling, so gate it here
  const effectiveBehavior = prefersReducedMotion() ? "auto" : behavior;
  const scrollElement = getPageScrollElement();

  if (scrollElement === document.body) {
    scrollElement.scrollTo({ top, behavior: effectiveBehavior });
    return;
  }

  window.scrollTo({ top, behavior: effectiveBehavior });
}

interface ScrollSpyOptions {
  threshold?: number | (() => number);
  isDisabled?: () => boolean;
}

export function useScrollSpy(getIds: () => string[], options: ScrollSpyOptions = {}) {
  const [activeId, setActiveId] = useState("");

  // Keep latest getIds and options in refs to prevent triggering useEffect on every render
  const getIdsRef = useRef(getIds);
  const optionsRef = useRef(options);

  useEffect(() => {
    getIdsRef.current = getIds;
    optionsRef.current = options;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number | null = null;

    const updateActiveId = () => {
      const currentOptions = optionsRef.current;
      if (currentOptions.isDisabled?.()) return;

      const ids = getIdsRef.current();
      if (ids.length === 0) return;

      const totalHeight = getPageScrollHeight();
      const maxScrollY = Math.max(0, totalHeight - window.innerHeight);
      const scrollY = getPageScrollY();

      if (maxScrollY > 50 && scrollY >= maxScrollY - 50) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      const threshold =
        typeof currentOptions.threshold === "function"
          ? currentOptions.threshold()
          : (currentOptions.threshold ?? 120);

      // Pick the section nearest the threshold line instead of the last one
      // above it — programmatic scrolling can settle slightly off (notably
      // iOS Safari), which made the highlight pill jump back a section
      let current = ids[0];
      let bestDistance = Infinity;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const distance = Math.abs(el.getBoundingClientRect().top - threshold);
        if (distance < bestDistance) {
          bestDistance = distance;
          current = id;
        }
      }
      setActiveId(current);
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateActiveId();
      });
    };

    const scrollElement = getPageScrollElement();
    scrollElement.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    scheduleUpdate();

    return () => {
      scrollElement.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return activeId;
}
