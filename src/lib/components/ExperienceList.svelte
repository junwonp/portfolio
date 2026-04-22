<script lang="ts">
  import SkillChip from '$lib/components/SkillChip.svelte';
  import { getLabels } from '$lib/data/labels';
  import type { OtherExperienceProps } from '$lib/types/about';
  import { getPageLocale } from '$lib/utils/locale';

  interface Props {
    experiences: OtherExperienceProps[];
  }
  let { experiences }: Props = $props();

  let labels = $derived(getLabels(getPageLocale()));

  const getBadgeColor = (badge?: string) => {
    if (!badge) return '';
    if (badge.match(/^\d{4}$/)) return 'green'; // 2026, etc.
    return 'orange'; // Company names
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    if (date.length === 4) return date; // e.g. 2024
    return date.replace('-', '.') + ' ~';
  };
</script>

<div class="experience-list">
  {#each experiences as exp (exp.project[0].title)}
    {@const project = exp.project[0]}
    <div class="item">
      <div class="content">
        <div class="header">
          <h3 class="title">{project.title}</h3>
          {#if exp.titleBadge}
            <span class="badge {getBadgeColor(exp.titleBadge)}">{exp.titleBadge}</span>
          {/if}
        </div>
        <p class="description">{project.description}</p>

        {#if project.detailLink}
          <div class="link-wrapper">
            <a href={project.detailLink} class="detail-link" data-sveltekit-reload>
              {labels.viewProjectDetails} →
            </a>
          </div>
        {/if}

        {#if project.skills}
          <div class="tag-list">
            {#each project.skills as skill (skill)}
              <SkillChip {skill} />
            {/each}
          </div>
        {/if}
      </div>
      <div class="date-wrapper">
        <span class="date">{formatDate(project.dateFrom)}</span>
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

  .detail-link {
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    color: var(--color-primary);
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    margin-left: -0.5rem;
    border-radius: 4px;
    transition:
      background-color 0.2s,
      transform 0.2s;
  }

  .detail-link:hover {
    background-color: var(--color-primary-transparent);
    text-decoration: underline;
    transform: translateX(2px);
  }

  .badge {
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    line-height: 1;
    white-space: nowrap;
  }

  .badge.green {
    background: #e6f6eb;
    color: #008a2e;
  }

  .badge.orange {
    background: #fff0e6;
    color: #ff6b00;
  }

  :global(html.dark) .badge.green {
    background: #003d14;
    color: #34d399;
  }

  :global(html.dark) .badge.orange {
    background: #3d1c00;
    color: #fb923c;
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
