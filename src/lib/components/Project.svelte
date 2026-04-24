<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Box, Layers } from 'lucide-svelte';

  import Github from '$lib/components/Icon/Github.svelte';
  import Period from '$lib/components/Period.svelte';
  import SkillChip from '$lib/components/SkillChip.svelte';
  import { getLabels } from '$lib/data/labels';
  import { skillState } from '$lib/states/skills.svelte';
  import { getPageLocale } from '$lib/utils/locale';

  interface Props {
    children?: Snippet;
    dateFrom: string;
    dateTo?: string;
    description: string;
    detailLink?: string;
    githubLink?: string;
    other?: boolean;
    skills?: string[];
    title: string;
    paradigm?: 'assisted' | 'agentic';
  }
  let {
    children,
    dateFrom,
    dateTo,
    description,
    detailLink,
    githubLink,
    other = false,
    skills,
    title,
    paradigm,
  }: Props = $props();

  let labels = $derived(getLabels(getPageLocale()));

  const paradigmLabel = $derived(() => {
    if (paradigm === 'agentic')
      return getPageLocale() === 'ko' ? '에이전틱 주도' : 'Agentic Driven';
    if (paradigm === 'assisted') return getPageLocale() === 'ko' ? 'AI 보조' : 'AI Assisted';
    return null;
  });
</script>

<div class={['block', other && 'other']}>
  <header class="header">
    <div class="title-row">
      <div class="title-area">
        <h3 class="project-title">
          {title}
          {#if detailLink}
            <a
              href={detailLink}
              class="detail-link"
              aria-label={`${title} — ${labels.viewProjectDetails}`}
              title={`${title} — ${labels.viewProjectDetails}`}
              data-sveltekit-reload
            >
              {labels.viewProjectDetails} →
            </a>
          {/if}
        </h3>

        {#if githubLink}
          <a
            class="github-icon-link"
            href={githubLink}
            target="_blank"
            rel="external noopener noreferrer"
            aria-label={`${title} — ${labels.goToGithubPage}`}
            title={`${title} — ${labels.goToGithubPage}`}
          >
            <Github />
          </a>
        {/if}
      </div>

      {#if paradigmLabel}
        <div class={['paradigm-badge', paradigm]}>
          {#if paradigm === 'agentic'}
            <Layers size={12} strokeWidth={3} />
          {:else}
            <Box size={12} strokeWidth={3} />
          {/if}
          <span>{paradigmLabel}</span>
        </div>
      {/if}
    </div>
    <Period {dateFrom} {dateTo} />
  </header>

  {#if !other}
    <h4>{labels.description}</h4>
  {/if}
  <p class={!children ? 'description-text' : ''}>
    {description}
  </p>

  {#if children}
    <h4>{labels.whatDidIDo}</h4>
    <div>
      {@render children()}
    </div>
  {/if}

  {#if skills}
    {#if !other}
      <h4>{labels.techStack}</h4>
    {/if}
    <ul class="skill-list">
      {#each skillState.sort(skills) as s (s)}
        <SkillChip skill={s} />
      {/each}
    </ul>
  {/if}
</div>

<style>
  .header {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--space-sm);
    padding-bottom: var(--space-sm);
    gap: 0.5rem;
  }

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .title-area {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }

  .paradigm-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.6rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .paradigm-badge.agentic {
    background: color-mix(in srgb, var(--color-cat-ai_workflow) 10%, transparent);
    color: var(--color-cat-ai_workflow);
    border: 1px solid color-mix(in srgb, var(--color-cat-ai_workflow) 30%, transparent);
  }

  .paradigm-badge.assisted {
    background: color-mix(in srgb, var(--color-cat-devops) 10%, transparent);
    color: var(--color-cat-devops);
    border: 1px solid color-mix(in srgb, var(--color-cat-devops) 30%, transparent);
  }

  .description-text {
    margin: 0;
  }

  .skill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0 1rem 0;
  }

  .project-title {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 0;
    font-size: var(--font-h3);
  }

  .detail-link {
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    color: var(--color-primary);
    transition: transform 0.2s;
    display: inline-block;
  }

  .detail-link:hover {
    text-decoration: underline;
    transform: translateX(2px);
  }

  .github-icon-link {
    align-items: center;
    align-self: center;
    border-radius: 50%;
    color: var(--color-main);
    display: flex;
    justify-content: center;
    padding: var(--space-xs);
    text-decoration: none;
    transition:
      background 0.2s,
      color 0.2s,
      transform 0.1s;
  }

  .github-icon-link:active {
    transform: scale(0.9);
  }

  .github-icon-link:hover {
    background: #24292e;
    color: #ffffff;
  }

  .github-icon-link :global(svg) {
    pointer-events: none;
  }

  .block {
    margin-bottom: var(--space-project-gap);
  }

  .block:last-child {
    margin-bottom: 0;
  }

  .block.other {
    margin-bottom: var(--space-sm);
  }

  @media (max-width: 576px) {
    .block {
      padding: 0.75rem 0;
    }

    .block.other {
      padding: 0.5rem 0;
    }
  }
</style>
