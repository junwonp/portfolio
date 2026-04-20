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
    <div class="card">
      <h3 class="card-title">{skill.title.toUpperCase()}</h3>
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
    background: var(--color-disabled-bg);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  .card-title {
    color: var(--color-sub);
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
