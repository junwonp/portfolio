<script lang="ts">
  import { CodeXml, Cpu, Database, Library, Palette, Server, Sparkles, Zap } from 'lucide-svelte';

  import SkillChip from '$lib/components/SkillChip.svelte';
  import type { SkillProps } from '$lib/types/about';
  import { getPageLocale } from '$lib/utils/locale';

  interface Props {
    skills: SkillProps[];
  }
  let { skills }: Props = $props();

  const viewDetailsLabel = $derived(getPageLocale() === 'ko' ? '자세히 보기' : 'View Details');
</script>

<div class="bento-grid">
  {#each skills as skill (skill.title)}
    <div class={['card', `cat-${skill.id}`]}>
      <div class="card-header">
        {#if skill.id === 'languages'}
          <CodeXml class="category-icon" size={18} strokeWidth={2.5} />
        {:else if skill.id === 'frameworks'}
          <Library class="category-icon" size={18} strokeWidth={2.5} />
        {:else if skill.id === 'ui'}
          <Palette class="category-icon" size={18} strokeWidth={2.5} />
        {:else if skill.id === 'state'}
          <Database class="category-icon" size={18} strokeWidth={2.5} />
        {:else if skill.id === 'performance'}
          <Zap class="category-icon" size={18} strokeWidth={2.5} />
        {:else if skill.id === 'backend'}
          <Server class="category-icon" size={18} strokeWidth={2.5} />
        {:else if skill.id === 'devops'}
          <Cpu class="category-icon" size={18} strokeWidth={2.5} />
        {:else if skill.id === 'ai_workflow'}
          <Sparkles class="category-icon" size={18} strokeWidth={2.5} />
        {/if}
        <h3 class="card-title">{skill.title}</h3>
      </div>
      <div class="tag-list">
        {#each skill.list as item (item)}
          <SkillChip skill={item} />
        {/each}
      </div>
      {#if skill.detailLink}
        <div class={['card-footer', skill.id === 'ai_workflow' && 'no-divider']}>
          {#if skill.description && skill.id !== 'ai_workflow'}
            <div class="card-prose">
              <p>{skill.description}</p>
            </div>
          {/if}
          <a href={skill.detailLink} class="card-link" data-sveltekit-reload>
            {skill.detailLabel || viewDetailsLabel} →
          </a>
        </div>
      {/if}
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
  .cat-ai_workflow {
    --cat-color: var(--color-cat-ai_workflow);
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

  .card-footer {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
    border-top: 1px solid color-mix(in srgb, var(--cat-color) 15%, var(--color-bg-divider));
    padding-top: 0.75rem;
  }

  .card-footer.no-divider {
    border-top: none;
    margin-top: 0.75rem;
    padding-top: 0;
  }

  .card-prose p {
    font-size: 0.8125rem;
    line-height: 1.6;
    color: var(--color-sub);
    margin: 0;
    word-break: keep-all;
  }

  .card-link {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--cat-color);
    text-decoration: none;
    align-self: flex-start;
    transition: transform 0.2s;
  }

  .card-link:hover {
    text-decoration: underline;
    transform: translateX(2px);
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
