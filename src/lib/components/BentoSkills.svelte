<script lang="ts">
  import SkillChip from '$lib/components/SkillChip.svelte';
  import type { SkillProps } from '$lib/types/about';

  interface Props {
    skills: SkillProps[];
  }
  let { skills }: Props = $props();
</script>

<div class="bento-grid">
  {#each skills as skill (skill.title)}
    <div class={['card', `cat-${skill.id}`]}>
      <h3 class="card-title">{skill.title}</h3>
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
    gap: var(--space-sm);
    margin-top: var(--space-md);
  }

  .card {
    --cat-color: var(--color-bg-divider);
    background: color-mix(in srgb, var(--cat-color) 4%, var(--color-basic-bg));
    border: 1px solid color-mix(in srgb, var(--cat-color) 15%, var(--color-bg-divider));
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px color-mix(in srgb, var(--cat-color) 8%, transparent);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px color-mix(in srgb, var(--cat-color) 12%, transparent);
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

  .card-title {
    color: var(--color-bold);
    font-size: var(--font-h6);
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-sm);
    margin-top: 0;
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
