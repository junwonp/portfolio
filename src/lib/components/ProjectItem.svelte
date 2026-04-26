<script lang="ts">
  import { slide } from 'svelte/transition';
  import { ChevronDown } from 'lucide-svelte';
  import { accordionState } from '$lib/states/accordion.svelte';
  import { skillState } from '$lib/states/skills.svelte';
  import type { ProjectItem as ProjectItemType } from '$lib/types/about';
  import { parseMarkdown } from '$lib/utils/markdown';
  import RichText from '$lib/components/RichText.svelte';
  import Period from '$lib/components/Period.svelte';
  import ArrowLink from '$lib/components/ArrowLink.svelte';
  import SkillChip from '$lib/components/SkillChip.svelte';

  interface Props {
    project: ProjectItemType;
    companyName: string;
    isFiltered: boolean;
    labels: any;
  }

  let { project, companyName, isFiltered, labels }: Props = $props();

  function parseDetailLine(line: string) {
    const match = line.match(/^\*\*\[(.*?)\]\*\*(.*)$/);
    if (match) {
      return { label: match[1], content: match[2].trim() };
    }
    return { label: null, content: line };
  }

  let isOpen = $derived(accordionState.isProjectOpen(companyName, project.title) || isFiltered);
</script>

<div class={['project-item', isOpen && 'is-open']} transition:slide={{ duration: 200 }}>
  <!-- Project row header -->
  <button
    class="project-header"
    onclick={() => {
      if (!isFiltered) accordionState.toggleProject(companyName, project.title);
    }}
    aria-expanded={isOpen}
  >
    <div class="project-title-area">
      <div class="project-title-row">
        <span class="project-title">{project.title}</span>
        <span class="project-period mobile-only">
          <Period dateFrom={project.dateFrom} dateTo={project.dateTo} />
        </span>
      </div>
      <div class="project-desc-line">
        <span class="project-description-short">{project.description}</span>
        {#if project.skills && project.skills.length > 0}
          <span class="desc-separator">·</span>
          <span class="main-skills">{skillState.sort(project.skills).slice(0, 2).join(', ')}</span>
        {/if}
      </div>
    </div>
    <div class="project-header-right">
      <span class="project-period pc-only">
        <Period dateFrom={project.dateFrom} dateTo={project.dateTo} />
      </span>
      <ChevronDown size={20} strokeWidth={2} class={`project-chevron ${isOpen ? 'open' : ''}`} />
    </div>
  </button>

  <!-- Level 2 expand: project details -->
  {#if isOpen}
    <div class="project-content" transition:slide={{ duration: 200 }}>
      {#if project.metrics && project.metrics.length > 0}
        <div class="project-metrics">
          {#each project.metrics as metric (metric.label)}
            <div class="metric-item">
              <span class="metric-value">{metric.value}</span>
              <span class="metric-label">{metric.label}</span>
            </div>
          {/each}
        </div>
      {/if}

      {#if project.detail.length > 0}
        <div class="detail-grid">
          {#each project.detail as line (line)}
            {@const parsed = parseDetailLine(line)}
            <div class="detail-row">
              {#if parsed.label}
                <div class="detail-label">
                  <span class="label-pill">{parsed.label}</span>
                </div>
              {/if}
              <div class="detail-text">
                <RichText parts={parseMarkdown(parsed.content)} />
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if project.detailLink}
        <div class="project-links">
          <ArrowLink href={project.detailLink} label={labels.viewProjectDetails} />
        </div>
      {/if}

      {#if project.skills && project.skills.length > 0}
        <div class="skill-tags">
          {#each skillState.sort(project.skills) as skill (skill)}
            <SkillChip {skill} />
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .project-item {
    border-bottom: 1px solid var(--color-bg-divider);
    transition: background-color 0.15s;
  }

  .project-item:last-child {
    border-bottom: none;
  }

  .project-header {
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    padding: 1rem;
    text-align: left;
    width: 100%;
    font-family: inherit;
  }

  .project-title-area {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.25rem;
  }

  .project-title-row {
    align-items: center;
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
  }

  .project-title {
    color: var(--color-bold);
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }

  .project-desc-line {
    align-items: center;
    color: var(--color-sub);
    display: flex;
    font-size: 0.9375rem;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .desc-separator {
    opacity: 0.5;
  }

  .project-header-right {
    align-items: center;
    display: flex;
    gap: 1rem;
  }

  .project-period {
    color: var(--color-sub);
    font-size: 0.875rem;
    white-space: nowrap;
  }

  :global(.project-chevron) {
    transition: transform 0.2s;
    flex-shrink: 0;
    color: var(--color-sub);
  }

  :global(.project-chevron.open),
  .project-header:hover :global(.project-chevron) {
    transform: rotate(180deg);
    color: var(--color-primary);
  }

  .project-content {
    background: transparent;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 0 1rem 1.25rem 1rem;
  }

  .project-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    padding: 1rem;
    background: var(--color-code-bg);
    border-radius: 8px;
    margin-top: 0.5rem;
  }

  .metric-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .metric-value {
    color: var(--color-primary);
    font-size: 1.125rem;
    font-weight: 700;
  }

  .metric-label {
    color: var(--color-sub);
    font-size: 0.75rem;
  }

  .detail-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .detail-row {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .detail-label {
    width: fit-content;
  }

  .label-pill {
    background: var(--color-bg-subdivider);
    border-radius: 6px;
    color: var(--color-sub);
    font-size: 0.8125rem;
    font-weight: 600;
    padding: 0.3rem 0.6rem;
    display: inline-block;
    line-height: 1.3;
    white-space: nowrap;
  }

  .detail-text {
    color: var(--color-main);
    font-size: 1rem;
    line-height: 1.6;
    flex: 1;
  }

  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .project-links {
    display: flex;
    gap: 1rem;
  }

  .pc-only {
    display: block;
  }

  .mobile-only {
    display: none;
  }

  @media (max-width: 576px) {
    .pc-only {
      display: none;
    }
    .mobile-only {
      display: block;
    }

    .project-title-row {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.2rem;
    }

    .project-header {
      padding: 0.875rem;
    }
  }
</style>
