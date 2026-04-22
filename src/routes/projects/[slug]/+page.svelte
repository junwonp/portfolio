<script lang="ts">
  import { getLabels } from '$lib/data/labels';

  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let { component: Component, metadata, slug, locale } = $derived(data);
  let labels = $derived(getLabels(locale));

  let progressWidth = $state('0%');

  const platformDotColors: Record<string, string> = {
    Android: '#3ddc84',
    iOS: '#007aff',
    Web: '#f97316',
  };

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

<!-- Scroll progress bar -->
<div class="scroll-progress" style:width={progressWidth}></div>

<!-- Sticky top bar -->
<nav class="topbar">
  <a class="topbar-back" href="/">← {labels.resumeTitle}</a>
  <div class="topbar-crumb">
    <span>Junwon</span> / <span class="crumb-current">{metadata.title || slug}</span>
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
        Live ↗
      </a>
    {/if}
  </div>
</nav>

<div class="content">
  <!-- Hero -->
  <div class="hero">
    <div class="hero-meta">
      {#if metadata.role}
        <span class="badge orange">{metadata.role}</span>
      {/if}
      {#if metadata.status}
        <span class="badge green">{metadata.status}</span>
      {/if}
      {#if metadata.date}
        <span class="badge blue">{metadata.date} ~</span>
      {/if}
    </div>

    <h1 class="hero-title">{metadata.title || slug}</h1>

    {#if metadata.description}
      <p class="hero-sub">{metadata.description}</p>
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
          <div class="platform-tag">
            <span class="platform-dot" style:background={platformDotColors[platform] ?? '#888'}
            ></span>
            {platform}
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- MDX content -->
  <article class="project-article">
    {#if Component}
      <Component />
    {:else}
      <p class="error-msg">{labels.contentLoadError}</p>
    {/if}
  </article>

  <!-- Tech stack -->
  {#if metadata.techStack && metadata.techStack.length > 0}
    <div class="section">
      <div class="section-label">{labels.techStack}</div>
      <div class="tech-grid">
        {#each metadata.techStack as tech (tech)}
          <span class="tech-tag">{tech}</span>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  /* Scroll progress */
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: #e05a2b;
    z-index: 100;
    transition: width 0.1s linear;
  }

  /* Top bar */
  .topbar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: color-mix(in srgb, var(--color-basic-bg) 88%, transparent);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--color-bg-divider);
    padding: 0 clamp(16px, 5vw, 60px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    gap: 12px;
  }

  .topbar-back {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-family: var(--font-family-code);
    color: var(--color-sub);
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s;
    flex-shrink: 0;
  }

  .topbar-back:hover {
    color: var(--color-bold);
  }

  .topbar-crumb {
    font-size: 12px;
    font-family: var(--font-family-code);
    color: var(--color-sub);
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
  }

  .crumb-current {
    color: var(--color-main);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .topbar-links {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-shrink: 0;
  }

  .topbar-link {
    font-size: 11px;
    font-family: var(--font-family-code);
    color: var(--color-sub);
    text-decoration: none;
    padding: 5px 10px;
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
    background: #e05a2b;
    color: #fff;
    border-color: #e05a2b;
  }

  .topbar-link.primary:hover {
    background: #c94f24;
    border-color: #c94f24;
  }

  /* Content */
  .content {
    max-width: 780px;
    margin: 0 auto;
    padding: 0 clamp(16px, 5vw, 60px) 120px;
  }

  /* Hero */
  .hero {
    padding: 52px 0 48px;
    border-bottom: 1px solid var(--color-bg-divider);
    margin-bottom: 48px;
  }

  .hero-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .badge {
    font-size: 10px;
    font-family: var(--font-family-code);
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid var(--color-bg-divider);
    color: var(--color-sub);
  }

  .badge.orange {
    background: rgba(224, 90, 43, 0.12);
    color: #e05a2b;
    border-color: rgba(224, 90, 43, 0.3);
  }

  .badge.green {
    background: rgba(74, 222, 128, 0.08);
    color: #4ade80;
    border-color: rgba(74, 222, 128, 0.2);
  }

  .badge.blue {
    background: rgba(96, 165, 250, 0.08);
    color: #60a5fa;
    border-color: rgba(96, 165, 250, 0.2);
  }

  .hero-title {
    font-size: clamp(32px, 6vw, 48px);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 12px;
    color: var(--color-bold);
  }

  .hero-sub {
    font-size: 15px;
    color: var(--color-sub);
    margin-bottom: 32px;
    line-height: 1.6;
    max-width: 560px;
  }

  /* Metrics */
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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
    font-family: var(--font-family-code);
    color: var(--color-bold);
    line-height: 1;
    margin-bottom: 4px;
    letter-spacing: -0.02em;
  }

  .metric-lbl {
    font-size: 10px;
    color: var(--color-sub);
  }

  /* Platforms */
  .platforms {
    display: flex;
    gap: 8px;
    margin-top: 24px;
    flex-wrap: wrap;
  }

  .platform-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-family: var(--font-family-code);
    color: var(--color-sub);
    background: var(--color-disabled-bg);
    border: 1px solid var(--color-bg-divider);
    padding: 6px 12px;
    border-radius: 6px;
  }

  .platform-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Article */
  .project-article {
    margin-bottom: 56px;
  }

  /* Section */
  .section {
    margin-bottom: 56px;
  }

  .section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-sub);
    font-family: var(--font-family-code);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--color-bg-divider);
  }

  /* Tech stack */
  .tech-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tech-tag {
    font-size: 12px;
    font-family: var(--font-family-code);
    color: var(--color-sub);
    background: var(--color-disabled-bg);
    border: 1px solid var(--color-bg-divider);
    padding: 5px 11px;
    border-radius: 6px;
    transition:
      border-color 0.15s,
      color 0.15s;
  }

  .tech-tag:hover {
    color: var(--color-bold);
    border-color: var(--color-main);
  }

  .error-msg {
    color: var(--color-sub);
    font-size: 14px;
  }

  @media (max-width: 640px) {
    .topbar-crumb {
      display: none;
    }

    .metrics-row {
      grid-template-columns: repeat(2, 1fr);
    }

    .hero {
      padding: 32px 0 32px;
    }
  }
</style>
