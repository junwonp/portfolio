<script lang="ts">
  import type { Component } from 'svelte';
  import { onMount,setContext } from 'svelte';

  import { browser } from '$app/environment';
  import Period from '$lib/components/Period.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import { getLabels } from '$lib/data/labels';
  import { getResumeData } from '$lib/data/resume';
  import type { PostMetadata } from '$lib/types/post';
  import { parseMarkdown } from '$lib/utils/markdown';

  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  // Propagate print mode to descendant components (e.g. ProjectAchievements)
  setContext('printMode', true);

  // Eagerly load all .svx modules at build time
  const allPosts = import.meta.glob<{ default: Component; metadata?: PostMetadata }>(
    '/src/lib/posts/*.svx',
    { eager: true },
  );

  const labels = $derived(getLabels(data.locale));
  const resumeData = $derived(getResumeData(data.locale));

  // Extract slug from detailLink e.g. '/projects/aira' → 'aira'
  function slugFromLink(link: string): string {
    return link.replace('/projects/', '');
  }

  // Get post module for a given slug + locale
  function getPost(slug: string) {
    const key = `/src/lib/posts/${slug}.${data.locale}.svx`;
    return allPosts[key];
  }

  // Ordered list of projects with detailLink (work → other → archives)
  const projectsWithDetails = $derived(
    (() => {
      const result: { slug: string; title: string }[] = [];
      for (const exp of resumeData.workExperiences) {
        for (const proj of exp.project) {
          if (proj.detailLink) {
            result.push({ slug: slugFromLink(proj.detailLink), title: proj.title });
          }
        }
      }
      for (const exp of resumeData.otherExperiences) {
        for (const proj of exp.project) {
          if (proj.detailLink) {
            result.push({ slug: slugFromLink(proj.detailLink), title: proj.title });
          }
        }
      }
      for (const arch of resumeData.archives) {
        for (const proj of arch.project) {
          if (proj.detailLink) {
            result.push({ slug: slugFromLink(proj.detailLink), title: proj.title });
          }
        }
      }
      return result;
    })(),
  );

  // Parse `**[Label]** content` lines used in project detail arrays
  function parseDetailLine(line: string): { label: string | null; content: string } {
    const match = line.match(/^\*\*\[(.*?)\]\*\*(.*)$/);
    if (match) return { label: match[1], content: match[2].trim() };
    return { label: null, content: line };
  }

  function handlePrint(): void {
    if (browser) window.print();
  }

  onMount(() => {
    // Force eager loading for all images in print mode
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      img.setAttribute('loading', 'eager');
    });

    // Wait for all images to be loaded
    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // Continue anyway on error
      });
    });

    void Promise.all(imagePromises).then(() => {
      // Small additional delay for fonts and complex layouts
      setTimeout(handlePrint, 1000);
    });
  });
</script>

<!-- Screen-only toolbar -->
<div class="print-toolbar">
  <span class="toolbar-name">{resumeData.introduction.name} — PDF Preview</span>
  <button class="print-trigger" onclick={handlePrint}>
    {data.locale === 'ko' ? '인쇄하기 / Print' : 'Print / 인쇄하기'}
  </button>
</div>

