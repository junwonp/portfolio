<script lang="ts">
  import { browser } from '$app/environment';
  import BaseSideNav from '$lib/components/BaseSideNav.svelte';
  import { createScrollSpy, getPageScrollY, scrollPageTo } from '$lib/states/scrollSpy.svelte';
  import { parseHeading, slugify } from '$lib/utils/markdown';

  interface NavSection {
    id: string;
    label: string;
  }

  let sections = $state<NavSection[]>([]);

  const spy = createScrollSpy(() => sections.map((s) => s.id));
  let activeId = $derived(spy.activeId);

  function parseHeader(text: string) {
    const { main } = parseHeading(text);
    return { label: main };
  }

  $effect(() => {
    if (!browser) return;

    function setup(): boolean {
      const headings = Array.from(document.querySelectorAll<HTMLElement>('.project-article h2'));
      if (headings.length === 0) {
        sections = [];
        return false;
      }

      const parsed: NavSection[] = headings.map((el, i) => {
        if (!el.id) {
          el.id = slugify(el.textContent || '', i);
        }
        const { label } = parseHeader(el.textContent || '');
        return { id: el.id, label };
      });

      sections = parsed;

      return true;
    }

    if (!setup()) {
      const article = document.querySelector('.project-article');
      if (article) {
        const mutObs = new MutationObserver(() => {
          if (document.querySelectorAll('.project-article h2').length > 0) {
            mutObs.disconnect();
            setup();
          }
        });
        mutObs.observe(article, { childList: true, subtree: true });
        return () => {
          mutObs.disconnect();
        };
      }
    }
  });

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + getPageScrollY() - 80;
    scrollPageTo(top);
    spy.activeId = id;
  }
</script>

{#if sections.length > 0}
  <BaseSideNav {sections} {activeId} onselect={scrollToSection} ariaLabel="Project sections" />
{/if}
