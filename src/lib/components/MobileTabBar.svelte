<script lang="ts">
  import { browser } from '$app/environment';
  import { getLabels } from '$lib/data/labels';
  import { getPageLocale } from '$lib/utils/locale';

  const SECTION_IDS = [
    'section-intro',
    'section-work',
    'section-skills',
    'section-projects',
    'section-education',
  ] as const;

  type SectionId = (typeof SECTION_IDS)[number];

  let labels = $derived(getLabels(getPageLocale()));

  let tabs = $derived([
    { id: 'section-intro' as SectionId, label: labels.tabIntro },
    { id: 'section-work' as SectionId, label: labels.tabWork },
    { id: 'section-skills' as SectionId, label: labels.tabSkills },
    { id: 'section-projects' as SectionId, label: labels.tabProjects },
    { id: 'section-education' as SectionId, label: labels.tabEducation },
  ]);

  let activeId = $state<SectionId>('section-intro');

  let innerWidth = $state(0);

  // Dragging and Animation State
  let tabBarRef = $state<HTMLElement | null>(null);
  let activeIndex = $derived(tabs.findIndex((t) => t.id === activeId));
  let activeLeft = $derived(
    innerWidth > 0 && tabBarRef && activeIndex >= 0
      ? ((tabBarRef.querySelectorAll<HTMLElement>('.tab')[activeIndex] as HTMLElement | undefined)
          ?.offsetLeft ?? 0)
      : 0,
  );
  let activeWidth = $derived(
    innerWidth > 0 && tabBarRef && activeIndex >= 0
      ? ((tabBarRef.querySelectorAll<HTMLElement>('.tab')[activeIndex] as HTMLElement | undefined)
          ?.offsetWidth ?? 0)
      : 0,
  );

  let isDragging = $state(false);
  let dragStartX = $state(0);
  let dragOffset = $state(0);
  let dragHoveredId = $state<SectionId | null>(null);

  // Scroll state to prevent bouncing
  let isScrolling = $state(false);
  let scrollTimeout: ReturnType<typeof setTimeout>;

  $effect(() => {
    if (!browser) return;

    const onScroll = () => {
      // Don't update active state from scroll while user is dragging or during programmatic scroll
      if (isDragging || isScrolling) return;

      const scrollPos = window.innerHeight + window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;

      // Check if at the bottom of the page (with buffer to account for minor subpixel or rounding differences)
      if (scrollPos >= totalHeight - 50) {
        activeId = SECTION_IDS[SECTION_IDS.length - 1];
        return;
      }

      let current: SectionId = SECTION_IDS[0];

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
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

  function scrollToSection(id: SectionId) {
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.querySelector('.sticky-header');
    const headerHeight =
      header instanceof HTMLElement && header.classList.contains('visible')
        ? header.offsetHeight
        : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;

    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 800);

    window.scrollTo({ top, behavior: 'smooth' });
    activeId = id;
  }

  function handlePointerDown(e: PointerEvent) {
    if (activeIndex < 0 || !tabBarRef) return;

    const target = e.target as HTMLElement;
    const isActiveArea =
      target.classList.contains('active-bg') ||
      target.classList.contains('active') ||
      target.closest('.active');

    if (isActiveArea) {
      e.preventDefault();
      isDragging = true;
      dragStartX = e.clientX;
      dragOffset = 0;
      dragHoveredId = activeId;
      target.setPointerCapture(e.pointerId);
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging || !tabBarRef) return;

    const rawOffset = e.clientX - dragStartX;
    const newLeft = activeLeft + rawOffset;

    // Boundary clamping (0.25rem padding = 4px)
    const minLeft = 4;
    const maxLeftAllowed = tabBarRef.offsetWidth - activeWidth - 4;

    if (newLeft < minLeft) {
      dragOffset = minLeft - activeLeft;
    } else if (newLeft > maxLeftAllowed) {
      dragOffset = maxLeftAllowed - activeLeft;
    } else {
      dragOffset = rawOffset;
    }

    // Find closest tab while dragging for visual feedback
    const currentPillCenter = activeLeft + dragOffset + activeWidth / 2;
    let closestId = activeId;
    let minDistance = Infinity;

    const tabEls = Array.from(tabBarRef.querySelectorAll<HTMLElement>('.tab'));
    for (let i = 0; i < tabs.length; i++) {
      const el = tabEls[i];
      const tabCenter = el.offsetLeft + el.offsetWidth / 2;
      const distance = Math.abs(tabCenter - currentPillCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestId = tabs[i].id;
      }
    }
    dragHoveredId = closestId;
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging) return;
    isDragging = false;

    const target = e.target as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }

    const finalOffset = dragOffset;
    dragHoveredId = null;
    dragOffset = 0;

    if (!tabBarRef) return;

    // After pointer capture is released, the browser fires a click event on the
    // capturing element. Suppress it so the onclick handler doesn't revert navigation.
    if (Math.abs(finalOffset) > 5) {
      tabBarRef.addEventListener(
        'click',
        (evt) => {
          evt.stopPropagation();
        },
        { capture: true, once: true },
      );
    }

    const pillCenter = activeLeft + finalOffset + activeWidth / 2;
    const tabEls = Array.from(tabBarRef.querySelectorAll<HTMLElement>('.tab'));
    let targetId: SectionId = activeId;
    let minDist = Infinity;

    tabEls.forEach((el, idx) => {
      if (idx >= tabs.length) return;
      const center = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - pillCenter);
      if (dist < minDist) {
        minDist = dist;
        targetId = tabs[idx].id;
      }
    });

    if (targetId !== activeId) {
      scrollToSection(targetId);
    }
  }
</script>

<svelte:window bind:innerWidth />

<nav
  bind:this={tabBarRef}
  class="tab-bar"
  aria-label={labels.navAriaLabel}
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerUp}
>
  <div
    class="active-bg"
    class:dragging={isDragging}
    style:left="{activeLeft}px"
    style:width="{activeWidth}px"
    style:transform="translateX({isDragging ? dragOffset : 0}px)"
    style:opacity="1"
  ></div>

  {#each tabs as tab (tab.id)}
    <button
      class="tab"
      class:active={isDragging ? dragHoveredId === tab.id : activeId === tab.id}
      onclick={() => {
        if (!isDragging) {
          scrollToSection(tab.id);
        }
      }}
      aria-current={activeId === tab.id ? 'location' : undefined}
    >
      {tab.label}
    </button>
  {/each}
</nav>

<style>
  .tab-bar {
    background: color-mix(in srgb, var(--color-basic-bg) 85%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--color-bg-divider);
    border-radius: 999px;
    bottom: calc(1rem + env(safe-area-inset-bottom));
    display: none;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.25rem;
    position: fixed;
    width: calc(100% - 2rem);
    max-width: 400px;
    z-index: 50;
    box-shadow: 0 4px 20px var(--color-shadow);
    touch-action: none;
  }

  @media (max-width: 960px) {
    .tab-bar {
      display: flex;
    }
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
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
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
    font-size: 0.8rem;
    font-weight: 500;
    justify-content: center;
    min-height: 44px;
    padding: 0.5rem 0.125rem;
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

  @media print {
    .tab-bar {
      display: none !important;
    }
  }
</style>
