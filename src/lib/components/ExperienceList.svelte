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
  }
  let { experiences }: Props = $props();

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

          {#if project.detailLink}
            <div class="link-wrapper">
              <ArrowLink href={project.detailLink} label={labels.viewProjectDetails} reload />
            </div>
          {/if}

          {#if project.skills}
            <div class="tag-list">
              {#each skillState.sort(project.skills) as skill (skill)}
                <SkillChip {skill} />
              {/each}
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
  }

  .content {
    flex: 1;
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
  }

  .link-wrapper {
    margin-bottom: 0.75rem;
  }

  .description {
    font-size: 0.9375rem;
    color: var(--color-main);
    margin: 0 0 0.5rem 0;
    line-height: 1.5;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
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
  }
</style>
