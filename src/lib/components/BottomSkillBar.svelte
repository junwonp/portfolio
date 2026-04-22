<script lang="ts">
  import { slide, fly } from 'svelte/transition';

  import SkillChip from '$lib/components/SkillChip.svelte';
  import { skillState } from '$lib/states/skills.svelte';
  import type { SkillProps } from '$lib/types/about';

  interface Props {
    skills: SkillProps[];
    barHeight?: number;
  }
  let { skills, barHeight = $bindable(0) }: Props = $props();

  let isMinimized = $state(false);

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      skillState.close();
    }
  }

  let filterText = $derived(() => {
    const count = skillState.selectedTechs.length;
    if (count === 0) return '';
    if (count === 1) return `"${skillState.selectedTechs[0]}"`;
    return `"${skillState.selectedTechs[0]}" 외 ${count - 1}개`;
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="bottom-skill-bar-wrapper"
  transition:fly={{ y: 50, duration: 400, opacity: 0 }}
  bind:clientHeight={barHeight}
>
  <div class="bottom-skill-bar">
    <div class="bar-header">
      <div class="status-info">
        <span class={['status-dot', skillState.isEmpty && 'inactive']}></span>
        <span class="status-text">
          {#if skillState.isEmpty}
            기술을 선택해서 필터링해보세요
          {:else}
            현재 <strong>{filterText()}</strong> 필터링 중
          {/if}
        </span>
      </div>
      <div class="header-actions">
        <button
          class="toggle-btn"
          onclick={() => (isMinimized = !isMinimized)}
          aria-label={isMinimized ? '펼치기' : '접기'}
        >
          {isMinimized ? '↑ 펼치기' : '↓ 접기'}
        </button>
        <button class="close-btn" onclick={() => skillState.close()} aria-label="필터 해제 및 닫기">
          ✕ 닫기
        </button>
      </div>
    </div>

    {#if !isMinimized}
      <div class="bar-body" transition:slide={{ duration: 250 }}>
        {#each skills as skillGroup (skillGroup.title)}
          <div class="skill-category">
            <h4 class="category-title">{skillGroup.title}</h4>
            <div class="category-chips">
              {#each skillGroup.list as skill (skill)}
                <SkillChip {skill} />
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .bottom-skill-bar-wrapper {
    position: fixed;
    z-index: 60;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 2rem);
    max-width: 800px;
    pointer-events: none;
  }

  .bottom-skill-bar {
    background: color-mix(in srgb, var(--color-basic-bg) 95%, transparent);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--color-bg-divider);
    border-radius: 16px;
    box-shadow: 0 10px 40px var(--color-shadow);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    pointer-events: auto;
  }

  .bar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--color-bg-divider);
    background: color-mix(in srgb, var(--color-primary) 5%, transparent);
  }

  .status-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--color-primary);
    box-shadow: 0 0 8px var(--color-primary);
    transition: all 0.2s;
  }

  .status-dot.inactive {
    background-color: var(--color-placeholder);
    box-shadow: none;
  }

  .status-text {
    font-size: 0.9375rem;
    color: var(--color-main);
    margin: 0;
  }

  .status-text strong {
    color: var(--color-primary);
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
  }

  .toggle-btn,
  .close-btn {
    background: var(--color-bg-subdivider);
    border: none;
    border-radius: 6px;
    color: var(--color-sub);
    font-size: 0.8125rem;
    font-weight: 600;
    padding: 0.4rem 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .toggle-btn:hover,
  .close-btn:hover {
    background: var(--color-bg-divider);
    color: var(--color-bold);
  }

  .bar-body {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.25rem;
    max-height: 40vh;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .skill-category {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .category-title {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-placeholder);
    margin: 0;
  }

  .category-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  @media (max-width: 960px) {
    .bottom-skill-bar-wrapper {
      bottom: calc(1rem + env(safe-area-inset-bottom));
      left: 1rem;
      right: 1rem;
      width: auto;
      transform: none;
    }
  }

  @media print {
    .bottom-skill-bar-wrapper {
      display: none !important;
    }
  }
</style>
