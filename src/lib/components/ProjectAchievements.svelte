<script lang="ts">
  import { untrack } from 'svelte';
  import { slide } from 'svelte/transition';
  import { ChevronDown } from 'lucide-svelte';

  export interface Achievement {
    tag: string;
    accent?: boolean;
    title: string;
    detail: string;
  }

  interface Props {
    achievements: Achievement[];
  }

  let { achievements }: Props = $props();

  const firstAccentIndex = $derived(achievements.findIndex((a) => a.accent));

  let openIndex = $state(untrack(() => (firstAccentIndex >= 0 ? firstAccentIndex : 0)));

  function toggle(index: number): void {
    openIndex = openIndex === index ? -1 : index;
  }
</script>

<div class="achievements">
  {#each achievements as achievement, i (i)}
    {@const isOpen = openIndex === i}
    <div class="ach-card" class:open={isOpen}>
      <button
        class="ach-header"
        onclick={() => {
          toggle(i);
        }}
        aria-expanded={isOpen}
      >
        <div class="ach-title-row">
          <span class="ach-tag" class:accent={achievement.accent}>{achievement.tag}</span>
          <span class="ach-title">{achievement.title}</span>
        </div>
        <div class="ach-header-right">
          <ChevronDown size={18} strokeWidth={2} class={`ach-chevron ${isOpen ? 'open' : ''}`} />
        </div>
      </button>
      {#if isOpen}
        <div class="ach-body" transition:slide={{ duration: 250 }}>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          <div class="ach-desc">{@html achievement.detail}</div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .achievements {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 56px;
  }

  .ach-card {
    border: 1px solid var(--color-bg-divider);
    border-radius: 12px;
    background: var(--color-basic-bg);
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .ach-card:hover {
    border-color: var(--color-sub);
  }

  .ach-card.open {
    border-color: var(--color-primary);
    box-shadow: 0 4px 12px var(--color-shadow);
  }

  .ach-header {
    width: 100%;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    cursor: pointer;
    user-select: none;
    background: transparent;
    border: none;
    text-align: left;
  }

  .ach-title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .ach-tag {
    font-size: 13px;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 6px;
    background: color-mix(in srgb, var(--color-primary) 10%, transparent);
    color: var(--color-primary);
    flex-shrink: 0;
    min-width: 60px;
    text-align: center;
    white-space: nowrap;
    line-height: 1;
  }

  .ach-tag.accent {
    background: #e6f6eb;
    color: #008a2e;
  }

  :global(html.dark) .ach-tag.accent {
    background: #003d14;
    color: #34d399;
  }

  .ach-title {
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--color-bold);
    line-height: 1.4;
  }

  .ach-header-right {
    display: flex;
    align-items: center;
    color: var(--color-sub);
  }

  .ach-chevron {
    transition: transform 0.2s;
    flex-shrink: 0;
  }

  .ach-chevron.open {
    transform: rotate(180deg);
    color: var(--color-primary);
  }

  .ach-body {
    padding: 0 20px 20px;
  }

  .ach-desc {
    font-size: 0.9375rem;
    color: var(--color-main);
    line-height: 1.6;
    border-top: 1px solid var(--color-bg-subdivider);
    padding-top: 16px;
  }

  :global(.ach-desc strong) {
    color: var(--color-bold);
    font-weight: 700;
  }

  :global(.ach-desc code) {
    background: var(--color-code-bg);
    color: var(--color-inline-code);
    padding: 2px 5px;
    border-radius: 4px;
  }

  @media (max-width: 640px) {
    .ach-header {
      padding: 14px 16px;
      gap: 12px;
    }

    .ach-title-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .ach-title {
      font-size: 0.9375rem;
    }

    .ach-body {
      padding: 0 16px 16px;
    }
  }
</style>
