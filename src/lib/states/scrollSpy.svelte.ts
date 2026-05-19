import { browser } from '$app/environment';

interface ScrollSpyOptions {
  threshold?: number | (() => number);
  isDisabled?: () => boolean;
}

export function getPageScrollElement(): HTMLElement {
  const body = document.body;
  const doc = document.documentElement;

  if (body.scrollHeight > body.clientHeight && doc.scrollHeight <= doc.clientHeight) {
    return body;
  }

  return (document.scrollingElement as HTMLElement | null) ?? doc;
}

export function getPageScrollHeight(): number {
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
  const scrollElement = getPageScrollElement();

  return scrollElement === document.body ? document.body.scrollTop : window.scrollY;
}

export function scrollPageTo(top: number, behavior: ScrollBehavior = 'smooth'): void {
  const scrollElement = getPageScrollElement();

  if (scrollElement === document.body) {
    scrollElement.scrollTo({ top, behavior });
    return;
  }

  window.scrollTo({ top, behavior });
}

/**
 * Svelte 5 rune for tracking the active section ID based on scroll position.
 */
export function createScrollSpy(getIds: () => string[], options: ScrollSpyOptions = {}) {
  let activeId = $state('');

  $effect(() => {
    if (!browser) return;

    const onScroll = () => {
      if (options.isDisabled?.()) return;

      const ids = getIds();
      if (ids.length === 0) return;

      const totalHeight = getPageScrollHeight();
      const maxScrollY = Math.max(0, totalHeight - window.innerHeight);
      const scrollY = getPageScrollY();

      // Handle bottom of page
      if (maxScrollY > 50 && scrollY >= maxScrollY - 50) {
        activeId = ids[ids.length - 1];
        return;
      }

      // Find current section
      let current = ids[0];
      const threshold =
        typeof options.threshold === 'function' ? options.threshold() : (options.threshold ?? 120);

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }
      activeId = current;
    };

    const scrollElement = getPageScrollElement();
    scrollElement.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      scrollElement.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  });

  return {
    get activeId() {
      return activeId;
    },
    set activeId(value: string) {
      activeId = value;
    },
  };
}
