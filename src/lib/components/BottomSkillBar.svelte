<script lang="ts">
  import { fly, slide } from 'svelte/transition';

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
    return `"${skillState.selectedTechs[0]}" 외 ${String(count - 1)}개`;
  });

  const ICONS: Record<string, string> = {
    languages: 'M16 18L22 12L16 6M8 6L2 12L8 18',
    frameworks: 'M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12',
    ui: 'M12 19L21 12L12 5L3 12L12 19Z',
    state:
      'M4 7V17M20 7V17M4 7C4 5.34315 7.58172 4 12 4C16.4183 4 20 5.34315 20 7M4 7C4 8.65685 7.58172 10 12 10C16.4183 10 20 8.65685 20 7M4 12C4 13.6569 7.58172 15 12 15C16.4183 15 20 13.6569 20 12M4 17C4 18.6569 7.58172 20 12 20C16.4183 20 20 18.6569 20 17',
    performance: 'M13 2L3 14H12L11 22L21 10H12L13 2Z',
    backend:
      'M5 10H19M5 14H19M5 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V8C3 6.89543 3.89543 6 5 6Z',
    devops:
      'M12 16V22M8 12H2M16 12H22M12 8V2M7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12Z',
    ai_workflow:
      'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
  };
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
        <button
          class="close-btn"
          onclick={() => {
            skillState.close();
          }}
          aria-label="필터 해제 및 닫기"
        >
          ✕ 닫기
        </button>
      </div>
    </div>

    {#if !isMinimized}
      <div class="bar-body" transition:slide={{ duration: 250 }}>
        {#each skills as skillGroup (skillGroup.title)}
          <div class="skill-category">
            <div class="category-header" style:color={`var(--color-cat-${skillGroup.id})`}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d={ICONS[skillGroup.id] || ''}></path>
              </svg>
              <h4 class="category-title">{skillGroup.title}</h4>
            </div>
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
    display: flex;
    align-items: center;
    gap: 0.25rem;
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

  .category-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .category-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: inherit;
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
