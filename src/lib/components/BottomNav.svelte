<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';

  import { browser } from '$app/environment';
  import Github from '$lib/components/Icon/Github.svelte';
  import Globe from '$lib/components/Icon/Globe.svelte';
  import { getLabels } from '$lib/data/labels';
  import { projectNavLinks } from '$lib/stores/bottomNav';
  import { getPageLocale } from '$lib/utils/locale';
  import { parseHeading } from '$lib/utils/markdown';

  const [send, receive] = crossfade({
    duration: 600,
    easing: quintOut,
    fallback(node) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 400,
        easing: quintOut,
        css: (t) => `
					transform: ${transform} scale(${String(t)});
					opacity: ${String(t)}
				`,
      };
    },
  });

  interface NavTab {
    id: string;
    label: string;
  }

  interface Props {
    isProject?: boolean;
  }

  let { isProject = false }: Props = $props();

  // ── State ──────────────────────────────────────────────────────────────────

  let innerWidth = $state(0);
  let tabs = $state<NavTab[]>([]);
  let activeId = $state('');
  let tabBarRef = $state<HTMLElement | null>(null);
  let activeIndex = $derived(tabs.findIndex((t) => t.id === activeId));

  // Pill visual state (using $state to avoid $derived lag during drag)
  let pillLeft = $state(0);
  let pillWidth = $state(0);

  // Drag state
  let isDragging = $state(false);
  let dragStartX = $state(0);
  let dragOffset = $state(0);
  let dragHoveredId = $state<string | null>(null);

  // Scroll state
  let isScrolling = $state(false);
  let scrollTimeout: ReturnType<typeof setTimeout>;

  const labels = $derived(getLabels(getPageLocale()));
  const navLinks = $derived($projectNavLinks);

  // ── Utils ──────────────────────────────────────────────────────────────────

  function scrollToTarget(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    let offset = 80; // Default project offset
    if (!isProject) {
      const header = document.querySelector('.sticky-header');
      const headerHeight =
        header instanceof HTMLElement && header.classList.contains('visible')
          ? header.offsetHeight
          : 0;
      offset = headerHeight;
    }

    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 800);

    window.scrollTo({ top, behavior: 'smooth' });
    activeId = id;
  }

  function slugify(text: string, index: number): string {
    const slug = text
      .toLowerCase()
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-');
    return slug || `section-${String(index)}`;
  }

  function parseLabel(text: string): string {
    const { main } = parseHeading(text);
    return main;
  }

  // ── Effects ────────────────────────────────────────────────────────────────

  // Initialize tabs based on mode
  $effect(() => {
    if (!browser) return;

    if (!isProject) {
      tabs = [
        { id: 'section-intro', label: labels.tabIntro },
        { id: 'section-work', label: labels.tabWork },
        { id: 'section-skills', label: labels.tabSkills },
        { id: 'section-projects', label: labels.tabProjects },
        { id: 'section-education', label: labels.tabEducation },
      ];
      // Force reset activeId if it doesn't belong to home sections
      if (!activeId || !activeId.startsWith('section-')) {
        activeId = 'section-intro';
      }
    } else {
      const setupProjectTabs = () => {
        const headings = Array.from(document.querySelectorAll<HTMLElement>('.project-article h2'));
        if (headings.length > 0) {
          tabs = headings.map((el, i) => {
            if (!el.id) el.id = slugify(el.textContent || '', i);
            return { id: el.id, label: parseLabel(el.textContent || '') };
          });
          // Force reset activeId if it's still a home section
          if (!activeId || activeId.startsWith('section-')) {
            activeId = tabs[0]?.id || '';
          }
          return true;
        }
        return false;
      };

      if (!setupProjectTabs()) {
        const article = document.querySelector('.project-article');
        if (article) {
          const mutObs = new MutationObserver(() => {
            if (setupProjectTabs()) mutObs.disconnect();
          });
          mutObs.observe(article, { childList: true, subtree: true });
          return () => {
            mutObs.disconnect();
          };
        }
      }
    }
  });

  // Global scroll listener
  $effect(() => {
    if (!browser) return;

    const onScroll = () => {
      if (isDragging || isScrolling) return;

      const scrollPos = window.innerHeight + window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;

      // Handle bottom of page
      if (scrollPos >= totalHeight - 50 && tabs.length > 0) {
        activeId = tabs[tabs.length - 1].id;
        return;
      }

      // Find current section
      let current = tabs[0]?.id || '';
      const threshold = isProject ? 120 : 100;

      for (const tab of tabs) {
        const el = document.getElementById(tab.id);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = tab.id;
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

  // Sync pill position with active section
  $effect(() => {
    if (isDragging || innerWidth <= 0 || !tabBarRef || activeIndex < 0 || !browser) return;

    const el = tabBarRef;
    // Use a small delay or rAF to ensure DOM is ready and layout is stable
    const tid = requestAnimationFrame(() => {
      const tabEls = el.querySelectorAll<HTMLElement>('.tab');
      const activeEl = tabEls[activeIndex] as HTMLElement | undefined;
      if (!activeEl) return;
      pillLeft = activeEl.offsetLeft;
      pillWidth = activeEl.offsetWidth;
    });

    return () => {
      cancelAnimationFrame(tid);
    };
  });

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handlePointerDown(e: PointerEvent) {
    const target = e.target as HTMLElement;
    const isActiveArea =
      target.classList.contains('active-bg') ||
      target.classList.contains('active') ||
      target.closest('.active');

    if (isActiveArea && tabBarRef) {
      e.preventDefault();
      isDragging = true;
      dragStartX = e.clientX;
      dragOffset = 0;
      dragHoveredId = activeId;
      // Set capture on the tab bar to handle "dragging out of bounds"
      tabBarRef.setPointerCapture(e.pointerId);
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging || !tabBarRef) return;

    const rawOffset = e.clientX - dragStartX;
    const newLeft = pillLeft + rawOffset;
    const minLeft = 4;
    const maxLeftAllowed = tabBarRef.offsetWidth - pillWidth - 4;

    // Clamp visually but keep rawOffset for target detection
    if (newLeft < minLeft) dragOffset = minLeft - pillLeft;
    else if (newLeft > maxLeftAllowed) dragOffset = maxLeftAllowed - pillLeft;
    else dragOffset = rawOffset;

    const currentPillCenter = pillLeft + rawOffset + pillWidth / 2;
    let closestId = activeId;
    let minDistance = Infinity;
    const tabEls = Array.from(tabBarRef.querySelectorAll<HTMLElement>('.tab'));

    tabEls.forEach((el, i) => {
      const center = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - currentPillCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestId = tabs[i].id;
      }
    });
    dragHoveredId = closestId;
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging) return;
    isDragging = false;

    if (tabBarRef && tabBarRef.hasPointerCapture(e.pointerId)) {
      tabBarRef.releasePointerCapture(e.pointerId);
    }

    const finalRawOffset = e.clientX - dragStartX;
    dragHoveredId = null;

    if (!tabBarRef) {
      dragOffset = 0;
      return;
    }

    // Prevent click if dragged significantly
    if (Math.abs(finalRawOffset) > 5) {
      tabBarRef.addEventListener(
        'click',
        (evt) => {
          evt.stopPropagation();
        },
        { capture: true, once: true },
      );
    }

    const pillCenter = pillLeft + finalRawOffset + pillWidth / 2;
    const tabEls = Array.from(tabBarRef.querySelectorAll<HTMLElement>('.tab'));
    let targetId = activeId;
    let targetIdx = activeIndex;
    let minDist = Infinity;

    tabEls.forEach((el, i) => {
      const center = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - pillCenter);
      if (dist < minDist) {
        minDist = dist;
        targetId = tabs[i].id;
        targetIdx = i;
      }
    });

    // Update state to target immediately to prevent snap-back
    const targetEl = tabEls[targetIdx];
    pillLeft = targetEl.offsetLeft;
    pillWidth = targetEl.offsetWidth;
    dragOffset = 0;

    if (targetId !== activeId) {
      scrollToTarget(targetId);
    }
  }

  const resolvedGithubHref = $derived(
    navLinks?.githubLink
      ? navLinks.githubLink.startsWith('http')
        ? navLinks.githubLink
        : `https://github.com/${navLinks.githubLink}`
      : '',
  );
</script>

<svelte:window bind:innerWidth />

{#if !isProject}
  <!-- Home Mode -->
  <nav
    bind:this={tabBarRef}
    class="tab-bar"
    aria-label={labels.navAriaLabel}
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerUp}
    in:receive={{ key: 'tab-bar' }}
    out:send={{ key: 'tab-bar' }}
  >
    <div
      class="active-bg"
      class:dragging={isDragging}
      style:left="{pillLeft + (isDragging ? dragOffset : 0)}px"
      style:width="{pillWidth}px"
    ></div>

    {#each tabs as tab (tab.id)}
      <button
        class="tab"
        class:active={isDragging ? dragHoveredId === tab.id : activeId === tab.id}
        onclick={() => {
          if (!isDragging) scrollToTarget(tab.id);
        }}
        aria-current={activeId === tab.id ? 'location' : undefined}
      >
        {tab.label}
      </button>
    {/each}
  </nav>
{:else}
  <!-- Project Mode -->
  <div class="project-nav">
    <div class="island-slot left" in:receive={{ key: 'back' }} out:send={{ key: 'back' }}>
      <button
        class="island circle back-btn"
        aria-label="Go back"
        onclick={() => {
          history.back();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </button>
    </div>

    <div class="island-slot center" in:receive={{ key: 'tab-bar' }} out:send={{ key: 'tab-bar' }}>
      {#if tabs.length > 0}
        <nav
          bind:this={tabBarRef}
          class="tab-bar island"
          aria-label="Project navigation"
          onpointerdown={handlePointerDown}
          onpointermove={handlePointerMove}
          onpointerup={handlePointerUp}
          onpointercancel={handlePointerUp}
        >
          <div
            class="active-bg"
            class:dragging={isDragging}
            style:left="{pillLeft + (isDragging ? dragOffset : 0)}px"
            style:width="{pillWidth}px"
          ></div>

          {#each tabs as section (section.id)}
            <button
              class="tab"
              class:active={isDragging ? dragHoveredId === section.id : activeId === section.id}
              onclick={() => {
                if (!isDragging) scrollToTarget(section.id);
              }}
              aria-current={activeId === section.id ? 'location' : undefined}
            >
              {section.label}
            </button>
          {/each}
        </nav>
      {/if}
    </div>

    <div class="island-slot right" in:receive={{ key: 'links' }} out:send={{ key: 'links' }}>
      {#if resolvedGithubHref || navLinks?.productLink}
        <div class="island links-pill">
          {#if resolvedGithubHref}
            <a
              href={resolvedGithubHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              class="link-item"
            >
              <Github width="20" height="20" />
            </a>
          {/if}
          {#if navLinks?.productLink}
            <a
              href={navLinks.productLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit site"
              class="link-item"
            >
              <Globe width="20" height="20" />
            </a>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .tab-bar {
    background: color-mix(in srgb, var(--color-basic-bg) 85%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--color-bg-divider);
    border-radius: 999px;
    bottom: calc(1rem + env(safe-area-inset-bottom));
    display: flex; /* Changed from none to flex */
    left: 50%;
    transform: translateX(-50%);
    padding: 0.25rem;
    position: fixed;
    width: calc(100% - 1.5rem);
    max-width: 500px;
    z-index: 50;
    box-shadow: 0 4px 20px var(--color-shadow);
    touch-action: none;
  }

  .active-bg {
    position: absolute;
    top: 0.25rem;
    bottom: 0.25rem;
    background: var(--color-primary);
    border-radius: 999px;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent);
    z-index: 0;
    transition:
      left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.2s;
    pointer-events: auto;
    cursor: grab;
  }

  .active-bg.dragging {
    transition: none;
    cursor: grabbing;
  }

  .tab {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 999px;
    color: var(--color-sub);
    cursor: pointer;
    display: flex;
    flex: 1;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 500;
    justify-content: center;
    min-height: 44px;
    padding: 0.5rem 0.25rem;
    transition:
      color 0.2s,
      transform 0.1s;
    word-break: keep-all;
    z-index: 1;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
  }

  .tab:active {
    transform: scale(0.92);
  }

  .tab.active {
    color: #ffffff;
    font-weight: 700;
  }

  .project-nav {
    display: flex; /* Changed from none to flex */
    position: fixed;
    bottom: calc(1rem + env(safe-area-inset-bottom));
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 1.5rem);
    max-width: 500px;
    padding: 0;
    z-index: 50;
    align-items: center;
    pointer-events: none;
  }

  .island-slot {
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .island-slot.left {
    flex: 1;
    justify-content: flex-start;
  }

  .island-slot.center {
    flex: 0 1 auto;
    min-width: 0;
    justify-content: center;
    margin: 0 8px;
  }

  .island-slot.right {
    flex: 1;
    justify-content: flex-end;
  }

  .island {
    background: color-mix(in srgb, var(--color-basic-bg) 85%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--color-bg-divider);
    border-radius: 999px;
    box-shadow: 0 4px 20px var(--color-shadow);
    pointer-events: auto;
  }

  .project-nav .tab-bar {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    width: 100%;
    max-width: none;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    touch-action: pan-x;
    display: flex;
  }

  .project-nav .tab-bar::-webkit-scrollbar {
    display: none;
  }

  .circle {
    height: 48px;
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--color-main);
    text-decoration: none;
    transition:
      background 0.15s,
      color 0.15s;
    border-radius: 50%; /* Ensure perfect circle */
  }

  .back-btn:hover {
    background: var(--color-disabled-bg);
  }

  .links-pill {
    display: flex;
    align-items: stretch; /* Stretch children to fill height */
    height: 48px;
    padding: 0;
    overflow: hidden; /* Clip children's hover background to the rounded corners */
    min-width: 48px; /* Ensure it's at least a circle when it has one item */
  }

  .link-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    color: var(--color-sub);
    text-decoration: none;
    transition:
      background 0.15s,
      color 0.15s;
  }

  .link-item:hover {
    background: var(--color-disabled-bg);
    color: var(--color-bold);
  }

  /* Both navs are mobile-only — desktop uses DesktopSideNav / project topbar instead */
  @media (min-width: 961px) {
    .tab-bar {
      display: none;
    }

    .project-nav {
      display: none;
    }
  }

  @media (max-width: 960px) {
    .project-nav {
      display: grid;
      grid-template-columns: 48px 1fr 48px;
      gap: 4px;
    }
  }

  @media print {
    .tab-bar,
    .project-nav {
      display: none !important;
    }
  }
</style>
