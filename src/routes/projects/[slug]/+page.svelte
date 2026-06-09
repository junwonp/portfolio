<script lang="ts">
  import { browser } from '$app/environment';
  import Badge from '$lib/components/Badge.svelte';
  import Github from '$lib/components/Icon/Github.svelte';
  import Globe from '$lib/components/Icon/Globe.svelte';
  import ProjectToc from '$lib/components/ProjectToc.svelte';
  import { getLabels } from '$lib/data/labels';
  import { projectNavLinks } from '$lib/stores/bottomNav';
  import { parseHeading } from '$lib/utils/markdown';

  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let { component: Component, metadata, slug, locale } = $derived(data);
  let labels = $derived(getLabels(locale));
  let metricColumnCount = $derived(Math.min(metadata.metrics?.length ?? 1, 4));

  let githubHref = $derived(
    metadata.githubLink
      ? metadata.githubLink.startsWith('http')
        ? metadata.githubLink
        : `https://github.com/${metadata.githubLink}`
      : '',
  );

  $effect(() => {
    projectNavLinks.set({ githubLink: metadata.githubLink, productLink: metadata.productLink });
    return () => {
      projectNavLinks.set(null);
    };
  });

  // Transform headings to split subtitles
  $effect(() => {
    if (!browser) return;
    const headings = document.querySelectorAll<HTMLElement>('.project-article h2');
    headings.forEach((h2) => {
      // Avoid double transformation
      if (h2.getAttribute('data-transformed')) return;

      const originalText = h2.textContent || '';
      const { emoji, main, sub } = parseHeading(originalText);

      if (sub) {
        const hiddenColon = document.createElement('span');
        const subtitle = document.createElement('span');

        hiddenColon.className = 'visually-hidden-colon';
        hiddenColon.textContent = ':';
        subtitle.className = 'h2-subtitle';
        subtitle.textContent = sub;

        h2.replaceChildren(`${emoji} ${main}`, hiddenColon, subtitle);
      }
      h2.setAttribute('data-transformed', 'true');
    });
  });
</script>

