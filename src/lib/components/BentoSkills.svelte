<script lang="ts">
  import SkillChip from '$lib/components/SkillChip.svelte';
  import type { SkillProps } from '$lib/types/about';

  interface Props {
    skills: SkillProps[];
  }
  let { skills }: Props = $props();

  const ICONS: Record<string, string> = {
    languages: 'M16 18L22 12L16 6M8 6L2 12L8 18', // Code
    frameworks: 'M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12', // Layers
    ui: 'M12 19L21 12L12 5L3 12L12 19Z', // Palette/Diamond
    state: 'M4 7V17M20 7V17M4 7C4 5.34315 7.58172 4 12 4C16.4183 4 20 5.34315 20 7M4 7C4 8.65685 7.58172 10 12 10C16.4183 10 20 8.65685 20 7M4 12C4 13.6569 7.58172 15 12 15C16.4183 15 20 13.6569 20 12M4 17C4 18.6569 7.58172 20 12 20C16.4183 20 20 18.6569 20 17', // Database
    performance: 'M13 2L3 14H12L11 22L21 10H12L13 2Z', // Zap
    backend: 'M5 10H19M5 14H19M5 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V8C3 6.89543 3.89543 6 5 6Z', // Server
    devops: 'M12 16V22M8 12H2M16 12H22M12 8V2M7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12Z', // Target/Focus
    tools: 'M14.7 6.3C15.1 5.9 15.1 5.3 14.7 4.9L13.1 3.3C12.7 2.9 12.1 2.9 11.7 3.3L10.3 4.7C9.9 5.1 9.9 5.7 10.3 6.1L11.9 7.7C12.3 8.1 12.9 8.1 13.3 7.7L14.7 6.3ZM11.9 7.7L5 14.6V19H9.4L16.3 12.1M11.9 7.7L16.3 12.1' // Wrench
  };
</script>

<div class="bento-grid">
  {#each skills as skill (skill.title)}
    <div class={['card', `cat-${skill.id}`]}>
      <div class="card-header">
        <svg
          class="category-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d={ICONS[skill.id] || ''}></path>
        </svg>
        <h3 class="card-title">{skill.title}</h3>
      </div>
      <div class="tag-list">
        {#each skill.list as item (item)}
          <SkillChip skill={item} />
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    margin-top: var(--space-md);
  }

  .card {
    --cat-color: var(--color-bg-divider);
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--cat-color) 20%, var(--color-bg-divider));
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    transition:
      border-color 0.2s,
      background-color 0.2s;
  }

  .card:hover {
    border-color: var(--cat-color);
    background: color-mix(in srgb, var(--cat-color) 2%, transparent);
  }

  .cat-languages {
    --cat-color: var(--color-cat-languages);
  }
  .cat-frameworks {
    --cat-color: var(--color-cat-frameworks);
  }
  .cat-ui {
    --cat-color: var(--color-cat-ui);
  }
  .cat-state {
    --cat-color: var(--color-cat-state);
  }
  .cat-performance {
    --cat-color: var(--color-cat-performance);
  }
  .cat-backend {
    --cat-color: var(--color-cat-backend);
  }
  .cat-devops {
    --cat-color: var(--color-cat-devops);
  }
  .cat-tools {
    --cat-color: var(--color-cat-tools);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1rem;
    color: var(--cat-color);
  }

  .category-icon {
    flex-shrink: 0;
  }

  .card-title {
    color: var(--color-bold);
    font-size: 0.9375rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    margin: 0;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  @media (max-width: 768px) {
    .bento-grid {
      grid-template-columns: 1fr;
    }
  }

  @media print {
    .card {
      background: transparent;
      border: 1px solid var(--color-bg-divider);
    }
  }
</style>
