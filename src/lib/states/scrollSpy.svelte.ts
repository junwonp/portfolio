import { browser } from '$app/environment';

interface ScrollSpyOptions {
  threshold?: number | (() => number);
  isDisabled?: () => boolean;
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

      const scrollPos = window.innerHeight + window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;

      // Handle bottom of page
      if (scrollPos >= totalHeight - 50) {
        activeId = ids[ids.length - 1];
        return;
      }

      // Find current section
      let current = ids[0];
      const threshold = typeof options.threshold === 'function' ? options.threshold() : (options.threshold ?? 120);

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }
      activeId = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
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