<svelte:head>
  <title>{`${metadata.title || slug} | ${labels.project}`}</title>
  {#if metadata.description}
    <meta name="description" content={metadata.description} />
    <meta property="og:description" content={metadata.description} />
    <meta name="twitter:description" content={metadata.description} />
  {/if}
  <meta property="og:title" content={`${metadata.title || slug} | ${labels.project}`} />
  {#if metadata.image}
    <meta property="og:image" content={metadata.image} />
    <meta name="twitter:image" content={metadata.image} />
  {/if}
</svelte:head>

<div id="intro-header-sentinel"></div>

<!-- Desktop-only sticky header with back link and project links -->
<header class="project-topbar">
  <a class="topbar-back" href="/">← {labels.resumeTitle}</a>
  <div class="topbar-crumb">
    <span>{labels.authorName}</span>
    <span class="crumb-sep">/</span>
    <span class="crumb-current">{metadata.title || slug}</span>
  </div>
  <div class="topbar-links">
    {#if githubHref}
      <a
        class="topbar-link"
        href={githubHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        <Github width="15" height="15" />
        GitHub
      </a>
    {/if}
    {#if metadata.productLink}
      <a
        class="topbar-link primary"
        href={metadata.productLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Globe width="15" height="15" />
        {labels.visitSite}
      </a>
    {/if}
  </div>
</header>

<div class="layout">
  <div class="nav-wrapper">
    <ProjectToc />
  </div>

  <div class="main-content">
    <div class="content">
      <!-- Hero -->
      <div class="hero">
        <div class="hero-meta">
          {#if metadata.role}
            <Badge text={metadata.role} color="primary" />
          {/if}
          {#if metadata.status}
            <Badge text={metadata.status} color="green" />
          {/if}
          {#if metadata.date}
            <Badge text={metadata.date} color="sub" />
          {/if}
        </div>

        <h1 class="hero-title">{metadata.title || slug}</h1>

        {#if metadata.tagline}
          <p class="hero-tagline">{metadata.tagline}</p>
        {:else if metadata.description}
          <p class="hero-tagline">{metadata.description}</p>
        {/if}

        {#if metadata.metrics && metadata.metrics.length > 0}
          <dl
            class="metrics-row"
            class:has-four-metrics={metricColumnCount === 4}
            style:--metric-count={metricColumnCount}
          >
            {#each metadata.metrics as metric (metric.label)}
              <div class="metric">
                <dt class="metric-lbl">{metric.label}</dt>
                <dd class="metric-val">{metric.value}</dd>
              </div>
            {/each}
          </dl>
        {/if}

        {#if metadata.platforms && metadata.platforms.length > 0}
          <div class="platforms">
            {#each metadata.platforms as platform (platform)}
              <Badge text={platform} />
            {/each}
          </div>
        {/if}
      </div>

      <!-- MDX content -->
      <article class="project-article">
        {#if Component}
          <Component {metadata} {locale} />
        {:else}
          <p class="error-msg">{labels.contentLoadError}</p>
        {/if}
      </article>
    </div>
  </div>
</div>

<style>
  /* Desktop-only sticky header (iOS UINavigationBar Style with Gradient Blur) */
  .project-topbar {
    position: sticky;
    top: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 24px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.95) 45%,
      rgba(255, 255, 255, 0.7) 75%,
      transparent
    );
    :global(html.dark) & {
      background: linear-gradient(
        to bottom,
        rgba(28, 28, 30, 0.95) 45%,
        rgba(28, 28, 30, 0.7) 75%,
        transparent
      );
    }
    backdrop-filter: saturate(190%) blur(20px);
    -webkit-backdrop-filter: saturate(190%) blur(20px);
    border-bottom: none;
  }

  .topbar-back {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-primary); /* iOS System Blue */
    text-decoration: none;
    white-space: nowrap;
    background-color: color-mix(in srgb, var(--color-surface-hover) 80%, transparent);
    backdrop-filter: saturate(140%) blur(12px);
    -webkit-backdrop-filter: saturate(140%) blur(12px);
    border: 1px solid color-mix(in srgb, var(--color-primary) 8%, transparent);
    border-radius: 9999px;
    height: 32px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    gap: 2px;
    transition:
      background-color 0.15s,
      color 0.15s,
      transform 0.1s;
    z-index: 1;
  }

  .topbar-back:hover {
    background-color: var(--color-disabled-bg);
  }

  .topbar-back:active {
    transform: scale(0.94);
  }

  .topbar-crumb {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9375rem; /* iOS Navigation Title size */
    color: var(--color-sub);
    white-space: nowrap;
    pointer-events: none;
    background: transparent;
    border: none;
    height: auto;
    padding: 0;
  }

  .crumb-sep {
    opacity: 0.3;
    color: var(--color-sub);
  }

  .crumb-current {
    color: var(--color-bold);
    font-weight: 600;
  }

  .topbar-links {
    margin-left: auto;
    display: flex;
    gap: 4px;
    align-items: center;
    z-index: 1;
  }

  .topbar-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    color: var(--color-primary);
    text-decoration: none;
    height: 32px;
    padding: 0 12px;
    border: 1px solid color-mix(in srgb, var(--color-primary) 8%, transparent);
    background-color: color-mix(in srgb, var(--color-surface-hover) 80%, transparent);
    backdrop-filter: saturate(140%) blur(12px);
    -webkit-backdrop-filter: saturate(140%) blur(12px);
    border-radius: 9999px;
    white-space: nowrap;
    transition:
      background-color 0.15s,
      color 0.15s,
      transform 0.1s;
  }

  .topbar-link:hover {
    background-color: var(--color-disabled-bg);
  }

  .topbar-link:active {
    transform: scale(0.94);
  }

  .topbar-link.primary {
    background: var(--color-primary);
    color: #fff !important;
    border-radius: 9999px; /* Visit Site is kept as a primary filled pill */
    padding: 6px 14px;
    opacity: 1;
  }

  .topbar-link.primary:hover {
    background: var(--color-primary-hover);
    opacity: 0.95;
  }

  .topbar-link.primary:active {
    transform: scale(0.96);
    opacity: 0.8;
  }

  /* Hide desktop header on mobile — BottomNav handles navigation there */
  @media (max-width: 960px) {
    .project-topbar {
      display: none;
    }
  }

  /* Content layout */
  .layout {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 0 clamp(0px, 4vw, 48px) 120px; /* Use 0px as minimum since parent has padding */
    margin-top: var(--space-md);
  }

  .nav-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    right: calc(100% + var(--space-md));
    width: 160px;
  }

  .main-content {
    min-width: 0;
    width: 100%;
    max-width: 800px;
    transition: all 0.3s ease;
  }

  /* Handle overlap on intermediate screens */
  @media (max-width: 1400px) {
    .layout {
      justify-content: flex-start;
      gap: var(--space-md);
    }

    .nav-wrapper {
      position: relative;
      right: auto;
      flex-shrink: 0;
    }

    .main-content {
      flex: 1;
    }
  }

  .content {
    align-self: flex-start;
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 960px) {
    .layout {
      display: block;
      padding-bottom: 80px;
      padding-left: 0;
      padding-right: 0;
    }
    .nav-wrapper {
      display: none;
    }
  }

  .platforms {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  /* Hero */
  .hero {
    padding-bottom: 48px;
    margin-bottom: 48px;
  }

  .hero-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .hero-title {
    font-size: var(--font-h1);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 12px;
    color: var(--color-bold);
    overflow-wrap: anywhere;
    word-break: keep-all;
  }

  .hero-tagline {
    font-size: 15px;
    color: var(--color-sub);
    margin-bottom: 32px;
    line-height: 1.6;
    max-width: 560px;
    overflow-wrap: anywhere;
  }

  /* Metrics */
  .metrics-row {
    background: color-mix(in srgb, var(--color-surface-hover) 35%, var(--color-basic-bg));
    border-radius: 14px;
    display: grid;
    gap: 0;
    grid-template-columns: repeat(var(--metric-count), minmax(0, 1fr));
    margin: 0;
    max-width: 680px;
    padding: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
    :global(html.dark) & {
      background: rgba(255, 255, 255, 0.03);
      box-shadow: none;
      border: 0.5px solid rgba(255, 255, 255, 0.05);
    }
  }

  .metric {
    align-items: flex-start;
    display: flex;
    flex: 1 1 150px;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
  }

  .metric-val {
    color: var(--color-primary);
    font-size: 21px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0;
    white-space: nowrap;
  }

  .metric-lbl {
    color: var(--color-sub);
    font-size: 12px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  /* Article */
  .project-article {
    margin-bottom: 56px;
  }

  :global(.project-article h2) {
    font-size: var(--font-h2);
    font-weight: 800;
    color: var(--color-bold);
    letter-spacing: -0.02em;
    margin: 52px 0 20px;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  :global(.h2-subtitle) {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-sub);
    letter-spacing: 0;
    margin-top: 4px;
  }

  :global(.visually-hidden-colon) {
    display: none;
  }

  :global(.project-article h3) {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-bold);
    margin: 28px 0 10px;
    line-height: 1.4;
  }

  :global(.project-article h4) {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-main);
    margin: 20px 0 8px;
  }

  :global(.project-article p) {
    font-size: 1rem;
    color: var(--color-main);
    line-height: 1.8;
    margin-bottom: 16px;
    overflow-wrap: anywhere;
  }

  :global(.project-article ul),
  :global(.project-article ol) {
    margin: 0 0 16px 0;
    padding-left: 20px;
  }

  :global(.project-article li) {
    font-size: 1rem;
    color: var(--color-main);
    line-height: 1.8;
    margin-bottom: 4px;
    overflow-wrap: anywhere;
  }

  :global(.project-article strong) {
    color: var(--color-bold);
    font-weight: 600;
  }

  :global(.project-article code) {
    font-family: var(--font-family-code);
    font-size: 12px;
    background: var(--color-code-bg);
    color: var(--color-inline-code);
    padding: 2px 6px;
    border-radius: 4px;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  :global(.project-article pre) {
    background: var(--color-code-bg);
    border: 1px solid var(--color-bg-divider);
    border-radius: 8px;
    padding: 16px 20px;
    overflow-x: auto;
    margin-bottom: 24px;
  }

  :global(.project-article pre code) {
    background: transparent;
    padding: 0;
    font-size: 12.5px;
    line-height: 1.7;
  }

  :global(.project-article table) {
    display: block;
    width: 100%;
    max-width: 100%;
    margin: 18px 0 24px;
    overflow-x: auto;
    border: 1px solid var(--color-table-border);
    border-radius: 12px;
    border-spacing: 0;
    background: var(--color-basic-bg);
    font-size: 0.92rem;
    line-height: 1.55;
  }

  :global(.project-article thead) {
    background: var(--color-table-bg);
  }

  :global(.project-article th),
  :global(.project-article td) {
    min-width: 92px;
    padding: 10px 12px;
    border-right: 1px solid var(--color-table-border);
    border-bottom: 1px solid var(--color-table-border);
    color: var(--color-main);
    text-align: left;
    vertical-align: top;
  }

  :global(.project-article th) {
    color: var(--color-bold);
    font-weight: 700;
    white-space: nowrap;
  }

  :global(.project-article th:last-child),
  :global(.project-article td:last-child) {
    min-width: 260px;
    border-right: 0;
    white-space: normal;
  }

  :global(.project-article tr:last-child td) {
    border-bottom: 0;
  }

  :global(.project-article blockquote) {
    border-left: 3px solid var(--color-primary);
    margin: 0 0 20px;
    padding: 12px 16px;
    background: var(--color-disabled-bg);
    border-radius: 0 6px 6px 0;
  }

  :global(.project-article blockquote p) {
    margin-bottom: 0;
    color: var(--color-sub);
    font-size: 13.5px;
  }

  :global(.project-article hr) {
    display: none;
  }

  :global(.project-article a) {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  :global(.project-article a:hover) {
    opacity: 0.8;
  }

  .error-msg {
    color: var(--color-sub);
    font-size: 14px;
  }

  @media (max-width: 640px) {
    .hero {
      padding: 32px 0 32px;
    }

    .metric {
      gap: 3px;
      padding: 7px;
    }
  }

  @media (max-width: 420px) {
    .metrics-row.has-four-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
