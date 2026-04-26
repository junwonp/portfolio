<script lang="ts">
  import { browser } from '$app/environment';
  import { parseHeading } from '$lib/utils/markdown';

  interface NavSection {
    id: string;
    label: string;
    emoji: string;
  }

  let activeId = $state('');
  let sections = $state<NavSection[]>([]);
  let innerWidth = $state(0);

  // Desktop Side Nav state
  let itemRefs = $state<HTMLElement[]>([]);
  let activeIndex = $derived(sections.findIndex((t) => t.id === activeId));
  let desktopActiveTop = $derived(
    innerWidth > 960 && activeIndex >= 0 && itemRefs[activeIndex]
      ? itemRefs[activeIndex].offsetTop
      : 0,
  );
  let desktopActiveHeight = $derived(
    innerWidth > 960 && activeIndex >= 0 && itemRefs[activeIndex]
      ? itemRefs[activeIndex].offsetHeight
      : 0,
  );

  function slugify(text: string, index: number): string {
    const slug = text
      .toLowerCase()
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-');
    return slug || `section-${String(index)}`;
  }

  function parseHeader(text: string) {
    const { emoji, main } = parseHeading(text);
    return { emoji: emoji || '📄', label: main };
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
        const { emoji, label } = parseHeader(el.textContent || '');
        return { id: el.id, label, emoji };
      });

      sections = parsed;

      const onScroll = () => {
        const scrollPos = window.innerHeight + window.scrollY;
        const totalHeight = document.documentElement.scrollHeight;

        if (scrollPos >= totalHeight - 50 && parsed.length > 0) {
          activeId = parsed[parsed.length - 1].id;
          return;
        }

        let current = parsed[0]?.id || '';
        for (const section of parsed) {
          const el = document.getElementById(section.id);
          if (el && el.getBoundingClientRect().top <= 120) {
            current = section.id;
          }
        }
        activeId = current;
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

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

    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    activeId = id;
  }
</script>

<svelte:window bind:innerWidth />

{#if sections.length > 0}
  <nav class="side-nav" aria-label="Project sections">
    <div class="nav-list-wrapper">
      <div
        class="active-bg-desktop"
        style:transform="translateY({desktopActiveTop}px)"
        style:height="{desktopActiveHeight}px"
        style:opacity={activeId ? 1 : 0}
      ></div>
      <ul>
        {#each sections as section, i (section.id)}
          <li bind:this={itemRefs[i]}>
            <button
              class="nav-item"
              class:active={activeId === section.id}
              onclick={() => {
                scrollToSection(section.id);
              }}
              aria-current={activeId === section.id ? 'location' : undefined}
            >
              <span class="nav-emoji">{section.emoji}</span>
              <span class="nav-label">{section.label}</span>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </nav>
{/if}

<style>
  .side-nav {
    position: sticky;
    top: var(--space-xl);
    align-self: flex-start;
    padding-top: var(--space-xl);
  }

  .nav-list-wrapper {
    position: relative;
  }

  .active-bg-desktop {
    position: absolute;
    left: 0;
    right: 0;
    background: var(--color-primary);
    border-radius: 6px;
    z-index: 0;
    transition:
      transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      height 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.2s;
    pointer-events: none;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    z-index: 1;
  }

  li {
    padding: 0;
  }

  li::before {
    display: none;
  }

  .nav-item {
    background: transparent;
    border: none;
    color: var(--color-sub);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: inherit;
    font-size: 0.8125rem;
    padding: 0.5rem 0.75rem;
    text-align: left;
    transition: color 0.15s;
    width: 100%;
    border-radius: 6px;
  }

  .nav-emoji {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .nav-label {
    color: #404040;
    :global(html.dark) & {
      color: #c9d1d9;
    }
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-item:hover {
    color: var(--color-main);
  }

  .nav-item.active {
    background: var(--color-primary);
    color: #ffffff;
    font-weight: 600;
  }

  @media (max-width: 960px) {
    .side-nav {
      display: none;
    }
  }
</style>
