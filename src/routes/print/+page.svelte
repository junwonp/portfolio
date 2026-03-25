<script lang="ts">
  import { page } from '$app/state';
  import PrintIcon from '$lib/components/Icon/Print.svelte';
  import ProjectList from '$lib/components/ProjectList.svelte';
  import Row from '$lib/components/Row.svelte';
  import SideList from '$lib/components/SideList.svelte';
  import Title from '$lib/components/Title.svelte';
  import { getLabels } from '$lib/data/labels';
  import { getResumeData } from '$lib/data/resume';

  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const labels = $derived(getLabels(data.locale));
  const resumeData = $derived(getResumeData(data.locale));

  const baseUrl = $derived(page.url.origin);

  $effect(() => {
    if (page.url.searchParams.get('auto') === '1') {
      window.print();
    }
  });
  const postSlugs = $derived(new Set(data.posts.map((p) => p.slug)));

  const toAnchor = (detailLink?: string): string | undefined => {
    if (!detailLink) return undefined;
    const slug = detailLink.replace('/projects/', '');
    return postSlugs.has(slug) ? `#project-${slug}` : undefined;
  };

  const printResumeData = $derived({
    ...resumeData,
    workExperiences: resumeData.workExperiences.map((exp) => ({
      ...exp,
      project: exp.project.map((p) => ({ ...p, detailLink: toAnchor(p.detailLink) })),
    })),
    otherExperiences: resumeData.otherExperiences.map((exp) => ({
      ...exp,
      project: exp.project.map((p) => ({ ...p, detailLink: toAnchor(p.detailLink) })),
    })),
  });
</script>

<svelte:head>
  <title>{printResumeData.introduction.name} | {labels.resumeTitle}</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="author" content={printResumeData.introduction.name} />
  <meta
    name="description"
    content="{printResumeData.introduction.role} — {printResumeData.introduction.tagline}"
  />
  <meta name="subject" content={labels.resumeTitle} />
  <meta property="og:title" content="{printResumeData.introduction.name} | {labels.resumeTitle}" />
</svelte:head>

<div class="print-controls">
  <a href="/">{labels.goBack}</a>
  <button
    onclick={() => {
      window.print();
    }}
    aria-label="Print"
    title="Print"
  >
    <PrintIcon />
  </button>
</div>

