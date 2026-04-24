<script lang="ts">
  import { CodeXml, Cpu, Database, Library, Palette, Server, Sparkles, Zap } from 'lucide-svelte';

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
    <div class="card" style:--cat-color="var(--color-cat-{skill.id})">
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
        <div class={['card-footer', skill.id === 'ai_workflow' && 'no-divider']}>
          {#if skill.description && skill.id !== 'ai_workflow'}
            <div class="card-prose">
              <p>{skill.description}</p>
            </div>
          {/if}
          <a href={skill.detailLink} class="card-link" data-sveltekit-reload>
            {skill.detailLabel || labels.viewProjectDetails} →
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
</style>
