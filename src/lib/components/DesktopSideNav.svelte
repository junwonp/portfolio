<script lang="ts">
  import { createScrollSpy } from '$lib/states/scrollSpy.svelte';

  interface NavSection {
    id: string;
    label: string;
  }

  interface Props {
    sections: NavSection[];
  }

  let { sections }: Props = $props();

  let innerWidth = $state(0);
  let itemRefs = $state<HTMLElement[]>([]);

  const spy = createScrollSpy(() => sections.map((s) => s.id));
  let activeId = $derived(spy.activeId);

  let activeIndex = $derived(sections.findIndex((s) => s.id === activeId));
  let activeTop = $derived(
    innerWidth > 0 && activeIndex >= 0 && itemRefs[activeIndex]
      ? itemRefs[activeIndex].offsetTop
      : 0,
  );
  let activeHeight = $derived(
    innerWidth > 0 && activeIndex >= 0 && itemRefs[activeIndex]
      ? itemRefs[activeIndex].offsetHeight
      : 0,
  );

  function scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    spy.activeId = id;
  }
</script>

<svelte:window bind:innerWidth />

<nav class="side-nav" aria-label="Page sections">
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
              scrollTo(section.id);
            }}
            aria-current={activeId === section.id ? 'location' : undefined}
          >
            {section.label}
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
    display: block;
    font-family: inherit;
    font-size: 0.8125rem;
    padding: 0.5rem 0.75rem;
    text-align: left;
    transition: color 0.15s;
    width: 100%;
    border-radius: 6px;
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
