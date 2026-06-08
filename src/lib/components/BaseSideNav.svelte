<script lang="ts">
  // Core Sidebar Presentation Component complying with Apple HIG Web Hybrid Design
  interface NavSection {
    id: string;
    label: string;
  }

  interface Props {
    sections: NavSection[];
    activeId: string | null;
    onselect: (id: string) => void;
    ariaLabel?: string;
  }

  let { sections, activeId, onselect, ariaLabel = 'Page sections' }: Props = $props();

  let innerWidth = $state(0);
  let itemRefs = $state<HTMLElement[]>([]);

  let activeIndex = $derived(sections.findIndex((s) => s.id === activeId));
  let activeTop = $derived(
    innerWidth > 960 && activeIndex >= 0 && itemRefs[activeIndex]
      ? itemRefs[activeIndex].offsetTop
      : 0,
  );
  let activeHeight = $derived(
    innerWidth > 960 && activeIndex >= 0 && itemRefs[activeIndex]
      ? itemRefs[activeIndex].offsetHeight
      : 0,
  );
</script>

<svelte:window bind:innerWidth />

<nav class="side-nav" aria-label={ariaLabel}>
  <div class="nav-list-wrapper">
    <div
      class="active-bg"
      style:transform="translateY({activeTop}px)"
      style:height="{activeHeight}px"
      style:opacity={activeId ? 1 : 0}
    ></div>
    <ul>
      {#each sections as section, i (section.id)}
        <li bind:this={itemRefs[i]}>
          <button
            class="nav-item"
            class:active={activeId === section.id}
            onclick={() => {
              onselect(section.id);
            }}
            aria-current={activeId === section.id ? 'location' : undefined}
          >
            <span class="nav-label">{section.label}</span>
          </button>
        </li>
      {/each}
    </ul>
  </div>
</nav>

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

  .active-bg {
    position: absolute;
    left: 0;
    right: 0;
    background: color-mix(
      in srgb,
      var(--color-primary) 8%,
      transparent
    ); /* Apple style soft vibrancy fill */
    border-radius: 8px; /* Smooth rounded corners */
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
    display: block;
    font-family: inherit;
    font-size: 0.875rem; /* 14px for optimal readability */
    padding: 0.5rem 1rem; /* Expanded target area */
    text-align: left;
    transition: all 0.15s ease;
    width: 100%;
    border-radius: 8px;
  }

  .nav-item:hover {
    color: var(--color-bold);
    background: var(--color-surface-hover); /* Gentle micro hover state */
  }

  .nav-item.active {
    background: transparent !important; /* Slider active-bg handles active background */
    color: var(--color-primary); /* Apple System Blue */
    font-weight: 600;
  }

  .nav-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  @media (max-width: 960px) {
    .side-nav {
      display: none;
    }
  }
</style>