<div class="toc-wrapper">
  <nav class="toc" aria-label={labels.tocTitle}>
    <h2 class="toc-title">{labels.tocTitle}</h2>
    <ul class="toc-list">
      <li><a href="#section-intro">{labels.sectionIntro}</a></li>
      <li><a href="#section-work">{labels.sectionWork}</a></li>
      <li><a href="#section-skills">{labels.sectionSkills}</a></li>
      <li><a href="#section-awards">{labels.sectionAwards}</a></li>
      <li><a href="#section-education">{labels.sectionEducation}</a></li>
      <li><a href="#section-archives">{labels.sectionArchives}</a></li>
    </ul>
    {#if data.posts.length > 0}
      <h3 class="toc-sub-title">{labels.tocProjectDetails}</h3>
      <ul class="toc-list toc-projects">
        {#each data.posts as post (post.slug)}
          <li><a href="#project-{post.slug}">{post.metadata.title ?? post.slug}</a></li>
        {/each}
      </ul>
    {/if}
  </nav>

  {#if data.posts.length > 0}
    <div class="preview">
      <h2 class="preview-title">{labels.printPreview}</h2>
      <a href={baseUrl} class="portfolio-url" target="_blank" rel="noopener noreferrer">
        {baseUrl}
      </a>
      {#each data.posts as post (post.slug)}
        <div class="preview-item">
          <h3 class="preview-project-title">{post.metadata.title ?? post.slug}</h3>
          {#if post.metadata.description}
            <p class="preview-description">{post.metadata.description}</p>
          {/if}
          <a
            href="{baseUrl}/projects/{post.slug}"
            class="preview-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {baseUrl}/projects/{post.slug}
          </a>
        </div>
      {/each}
    </div>
  {/if}
</div>

<article id="section-intro">
  <Title
    name={printResumeData.introduction.name}
    role={printResumeData.introduction.role}
    tagline={printResumeData.introduction.tagline}
    githubLink={printResumeData.introduction.githubLink}
    linkedinLink={printResumeData.introduction.linkedinLink}
  />

  <div class="content-wrapper">
    <div>
      {#each printResumeData.introduction.briefing as line, index (index)}
        <p>{line}</p>
      {/each}
    </div>

    <h2 id="section-work">{labels.sectionWork}</h2>
    {#each printResumeData.workExperiences as experience, experienceIndex (experienceIndex)}
      <Row
        companyName={experience.companyName}
        role={experience.role}
        dateFrom={experience.dateFrom}
        dateTo={experience.dateTo}
      >
        {#snippet additional()}
          {#if experience.additional}
            <a
              href={experience.additional.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={experience.additional.label}
              title={experience.additional.label}
            >
              {experience.additional.label}
            </a>
          {/if}
        {/snippet}
        <ProjectList projects={experience.project} bold />
      </Row>
      {#if experienceIndex < printResumeData.workExperiences.length - 1}
        <hr class="row-divider" aria-hidden="true" />
      {/if}
    {/each}

    <h2 id="section-skills">{labels.sectionSkills}</h2>
    <div class="skills-wrapper">
      {#each printResumeData.skills as skill (skill.title)}
        <SideList title={skill.title} list={skill.list} />
      {/each}
    </div>

    <h2 id="section-awards">{labels.sectionAwards}</h2>
    {#each printResumeData.otherExperiences as experience, experienceIndex (experienceIndex)}
      {#if experience.companyName && experience.dateFrom && experience.role}
        <Row
          companyName={experience.companyName}
          dateFrom={experience.dateFrom}
          role={experience.role}
        >
          <ProjectList projects={experience.project} />
        </Row>
        {#if experienceIndex < printResumeData.otherExperiences.length - 1}
          <hr class="row-divider" aria-hidden="true" />
        {/if}
      {:else}
        <ProjectList projects={experience.project} other />
        {#if experienceIndex < printResumeData.otherExperiences.length - 1}
          <hr class="row-divider" aria-hidden="true" />
        {/if}
      {/if}
    {/each}

    <h2 id="section-education">{labels.sectionEducation}</h2>
    {#each printResumeData.education as education (education.school)}
      <Row {...education} companyName={education.school} role={education.major ?? ''} />
    {/each}

    <h2 id="section-archives">{labels.sectionArchives}</h2>
    {#each printResumeData.archives as archive, archiveIndex (archiveIndex)}
      <ProjectList projects={archive.project} other />
      {#if archiveIndex < printResumeData.archives.length - 1}
        <hr class="row-divider" aria-hidden="true" />
      {/if}
    {/each}
  </div>
</article>

{#each data.posts as post (post.slug)}
  {@const PostComponent = post.component}
  <section class="project-section" id="project-{post.slug}">
    <Title
      name={post.metadata.title ?? post.slug}
      role={post.metadata.role ?? ''}
      tagline={post.metadata.description ?? ''}
      githubLink={post.metadata.githubLink ?? ''}
      productLink={post.metadata.productLink ?? ''}
    />
    <article class="project-content">
      <PostComponent />
    </article>
  </section>
{/each}

<style>
  .print-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-md);
  }

  .print-controls button {
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    padding: var(--space-sm);
  }

  .toc-wrapper {
    display: flex;
    gap: var(--space-lg);
    margin-bottom: var(--space-lg);
  }

  .toc {
    border: 1px solid var(--color-bg-divider);
    border-radius: 8px;
    flex-shrink: 0;
    padding: var(--space-md);
    width: 220px;
  }

  .preview {
    border: 1px solid var(--color-bg-divider);
    border-radius: 8px;
    flex: 1;
    overflow: hidden;
    padding: var(--space-md);
  }

  .preview-title {
    font-size: 1.25rem;
    margin: 0 0 var(--space-sm) 0;
  }

  .preview-item {
    border-top: 1px solid var(--color-bg-divider);
    padding: var(--space-xs) 0;
  }

  .preview-item:first-of-type {
    border-top: none;
    padding-top: 0;
  }

  .preview-project-title {
    font-size: 0.95rem;
    margin: 0 0 0.25rem 0;
  }

  .preview-description {
    color: var(--color-sub);
    font-size: 0.85rem;
    margin: 0 0 0.25rem 0;
  }

  .preview-link {
    font-size: 0.8rem;
    overflow-wrap: break-word;
    word-break: break-all;
  }

  .toc-title {
    font-size: 1.25rem;
    margin: 0 0 var(--space-sm) 0;
  }

  .toc-sub-title {
    font-size: 1rem;
    margin: var(--space-sm) 0 var(--space-xs) 0;
  }

  .toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .toc-list li {
    padding: 0.2rem 0;
  }

  .toc-list li::before {
    display: none;
  }

  .toc-projects li {
    padding-left: var(--space-sm);
  }

  .portfolio-url {
    display: inline-block;
    font-size: 0.9rem;
    margin-bottom: var(--space-sm);
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
  }

  .skills-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    word-break: break-word;
  }

  .row-divider {
    background-color: var(--color-bg-divider);
    border: none;
    height: 1px;
    margin: 3rem 0;
    width: 100%;
  }

  .project-section {
    border-top: 2px solid var(--color-bg-divider);
    margin-top: var(--space-xl);
    padding-top: var(--space-xl);
  }

  @media (max-width: 960px) {
    .skills-wrapper {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media print {
    .print-controls {
      display: none;
    }

    /* TOC wrapper takes its own page */
    .toc-wrapper {
      break-after: page;
      margin: 0;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    .toc {
      width: auto;
    }

    .preview {
      overflow: visible;
    }

    .toc-title,
    .preview-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      margin-top: 0;
    }

    .toc-list li {
      line-height: 2;
    }

    .project-section {
      border-top: none;
      margin-top: 0;
      padding-top: 0;
      break-before: page;
    }

    .skills-wrapper {
      grid-template-columns: repeat(4, 1fr);
    }

    .row-divider {
      margin: 0.75rem 0;
    }

    /* compress h2 section spacing — default 6rem is too large for print */
    :global(h2) {
      break-after: avoid;
      margin-bottom: 0.5rem !important;
      margin-top: 1.5rem !important;
    }

    :global(h2 + *) {
      break-before: avoid;
    }

    :global(h3) {
      break-after: avoid;
    }

    /* keep each figure (image + caption) together */
    :global(figure) {
      break-inside: avoid;
    }

    /* cap image height — !important overrides component-scoped styles */
    :global(img) {
      max-height: 60mm !important;
      width: auto !important;
    }

    :global(footer) {
      display: none !important;
    }
  }
</style>
