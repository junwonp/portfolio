<script lang="ts">
  import { slide } from 'svelte/transition';
  import { ChevronDown } from 'lucide-svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Period from '$lib/components/Period.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import ProjectItem from '$lib/components/ProjectItem.svelte';
  import { accordionState } from '$lib/states/accordion.svelte';
  import type { WorkExperienceProps } from '$lib/types/about';
  import { parseMarkdown } from '$lib/utils/markdown';

  interface Props {
    exp: WorkExperienceProps;
    isFiltered: boolean;
    labels: any;
  }

  let { exp, isFiltered, labels }: Props = $props();
</script>

<div class="company-wrapper" transition:slide={{ duration: 300 }}>
  <div class={['company-card', (accordionState.hasCompany(exp.companyName) || isFiltered) && 'open']}>
    <!-- Company header -->
    <div
      class="company-header"
      role="button"
      tabindex="0"
      onclick={() => {
        if (!isFiltered) accordionState.toggleCompany(exp.companyName);
      }}
      onkeydown={(e) => {
        if (!isFiltered && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          accordionState.toggleCompany(exp.companyName);
        }
      }}
      aria-expanded={accordionState.hasCompany(exp.companyName) || isFiltered}
    >
      <div class="company-top">
        <div class="company-left">
          <span class="company-name">{exp.companyName}</span>
          <div class="badges">
            {#if exp.titleBadge}
              <Badge text={exp.titleBadge} color="primary" />
            {/if}
            {#if !exp.dateTo}
              <Badge text={labels.present} color="green" />
            {/if}
          </div>
        </div>
        <div class="company-right pc-only">
          <Period dateFrom={exp.dateFrom} dateTo={exp.dateTo} />
        </div>
      </div>

      <div class="company-info-row">
        <div class="role-line">
          <span class="role">{exp.role}</span>
          <span class="role-separator">·</span>
          <span class="period-compact">
            <Period dateFrom={exp.dateFrom} dateTo={exp.dateTo} />
          </span>
        </div>
        <div
          class={[
            'expand-indicator',
            (accordionState.hasCompany(exp.companyName) || isFiltered) && 'open',
          ]}
        >
          <span
            >{accordionState.hasCompany(exp.companyName) || isFiltered
              ? labels.hideDetails
              : labels.showDetails}</span
          >
          <ChevronDown
            size={20}
            strokeWidth={2}
            class={`chevron-icon ${accordionState.hasCompany(exp.companyName) || isFiltered ? 'open' : ''}`}
          />
        </div>
      </div>

      <!-- Always-visible highlights -->
      {#if exp.highlights && exp.highlights.length > 0}
        <ul class="highlights">
          {#each exp.highlights as item (item)}
            <li>
              <span class="bullet"></span>
              <span class="highlight-text">
                <RichText parts={parseMarkdown(item)} />
              </span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <!-- Company-level additional link (e.g. recommendation letter) -->
    {#if exp.additional}
      <a href={exp.additional.link} target="_blank" class="additional-link">
        {exp.additional.label} →
      </a>
    {/if}

    <!-- Level 1 expand: project list -->
    {#if accordionState.hasCompany(exp.companyName) || isFiltered}
      <div class="project-list" transition:slide={{ duration: 250 }}>
        {#each exp.project as project (project.title)}
          <ProjectItem {project} companyName={exp.companyName} {isFiltered} {labels} />
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .company-wrapper {
    display: flex;
    flex-direction: column;
  }

  .company-card {
    background: var(--color-basic-bg);
    border: 1px solid var(--color-bg-divider);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    transition: all 0.2s ease;
  }

  .company-card.open {
    border-color: var(--color-primary);
  }

  .company-header {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0;
    padding: 0;
    text-align: left;
    width: 100%;
    font-family: inherit;
  }

  .company-top {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .company-left {
    align-items: center;
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .company-name {
    color: var(--color-bold);
    font-size: var(--font-h3);
    font-weight: 700;
    margin: 0;
  }

  .badges {
    display: flex;
    gap: 0.5rem;
  }

  .company-right {
    color: var(--color-sub);
    font-size: 0.9375rem;
  }

  .company-info-row {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
  }

  .role-line {
    align-items: center;
    color: var(--color-sub);
    display: flex;
    font-size: 1rem;
    gap: 0.5rem;
  }

  .role-separator {
    opacity: 0.5;
  }

  .expand-indicator {
    align-items: center;
    color: var(--color-sub);
    display: flex;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.15s;
  }

  .company-header:hover :global(.expand-indicator) {
    color: var(--color-primary);
  }

  .company-header:hover :global(.chevron-icon) {
    color: var(--color-primary);
  }

  :global(.chevron-icon) {
    transition: transform 0.2s;
    flex-shrink: 0;
    color: var(--color-sub);
  }

  :global(.expand-indicator.open .chevron-icon) {
    transform: rotate(180deg);
    color: var(--color-primary);
  }

  .highlights {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .highlights li {
    align-items: flex-start;
    display: flex;
    gap: 0.75rem;
    padding: 0;
  }

  .highlights li:before {
    display: none;
  }

  .bullet {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: var(--color-primary);
    margin-top: 0.65rem;
    flex-shrink: 0;
  }

  .highlight-text {
    color: var(--color-main);
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  .project-list {
    background: var(--color-basic-bg);
    border: 1px solid var(--color-bg-divider);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    overflow: hidden;
  }

  .additional-link {
    align-self: flex-start;
    color: var(--color-primary);
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 0.75rem;
    text-decoration: none;
  }

  .additional-link:hover {
    text-decoration: underline;
  }

  .pc-only {
    display: block;
  }

  @media (max-width: 576px) {
    .pc-only {
      display: none;
    }

    .company-card {
      padding: 1.25rem;
    }

    .company-info-row {
      align-items: flex-start;
    }

    .role-line {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.15rem;
    }

    .role-separator {
      display: none;
    }

    .role {
      font-size: 0.9375rem;
    }

    .period-compact {
      font-size: 0.8125rem;
    }
  }
</style>
