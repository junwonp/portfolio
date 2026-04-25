<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity';
  import { slide } from 'svelte/transition';
  import { ChevronDown } from 'lucide-svelte';

  import ArrowLink from '$lib/components/ArrowLink.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Period from '$lib/components/Period.svelte';
  import SkillChip from '$lib/components/SkillChip.svelte';
  import { getLabels } from '$lib/data/labels';
  import { skillState } from '$lib/states/skills.svelte';
  import type { ProjectItem, WorkExperienceProps } from '$lib/types/about';
  import type { Language } from '$lib/utils/language';
  import { parseMarkdownBold } from '$lib/utils/markdown';

  interface Props {
    experiences: WorkExperienceProps[];
    locale: Language;
  }

  let { experiences, locale }: Props = $props();

  let labels = $derived(getLabels(locale));

  // Level 1: which companies have project list expanded
  let openCompanies = new SvelteSet<string>();

  // Level 2: which projects have details expanded (key: "companyName::projectTitle")
  let openProjects = new SvelteSet<string>();

  function toggleCompany(name: string): void {
    if (openCompanies.has(name)) {
      openCompanies.delete(name);
    } else {
      openCompanies.add(name);
    }
  }

  function toggleProject(company: string, project: ProjectItem): void {
    const key = `${company}::${project.title}`;
    if (openProjects.has(key)) {
      openProjects.delete(key);
    } else {
      openProjects.add(key);
    }
  }

  function isProjectOpen(company: string, project: ProjectItem): boolean {
    return openProjects.has(`${company}::${project.title}`);
  }

  function parseDetailLine(line: string) {
    const match = line.match(/^\*\*\[(.*?)\]\*\*(.*)$/);
    if (match) {
      return { label: match[1], content: match[2].trim() };
    }
    return { label: null, content: line };
  }

  let isFiltered = $derived(!skillState.isEmpty);
</script>

<div class="accordion">
  {#each experiences as exp (exp.companyName)}
    <div class="company-wrapper" transition:slide={{ duration: 300 }}>
      <div class={['company-card', (openCompanies.has(exp.companyName) || isFiltered) && 'open']}>
        <!-- Company header -->
        <div
          class="company-header"
          role="button"
          tabindex="0"
          onclick={() => {
            if (!isFiltered) toggleCompany(exp.companyName);
          }}
          onkeydown={(e) => {
            if (!isFiltered && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              toggleCompany(exp.companyName);
            }
          }}
          aria-expanded={openCompanies.has(exp.companyName) || isFiltered}
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
                (openCompanies.has(exp.companyName) || isFiltered) && 'open',
              ]}
            >
              <span
                >{openCompanies.has(exp.companyName) || isFiltered
                  ? labels.hideDetails
                  : labels.showDetails}</span
              >
              <ChevronDown
                size={20}
                strokeWidth={2}
                class={`chevron-icon ${openCompanies.has(exp.companyName) || isFiltered ? 'open' : ''}`}
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
                    {#each parseMarkdownBold(item) as part, k (k)}
                      {#if part.type === 'bold'}
                        <strong>{part.text}</strong>
                      {:else if part.type === 'code'}
                        <code>{part.text}</code>
                      {:else}
                        {part.text}
                      {/if}
                    {/each}
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
        {#if openCompanies.has(exp.companyName) || isFiltered}
          <div class="project-list" transition:slide={{ duration: 250 }}>
            {#each exp.project as project (project.title)}
              {@const isOpen = isProjectOpen(exp.companyName, project) || isFiltered}
              <div
                class={['project-item', isOpen && 'is-open']}
                transition:slide={{ duration: 200 }}
              >
                <!-- Project row header -->
                <button
                  class="project-header"
                  onclick={() => {
                    if (!isFiltered) toggleProject(exp.companyName, project);
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
                        <span class="main-skills"
                          >{skillState.sort(project.skills).slice(0, 2).join(', ')}</span
                        >
                      {/if}
                    </div>
                  </div>
                  <div class="project-header-right">
                    <span class="project-period pc-only">
                      <Period dateFrom={project.dateFrom} dateTo={project.dateTo} />
                    </span>
                    <ChevronDown
                      size={20}
                      strokeWidth={2}
                      class={`project-chevron ${isOpen ? 'open' : ''}`}
                    />
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
                              {#each parseMarkdownBold(parsed.content) as part, k (k)}
                                {#if part.type === 'bold'}
                                  <strong>{part.text}</strong>
                                {:else if part.type === 'code'}
                                  <code>{part.text}</code>
                                {:else}
                                  {part.text}
                                {/if}
                              {/each}
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
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .accordion {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .company-wrapper {
    display: flex;
    flex-direction: column;
  }

  /* ── Company Card ── */

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

  :global(.chevron-icon),
  :global(.project-chevron) {
    transition: transform 0.2s;
    flex-shrink: 0;
    color: var(--color-sub);
  }

  :global(.expand-indicator.open .chevron-icon),
  :global(.project-chevron.open),
  .project-header:hover :global(.project-chevron) {
    transform: rotate(180deg);
    color: var(--color-primary);
  }

  /* ── Highlights ── */

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

  /* ── Project List ── */

  .project-list {
    background: var(--color-basic-bg);
    border: 1px solid var(--color-bg-divider);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    overflow: hidden;
  }

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

  /* ── Project Content ── */

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
