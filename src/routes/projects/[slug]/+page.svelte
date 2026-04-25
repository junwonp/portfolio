<script lang="ts">
  import { browser } from '$app/environment';
  import Badge from '$lib/components/Badge.svelte';
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

  let progressWidth = $state('0%');

  $effect(() => {
    const update = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      progressWidth = `${String(Math.min(pct, 100))}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
    };
  });

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
        // Keep the colon in a hidden span so textContent remains stable for slugify/TOC
        h2.innerHTML = `${emoji} ${main}<span style="display:none">:</span><span class="h2-subtitle">${sub}</span>`;
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

<!-- Scroll progress bar -->
<div class="scroll-progress" style:width={progressWidth}></div>

<!-- Sticky top bar -->
<nav class="topbar">
  <a class="topbar-back" href="/">← {labels.resumeTitle}</a>
  <div class="topbar-crumb">
    <span>{labels.authorName}</span> / <span class="crumb-current">{metadata.title || slug}</span>
  </div>
  <div class="topbar-links">
    {#if metadata.githubLink}
      <a
        class="topbar-link"
        href={metadata.githubLink.startsWith('http')
          ? metadata.githubLink
          : `https://github.com/${metadata.githubLink}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub ↗
      </a>
    {/if}
    {#if metadata.productLink}
      <a
        class="topbar-link primary"
        href={metadata.productLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {labels.visitSite} ↗
      </a>
    {/if}
  </div>
</nav>

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
          <div class="metrics-row">
            {#each metadata.metrics as metric (metric.label)}
              <div class="metric">
                <div class="metric-val">{metric.value}</div>
                <div class="metric-lbl">{metric.label}</div>
              </div>
            {/each}
          </div>
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
  /* Scroll progress */
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: var(--color-primary);
    z-index: 100;
    transition: width 0.1s linear;
  }

  /* Top bar */
  .topbar {
    position: sticky;
    top: 0;
    z-index: 40;
    background: color-mix(in srgb, var(--color-basic-bg) 88%, transparent);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    padding: 0 24px;
    display: flex;
    align-items: center;
    height: 56px;
  }

  .topbar-back {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-family: inherit;
    color: var(--color-sub);
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s;
    z-index: 1;
  }

  .topbar-back:hover {
    color: var(--color-bold);
  }

  .topbar-crumb {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 15px;
    font-family: inherit;
    color: var(--color-sub);
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    pointer-events: none;
  }

  .crumb-current {
    color: var(--color-main);
  }

  .topbar-links {
    margin-left: auto;
    display: flex;
    gap: 12px;
    align-items: center;
    z-index: 1;
  }

  .topbar-link {
    font-size: 14px;
    font-family: inherit;
    color: var(--color-sub);
    text-decoration: none;
    padding: 6px 12px;
    border: 1px solid var(--color-bg-divider);
    border-radius: 6px;
    white-space: nowrap;
    transition:
      color 0.15s,
      border-color 0.15s;
  }

  .topbar-link:hover {
    color: var(--color-bold);
    border-color: var(--color-main);
  }

  .topbar-link.primary {
    background: var(--color-primary);
    color: #fff;
    border-color: var(--color-primary);
  }

  .topbar-link.primary:hover {
    background: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
  }

  /* Content layout */
  .layout {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 0 clamp(16px, 4vw, 48px) 120px;
    margin-top: var(--space-xl);
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
    font-size: clamp(32px, 6vw, 48px);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 12px;
    color: var(--color-bold);
  }

  .hero-tagline {
    font-size: 15px;
    color: var(--color-sub);
    margin-bottom: 32px;
    line-height: 1.6;
    max-width: 560px;
  }

  /* Metrics */
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1px;
    background: var(--color-bg-divider);
    border: 1px solid var(--color-bg-divider);
    border-radius: 10px;
    overflow: hidden;
  }

  .metric {
    background: var(--color-basic-bg);
    padding: 18px 16px;
  }

  .metric-val {
    font-size: 22px;
    font-weight: 700;
    color: var(--color-bold);
    line-height: 1;
    margin-bottom: 4px;
    letter-spacing: -0.02em;
  }

  .metric-lbl {
    font-size: 12px;
    color: var(--color-sub);
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
    .topbar-crumb {
      display: none;
    }

    .hero {
      padding: 32px 0 32px;
    }
  }

  @media (max-width: 576px) {
    .topbar {
      display: none;
    }
  }
</style>
