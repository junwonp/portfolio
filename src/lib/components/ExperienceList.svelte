<script lang="ts">
  import { flip } from 'svelte/animate';
  import { slide } from 'svelte/transition';

  import ArrowLink from '$lib/components/ArrowLink.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import SkillChip from '$lib/components/SkillChip.svelte';
  import { getLabels } from '$lib/data/labels';
  import { skillState } from '$lib/states/skills.svelte';
  import type { OtherExperienceProps } from '$lib/types/about';
  import { getPageLocale } from '$lib/utils/locale';
  import { parseMarkdown } from '$lib/utils/markdown';

  interface Props {
    experiences: OtherExperienceProps[];
    skillLimit?: number;
  }

  let { experiences, skillLimit }: Props = $props();

  let labels = $derived(getLabels(getPageLocale()));

  const formatDate = (dateFrom?: string, dateTo?: string) => {
    if (!dateFrom) return '';
    if (dateFrom.length === 4) return dateFrom; // e.g. 2024
    const formatted = dateFrom.replace('-', '.');
    const isOngoing = !dateTo || dateTo !== dateFrom;
    return isOngoing ? formatted + ' ~' : formatted;
  };
</script>

<div class="experience-list">
  {#each experiences as exp (exp.project[0].title)}
    {@const project = exp.project[0]}
    <div class="item-wrapper" animate:flip={{ duration: 400 }} transition:slide={{ duration: 300 }}>
      <div class="item">
        <div class="content">
          <div class="header">
            <h3 class="title">{project.title}</h3>
            {#if exp.titleBadge}
              <Badge text={exp.titleBadge} />
            {/if}
          </div>
          <p class="description">
            <RichText parts={parseMarkdown(project.description)} />
          </p>

          {#if project.metrics && project.metrics.length > 0}
            {@const metricCount = Math.min(project.metrics.length, 4)}
            <dl
              class="metric-strip"
              class:has-four-metrics={metricCount === 4}
              style:--metric-count={metricCount}
            >
              {#each project.metrics as metric (metric.label)}
                <div class="metric-item">
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              {/each}
            </dl>
          {/if}

          {#if project.detailLink}
            <div class="link-wrapper">
              <ArrowLink href={project.detailLink} label={labels.viewProjectDetails} reload />
            </div>
          {/if}

          {#if project.skills}
            {@const featuredSkills = project.featuredSkills ?? []}
            {@const remainingSkills = skillState
              .sort(project.skills)
              .filter((skill) => !featuredSkills.includes(skill))}
            {@const sortedSkills = skillLimit
              ? [...featuredSkills, ...remainingSkills]
              : skillState.sort(project.skills)}
            {@const visibleSkills = skillLimit ? sortedSkills.slice(0, skillLimit) : sortedSkills}
            {@const hiddenSkillCount = sortedSkills.length - visibleSkills.length}
            <div class="tag-list">
              {#each visibleSkills as skill (skill)}
                <SkillChip {skill} />
              {/each}
              {#if hiddenSkillCount > 0}
                <span class="more-chip" title={sortedSkills.slice(skillLimit).join(', ')}>
                  +{hiddenSkillCount}
                </span>
              {/if}
            </div>
          {/if}
        </div>
        <div class="date-wrapper">
          <span class="date">{formatDate(project.dateFrom, project.dateTo)}</span>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .experience-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-top: var(--space-md);
  }

  .item-wrapper {
    display: flex;
    flex-direction: column;
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-md);
    min-width: 0;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .title {
    font-size: var(--font-h3);
    font-weight: 700;
    margin: 0;
    color: var(--color-bold);
    overflow-wrap: anywhere;
  }

  .link-wrapper {
    margin-bottom: 0.75rem;
  }

  .description {
    font-size: 0.9375rem;
    color: var(--color-main);
    margin: 0 0 0.5rem 0;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .metric-strip {
    background: color-mix(in srgb, var(--color-surface-hover) 35%, var(--color-basic-bg));
    border-radius: 12px;
    display: grid;
    gap: 0;
    grid-template-columns: repeat(var(--metric-count), minmax(0, 1fr));
    margin: 0 0 0.75rem;
    padding: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
    border: none;
  }

  :global(html.dark) .metric-strip {
    background: rgba(255, 255, 255, 0.03);
    box-shadow: none;
    border: 0.5px solid rgba(255, 255, 255, 0.05);
  }

  .metric-item {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.65rem;
  }

  .metric-item dd {
    color: var(--color-primary);
    font-size: 0.95rem;
    font-weight: 800;
    line-height: 1;
    margin: 0;
    white-space: nowrap;
  }

  .metric-item dt {
    color: var(--color-sub);
    font-size: 0.75rem;
    line-height: 1.2;
  }

  @media (max-width: 420px) {
    .metric-strip.has-four-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    min-width: 0;
  }

  .more-chip {
    align-items: center;
    border: 1px dashed var(--color-bg-divider);
    border-radius: 6px;
    color: var(--color-sub);
    display: inline-flex;
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1;
    padding: 0.35rem 0.6rem;
    white-space: nowrap;
  }

  .date-wrapper {
    flex-shrink: 0;
    text-align: right;
  }

  .date {
    font-size: 0.875rem;
    color: var(--color-placeholder);
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .item {
      flex-direction: column;
      gap: 0.5rem;
    }
    .date-wrapper {
      order: -1;
      text-align: left;
    }

    .metric-item {
      padding: 0.55rem;
    }
  }
</style>