<main class="document">
  <!-- ① Cover Page -->
  <div class="cover-page">
    <div class="cover-content">
      <p class="cover-label">{labels.resumeTitle}</p>
      <h1 class="cover-name">{resumeData.introduction.name}</h1>
      <p class="cover-role">{resumeData.introduction.role}</p>
      <p class="cover-tagline">{resumeData.introduction.tagline}</p>
      <div class="cover-links">
        <a href={resumeData.introduction.githubLink} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <span class="cover-dot">·</span>
        <a href={resumeData.introduction.linkedinLink} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
    </div>
  </div>

  <!-- ② Table of Contents -->
  <section class="toc-page">
    <h2 class="toc-title">{labels.tocTitle}</h2>
    <div class="toc-group">
      <p class="toc-group-label">Resume</p>
      <ul class="toc-list">
        <li><a href="#section-work">{labels.sectionWork}</a></li>
        <li><a href="#section-skills">{labels.sectionSkills}</a></li>
        <li><a href="#section-awards">{labels.sectionAwards}</a></li>
        <li><a href="#section-archives">{labels.sectionArchives}</a></li>
        <li><a href="#section-education">{labels.sectionEducation}</a></li>
      </ul>
    </div>
    {#if projectsWithDetails.length > 0}
      <div class="toc-group">
        <p class="toc-group-label">{labels.tocProjectDetails}</p>
        <ul class="toc-list">
          {#each projectsWithDetails as { slug, title } (slug)}
            <li><a href="#project-{slug}">{title}</a></li>
          {/each}
        </ul>
      </div>
    {/if}
  </section>

  <!-- ③ Work Experience -->
  <section id="section-work" class="doc-section">
    <h2 class="section-title">{labels.sectionWork}</h2>
    {#each resumeData.workExperiences as exp (exp.companyName)}
      <div class="company-block">
        <div class="company-header-row">
          <span class="company-name">{exp.companyName}</span>
          <span class="date-range"><Period dateFrom={exp.dateFrom} dateTo={exp.dateTo} /></span>
        </div>
        <p class="company-role">{exp.role}</p>
        {#if exp.highlights && exp.highlights.length > 0}
          <ul class="highlights-list">
            {#each exp.highlights as h (h)}
              <li><RichText parts={parseMarkdown(h)} /></li>
            {/each}
          </ul>
        {/if}
        {#each exp.project as project (project.title)}
          <div class="project-block">
            <div class="project-header-row">
              {#if project.detailLink}
                <a class="project-title-link" href="#project-{slugFromLink(project.detailLink)}">
                  {project.title}
                </a>
              {:else}
                <span class="project-title">{project.title}</span>
              {/if}
              <span class="date-range"
                ><Period dateFrom={project.dateFrom} dateTo={project.dateTo} /></span
              >
            </div>
            <p class="project-desc">{project.description}</p>
            {#if project.detail.length > 0}
              <ul class="detail-list">
                {#each project.detail as line (line)}
                  {@const parsed = parseDetailLine(line)}
                  <li>
                    {#if parsed.label}<strong>[{parsed.label}]</strong>
                    {/if}<RichText parts={parseMarkdown(parsed.content)} />
                  </li>
                {/each}
              </ul>
            {/if}
            {#if project.skills && project.skills.length > 0}
              <p class="skill-line">{labels.techStack}: {project.skills.join(' · ')}</p>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </section>

  <hr class="divider" />

  <!-- ④ Skills -->
  <section id="section-skills" class="doc-section">
    <h2 class="section-title">{labels.sectionSkills}</h2>
    <div class="skills-table">
      {#each resumeData.skills as skill (skill.id)}
        <span class="skill-category">{skill.title}</span>
        <span class="skill-items">{skill.list.join(' · ')}</span>
      {/each}
    </div>
  </section>

  <hr class="divider" />

  <!-- ⑤ Awards & Projects (Other Experiences) -->
  <section id="section-awards" class="doc-section">
    <h2 class="section-title">{labels.sectionAwards}</h2>
    {#each resumeData.otherExperiences as exp, i (i)}
      {#each exp.project as project (project.title)}
        <div class="other-block">
          <div class="project-header-row">
            {#if project.detailLink}
              <a class="project-title-link" href="#project-{slugFromLink(project.detailLink)}">
                {project.title}
              </a>
            {:else}
              <span class="project-title">{project.title}</span>
            {/if}
            <span class="date-range"
              ><Period dateFrom={project.dateFrom} dateTo={project.dateTo} /></span
            >
          </div>
          <p class="project-desc">{project.description}</p>
          {#if project.detail.length > 0}
            <ul class="detail-list">
              {#each project.detail as line (line)}
                {@const parsed = parseDetailLine(line)}
                <li>
                  {#if parsed.label}<strong>[{parsed.label}]</strong>
                  {/if}<RichText parts={parseMarkdown(parsed.content)} />
                </li>
              {/each}
            </ul>
          {/if}
          {#if project.skills && project.skills.length > 0}
            <p class="skill-line">{labels.techStack}: {project.skills.join(' · ')}</p>
          {/if}
        </div>
      {/each}
    {/each}
  </section>

  <hr class="divider" />

  <!-- ⑥ Archives -->
  <section id="section-archives" class="doc-section">
    <h2 class="section-title">{labels.sectionArchives}</h2>
    {#each resumeData.archives as arch, i (i)}
      {#each arch.project as project (project.title)}
        <div class="other-block">
          <div class="project-header-row">
            {#if project.detailLink}
              <a class="project-title-link" href="#project-{slugFromLink(project.detailLink)}">
                {project.title}
              </a>
            {:else}
              <span class="project-title">{project.title}</span>
            {/if}
            <span class="date-range"
              ><Period dateFrom={project.dateFrom} dateTo={project.dateTo} /></span
            >
          </div>
          <p class="project-desc">{project.description}</p>
          {#if project.detail.length > 0}
            <ul class="detail-list">
              {#each project.detail as line (line)}
                {@const parsed = parseDetailLine(line)}
                <li>
                  {#if parsed.label}<strong>[{parsed.label}]</strong>
                  {/if}<RichText parts={parseMarkdown(parsed.content)} />
                </li>
              {/each}
            </ul>
          {/if}
          {#if project.skills && project.skills.length > 0}
            <p class="skill-line">{labels.techStack}: {project.skills.join(' · ')}</p>
          {/if}
        </div>
      {/each}
    {/each}
  </section>

  <hr class="divider" />

  <!-- ⑦ Education -->
  <section id="section-education" class="doc-section">
    <h2 class="section-title">{labels.sectionEducation}</h2>
    {#each resumeData.education as edu (edu.school)}
      <div class="edu-block">
        <div class="company-header-row">
          <span class="company-name">{edu.school}</span>
          <span class="date-range"><Period dateFrom={edu.dateFrom} dateTo={edu.dateTo} /></span>
        </div>
        {#if edu.major}
          <p class="company-role">{edu.major}</p>
        {/if}
      </div>
    {/each}
  </section>

  <!-- Intermediate Project TOC -->
  {#if projectsWithDetails.length > 0}
    <section class="doc-section project-index-section">
      <h2 class="section-title">{labels.tocProjectDetails}</h2>
      <ul class="toc-list">
        {#each projectsWithDetails as { slug, title } (slug)}
          <li><a href="#project-{slug}">{title}</a></li>
        {/each}
      </ul>
    </section>
    <hr class="divider" />
  {/if}

  <!-- ⑧ Project Detail Sections -->
  {#each projectsWithDetails as { slug } (slug)}
    {@const post = getPost(slug)}
    {#if post}
      {@const PostComponent = post.default}
      {@const meta = post.metadata}
      <section id="project-{slug}" class="project-detail-section">
        <div class="project-detail-header">
          <div>
            <h2 class="project-detail-title">{meta?.title ?? slug}</h2>
            {#if meta?.role}
              <p class="project-detail-role">{meta.role}</p>
            {/if}
          </div>
          {#if meta?.date}
            <span class="date-range">{meta.date}</span>
          {/if}
        </div>
        {#if meta?.description}
          <p class="project-detail-desc">{meta.description}</p>
        {/if}
        {#if meta?.techStack && meta.techStack.length > 0}
          <p class="skill-line">{labels.techStack}: {meta.techStack.join(' · ')}</p>
        {/if}
        {#if meta?.metrics && meta.metrics.length > 0}
          <div class="metrics-row">
            {#each meta.metrics as m (m.label)}
              <div class="metric-item">
                <span class="metric-value">{m.value}</span>
                <span class="metric-label">{m.label}</span>
              </div>
            {/each}
          </div>
        {/if}
        <hr class="divider" />
        <div class="project-content">
          <PostComponent metadata={meta} locale={data.locale} />
        </div>
      </section>
    {/if}
  {/each}
</main>

<style>
  /* ─── Print setup ─── */
  @page {
    size: A4;
    margin: 2cm;
  }

  /* ─── Screen wrapper ─── */
  :global(body) {
    margin: 0;
    padding: 0;
  }

  /* ─── Toolbar (screen only) ─── */
  .print-toolbar {
    align-items: center;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .toolbar-name {
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .print-trigger {
    background: #111827;
    border-radius: 6px;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.5rem 1.25rem;
    transition: opacity 0.15s;
  }

  .print-trigger:hover {
    opacity: 0.8;
  }

  /* ─── Document wrapper ─── */
  .document {
    background: white;
    color: #1a1a1a;
    font-family:
      'Apple SD Gothic Neo',
      'Noto Sans KR',
      system-ui,
      -apple-system,
      sans-serif;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 2rem auto;
    max-width: 794px;
    padding: 3rem 2.5rem;
  }

  @media screen {
    :global(html),
    :global(body) {
      background: #e5e7eb;
    }

    .document {
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
    }
  }

  @media print {
    .print-toolbar {
      display: none !important;
    }

    :global(body) {
      background: white !important;
    }

    .document {
      box-shadow: none;
      margin: 0;
      max-width: none;
      padding: 0;
    }

    .cover-page {
      break-after: page;
    }

    .toc-page {
      break-after: page;
    }

    .doc-section {
      break-before: auto;
    }

    .project-detail-section {
      break-before: page;
    }

    .company-block,
    .project-block,
    .other-block,
    .edu-block {
      break-inside: avoid;
    }

    .metrics-row {
      break-inside: avoid;
    }

    .skills-table {
      break-inside: avoid;
    }

    /* Force images to be visible even if transition hasn't finished */
    img,
    video,
    .media-wrapper {
      opacity: 1 !important;
      visibility: visible !important;
    }

    .skeleton {
      display: none !important;
    }
  }

  /* ─── Cover page ─── */
  .cover-page {
    align-items: center;
    display: flex;
    justify-content: center;
    min-height: 90vh;
    text-align: center;
  }

  @media print {
    .cover-page {
      min-height: 100svh;
    }
  }

  .cover-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .cover-label {
    color: #9ca3af;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    margin: 0 0 1rem;
    text-transform: uppercase;
  }

  .cover-name {
    color: #111827;
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin: 0;
  }

  .cover-role {
    color: #374151;
    font-size: 1.1rem;
    margin: 0;
  }

  .cover-tagline {
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0;
    max-width: 400px;
  }

  .cover-links {
    align-items: center;
    display: flex;
    font-size: 0.85rem;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .cover-links a {
    color: #374151;
    text-decoration: none;
  }

  .cover-links a:hover {
    text-decoration: underline;
  }

  .cover-dot {
    color: #9ca3af;
  }

  /* ─── TOC ─── */
  .toc-page {
    padding: 2rem 0;
  }

  .toc-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 2rem;
    margin-top: 0;
  }

  .toc-group {
    margin-bottom: 1.5rem;
  }

  .toc-group-label {
    color: #9ca3af;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    margin: 0 0 0.5rem;
    text-transform: uppercase;
  }

  .toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .toc-list li {
    border-bottom: 1px dotted #e5e7eb;
    padding: 0.3rem 0;
  }

  .toc-list li::before {
    display: none !important;
  }

  .toc-list a {
    color: #374151;
    font-size: 0.875rem;
    text-decoration: none;
  }

  .toc-list a:hover {
    text-decoration: underline;
  }

  /* ─── Section title (uppercase label) ─── */
  .doc-section {
    margin-top: 0.5rem;
  }

  .project-index-section {
    break-before: page;
    padding-top: 2rem;
  }

  .section-title {
    border-bottom: 2px solid #111827;
    color: #111827;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    margin-bottom: 1rem;
    margin-top: 0;
    padding-bottom: 0.4rem;
    text-transform: uppercase;
  }

  /* ─── Company block ─── */
  .company-block {
    margin-bottom: 1.5rem;
  }

  .company-header-row,
  .project-header-row {
    align-items: baseline;
    display: flex;
    justify-content: space-between;
  }

  .company-name {
    font-size: 1rem;
    font-weight: 700;
  }

  .company-role {
    color: #4b5563;
    font-size: 0.85rem;
    margin: 0.1rem 0 0.5rem;
  }

  .highlights-list {
    color: #4b5563;
    font-size: 0.85rem;
    margin: 0.25rem 0 0.5rem 1.25rem;
    padding: 0;
  }

  .highlights-list li {
    margin-bottom: 0.15rem;
  }

  .date-range {
    color: #9ca3af;
    font-size: 0.8rem;
    margin-left: 1rem;
    white-space: nowrap;
  }

  /* ─── Project block ─── */
  .project-block {
    margin-bottom: 1rem;
    margin-left: 1rem;
  }

  .other-block {
    margin-bottom: 1rem;
  }

  .project-title {
    color: #222;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .project-title-link {
    color: #222;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
  }

  .project-title-link:hover {
    text-decoration: underline;
  }

  .project-desc {
    color: #4b5563;
    font-size: 0.85rem;
    margin: 0.2rem 0 0.4rem;
  }

  /* ─── Detail list ─── */
  .detail-list {
    margin: 0.4rem 0 0.4rem 1.25rem;
    padding: 0;
  }

  .detail-list li {
    color: #374151;
    font-size: 0.85rem;
    margin-bottom: 0.2rem;
  }

  .skill-line {
    color: #6b7280;
    font-size: 0.8rem;
    margin-top: 0.4rem;
  }

  /* ─── Skills table ─── */
  .skills-table {
    display: grid;
    gap: 0.5rem 1rem;
    grid-template-columns: 140px 1fr;
  }

  .skill-category {
    color: #374151;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .skill-items {
    color: #4b5563;
    font-size: 0.85rem;
  }

  /* ─── Education block ─── */
  .edu-block {
    margin-bottom: 1rem;
  }

  /* ─── Divider ─── */
  .divider {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 1.25rem 0;
  }

  /* ─── Project detail sections ─── */
  .project-detail-section {
    padding-top: 1rem;
  }

  .project-detail-header {
    align-items: flex-start;
    display: flex;
    justify-content: space-between;
  }

  .project-detail-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  .project-detail-role {
    color: #6b7280;
    font-size: 0.85rem;
    margin: 0.25rem 0 0;
  }

  .project-detail-desc {
    color: #4b5563;
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0.75rem 0 0.5rem;
  }

  /* ─── Metrics ─── */
  .metrics-row {
    display: flex;
    gap: 2rem;
    margin: 0.75rem 0;
  }

  .metric-item {
    text-align: center;
  }

  .metric-value {
    color: #111827;
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .metric-label {
    color: #6b7280;
    font-size: 0.75rem;
  }

  /* ─── Project svx content — neutralize web-specific component styles ─── */
  .project-content :global(.bento-card),
  .project-content :global([class*='card']) {
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  .project-content :global([class*='chip']),
  .project-content :global([class*='badge']),
  .project-content :global([class*='tag']) {
    background: transparent !important;
    border: 1px solid #d1d5db !important;
    border-radius: 5px !important;
    font-size: 0.8rem !important;
  }

  .project-content :global(h2) {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 1.25rem 0 0.5rem;
  }

  .project-content :global(h3) {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0.75rem 0 0.25rem;
  }

  .project-content :global(p) {
    font-size: 0.875rem;
    line-height: 1.65;
    margin: 0.4rem 0;
  }

  .project-content :global(ul),
  .project-content :global(ol) {
    font-size: 0.875rem;
    margin: 0.25rem 0 0.5rem 1.25rem;
  }

  .project-content :global(li) {
    line-height: 1.6;
    margin: 0.2rem 0;
  }

  .project-content :global(strong) {
    font-weight: 600;
  }

  .project-content :global(code) {
    background: #f3f4f6;
    border-radius: 3px;
    font-family: ui-monospace, 'Cascadia Code', monospace;
    font-size: 0.8rem;
    padding: 1px 4px;
  }

  .project-content :global(pre) {
    background: #f3f4f6;
    border-radius: 6px;
    font-size: 0.8rem;
    line-height: 1.6;
    overflow-x: auto;
    padding: 1rem 1.25rem;
  }

  .project-content :global(pre code) {
    background: transparent;
    padding: 0;
  }

  .project-content :global(blockquote) {
    border-left: 3px solid #d1d5db;
    color: #6b7280;
    font-size: 0.85rem;
    margin: 0.75rem 0;
    padding: 0.5rem 0.75rem;
  }

  .project-content :global(hr) {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 1rem 0;
  }

  /* image-gallery / image-description / lightbox-masonry: static flex layout for print */
  .project-content :global(.image-gallery),
  .project-content :global(.lightbox-masonry) {
    columns: auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 2rem !important;
    margin: 2rem 0 !important;
  }

  .project-content :global(.image-gallery figure),
  .project-content :global(.masonry-item) {
    break-inside: avoid !important;
    max-width: 100% !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .project-content :global(.image-description img),
  .project-content :global(.masonry-item img) {
    display: block !important;
    height: auto !important;
    max-height: 320px !important;
    max-width: 100% !important;
    width: auto !important;
    object-fit: contain !important;
    border-radius: 8px !important;
    border: 1px solid #e5e7eb !important;
  }

  /* Show captions for Lightbox images in print */
  .project-content :global(.masonry-item::after) {
    content: attr(aria-label);
    display: block;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: #6b7280;
    text-align: center;
  }

  /* Hide specific UI hints in print */
  .project-content :global(.zoom-hint),
  .project-content :global(.more-indicator) {
    display: none !important;
  }

  .project-content :global(.image-description figcaption) {
    color: #6b7280;
    display: block !important;
    font-size: 0.85rem;
    margin-top: 0.5rem !important;
    text-align: center !important;
  }

  /* ─── Hide interactive / media elements in print ─── */
  .project-content :global(video),
  .project-content :global(audio),
  .project-content :global(.overlay) {
    display: none !important;
  }

  /* Hide ImageDescription if it contains a video and no image */
  .project-content :global(.image-description:not(:has(img))) {
    display: none !important;
  }

  /* Hide ImageGallery if it has no images */
  .project-content :global(.image-gallery:not(:has(img))) {
    display: none !important;
  }

  /* Robust hiding of headers that precede video-only sections */
  /* Handles cases with or without an intermediate empty paragraph */
  .project-content :global(h1:has(+ .image-gallery:not(:has(img)))),
  .project-content :global(h1:has(+ p + .image-gallery:not(:has(img)))),
  .project-content :global(h1:has(+ .image-description:not(:has(img)))),
  .project-content :global(h1:has(+ p + .image-description:not(:has(img)))),
  .project-content :global(h2:has(+ .image-gallery:not(:has(img)))),
  .project-content :global(h2:has(+ p + .image-gallery:not(:has(img)))),
  .project-content :global(h2:has(+ .image-description:not(:has(img)))),
  .project-content :global(h2:has(+ p + .image-description:not(:has(img)))),
  .project-content :global(h3:has(+ .image-gallery:not(:has(img)))),
  .project-content :global(h3:has(+ p + .image-gallery:not(:has(img)))),
  .project-content :global(h3:has(+ .image-description:not(:has(img)))),
  .project-content :global(h3:has(+ p + .image-description:not(:has(img)))) {
    display: none !important;
  }

  /* Hide paragraphs that immediately precede a hidden video gallery/description */
  .project-content :global(p:has(+ .image-gallery:not(:has(img)))),
  .project-content :global(p:has(+ .image-description:not(:has(img)))) {
    display: none !important;
  }

  /* ─── ProjectAchievements: flatten card chrome for print ─── */
  .project-content :global(.achievements) {
    gap: 4px !important;
    margin-bottom: 8px !important;
  }

  .project-content :global(.ach-card) {
    border: none !important;
    border-bottom: 1px solid #e5e7eb !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    break-inside: avoid;
  }

  .project-content :global(.ach-header) {
    cursor: default !important;
    padding: 6px 0 !important;
  }

  .project-content :global(.ach-chevron) {
    display: none !important;
  }

  .project-content :global(.ach-body) {
    padding: 0 0 8px !important;
  }

  /* ─── SkillChip: neutralize category colors ─── */
  .project-content :global(.skill-chip) {
    background: transparent !important;
    border: 1px solid #d1d5db !important;
    border-radius: 5px !important;
    color: #374151 !important;
  }

  .project-content :global(.tech-category-grid) {
    break-inside: avoid;
    display: block;
  }

  /* Render tech categories as "Category: skill1, skill2" plain text */
  .project-content :global(.tech-category) {
    display: block;
    margin: 0.2rem 0;
  }

  .project-content :global(.category-title) {
    display: inline;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .project-content :global(.category-title::after) {
    content: ': ';
  }

  .project-content :global(.tech-grid) {
    display: inline;
    white-space: normal;
  }

  /* Override .skill-chip to inline plain text */
  .project-content :global(.tech-grid .skill-chip) {
    background: none !important;
    border: none !important;
    border-radius: 0 !important;
    color: #374151 !important;
    display: inline !important;
    font-size: 0.8rem !important;
    padding: 0 !important;
  }

  .project-content :global(.tech-grid .skill-chip::after) {
    content: ', ';
  }

  .project-content :global(.tech-grid .skill-chip:last-child::after) {
    content: '';
  }
</style>
