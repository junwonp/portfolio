<script lang="ts">
  import type { Snippet } from 'svelte';

  import Github from '$lib/components/Icon/Github.svelte';
  import Period from '$lib/components/Period.svelte';
  import { getLabels } from '$lib/data/labels';
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
  }
  const {
    children,
    dateFrom,
    dateTo,
    description,
    detailLink,
    githubLink,
    other = false,
    skills,
    title,
  }: Props = $props();

  const labels = $derived(getLabels(getPageLocale()));
</script>

<div class="block" class:other>
  <header class="header">
    <div class="title">
      <h3 class="project-title">
        {title}
        {#if detailLink}
          <a
            href={detailLink}
            class="detail-link"
            aria-label={labels.viewProjectDetails}
            title={labels.viewProjectDetails}
            data-sveltekit-reload
          >
            {labels.viewProjectDetails} →
          </a>
        {/if}
      </h3>

      {#if githubLink}
        <a
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
    <Period {dateFrom} {dateTo} />
  </header>

  {#if !other}
    <h4>{labels.description}</h4>
  {/if}
  <p class:description-text={!children}>
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
      {#each skills as s (s)}
        <li class={`skill-chip ${other ? 'other' : ''}`}>{s}</li>
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
  }

  .title {
    display: flex;
    flex: 1;
    justify-content: space-between;
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

  .skill-chip {
    background-color: var(--color-inline-bg);
    border-radius: 0.5rem;
    color: var(--color-main);
    display: inline-block;
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
    position: relative;
  }

  .other .skill-chip {
    font-size: 0.8rem;
    padding: 0.2rem 0.4rem;
  }

  .skill-chip:before {
    display: none;
  }

  .project-title {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: var(--space-xs);
    margin-top: 0;
  }

  .detail-link {
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
  }

  .detail-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 960px) {
    .project-title {
      font-size: 1.2rem;
    }
  }

  @media (max-width: 576px) {
    .project-title {
      font-size: 1.1rem;
    }
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

  @media print {
    .block {
      break-inside: avoid;
    }

    .skill-chip {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
