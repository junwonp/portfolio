<script lang="ts">
  import { CodeXml, Cpu, Database, Library, Palette, Server, Sparkles, Zap } from 'lucide-svelte';

  import ArrowLink from '$lib/components/ArrowLink.svelte';
  import SkillChip from '$lib/components/SkillChip.svelte';
  import { getLabels } from '$lib/data/labels';
  import type { SkillProps } from '$lib/types/about';
  import type { Language } from '$lib/utils/language';

  interface Props {
    locale: Language;
    skills: SkillProps[];
  }

  let { locale, skills }: Props = $props();

  let labels = $derived(getLabels(locale));

  const categoryIcons: Record<string, typeof CodeXml> = {
    languages: CodeXml,
    frameworks: Library,
    ui: Palette,
    state: Database,
    performance: Zap,
    backend: Server,
    devops: Cpu,
    ai_workflow: Sparkles,
  };
</script>

<div class="bento-grid">
  {#each skills as skill (skill.title)}
    {@const Icon = categoryIcons[skill.id]}
    <div
      class={['card', (skill.id === 'frameworks' || skill.id === 'ai_workflow') && 'span-2']}
      style:--cat-color="var(--color-cat-{skill.id})"
    >
      <div class="card-header">
        {#if Icon}
          <Icon class="category-icon" size={18} strokeWidth={2.5} />
        {/if}
        <h3 class="card-title">{skill.title}</h3>
      </div>
      <div class="tag-list">
        {#each skill.list as item (item)}
          <SkillChip skill={item} />
        {/each}
      </div>
      {#if skill.detailLink}
        <div class="card-footer">
          {#if skill.description}
            <div class="card-prose">
              <p>{skill.description}</p>
            </div>
          {/if}
          <ArrowLink
            href={skill.detailLink}
            label={skill.detailLabel || labels.viewProjectDetails}
            color="var(--cat-color)"
            reload
          />
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
    background: var(--color-basic-bg);
    border-radius: 20px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    min-width: 0;
    transition:
      transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.2s,
      background-color 0.2s,
      border-color 0.2s;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
    border: 0.5px solid rgba(0, 0, 0, 0.06);
  }

  .card.span-2 {
    grid-column: span 2;
  }

  .card:hover {
    transform: translateY(-3px);
    background: color-mix(in srgb, var(--cat-color) 4%, var(--color-basic-bg));
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
    border-color: color-mix(in srgb, var(--cat-color) 20%, rgba(0, 0, 0, 0.06));
  }

  :global(html.dark) .card {
    background: var(--color-code-bg);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
    border: 0.5px solid rgba(255, 255, 255, 0.05);
  }

  :global(html.dark) .card:hover {
    background: color-mix(in srgb, var(--cat-color) 6%, var(--color-code-bg));
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    border-color: color-mix(in srgb, var(--cat-color) 30%, rgba(255, 255, 255, 0.05));
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1rem;
    color: var(--cat-color);
  }

  :global(.category-icon) {
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
    min-width: 0;
  }

  .card-footer {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
    border-top: 0.5px solid color-mix(in srgb, var(--cat-color) 15%, var(--color-bg-divider));
    padding-top: 0.75rem;
  }

  .card-prose p {
    font-size: 0.8125rem;
    line-height: 1.6;
    color: var(--color-sub);
    margin: 0;
    word-break: keep-all;
  }

  @media (max-width: 768px) {
    .bento-grid {
      grid-template-columns: 1fr;
    }

    .card.span-2 {
      grid-column: auto;
    }
  }
</style>
