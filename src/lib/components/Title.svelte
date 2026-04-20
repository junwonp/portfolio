<script lang="ts">
  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import { base } from '$app/paths';
  import ChevronLeft from '$lib/components/Icon/ChevronLeft.svelte';
  import Github from '$lib/components/Icon/Github.svelte';
  import Globe from '$lib/components/Icon/Globe.svelte';
  import Linkedin from '$lib/components/Icon/Linkedin.svelte';
  import { getLabels } from '$lib/data/labels';
  import type { MetricItem, PillarItem } from '$lib/types/about';
  import type { Language } from '$lib/utils/language';
  import { getPageLocale } from '$lib/utils/locale';

  interface Props {
    backLink?: string;
    githubLink?: string;
    isHome?: boolean;
    linkedinLink?: string;
    metrics?: MetricItem[];
    name: string;
    pillars?: PillarItem[];
    productLink?: string;
    role: string;
    tagline: string;
  }

  let {
    backLink,
    githubLink,
    isHome = false,
    linkedinLink,
    metrics,
    name,
    pillars,
    productLink,
    role,
    tagline,
  }: Props = $props();

  let langDisplay = $derived(getPageLocale() === 'ko' ? 'English' : '한국어');
  let labels = $derived(getLabels(getPageLocale()));
  let locale = $derived(getPageLocale());

  let errorMessage = $state('');

  function withBase(href?: string): string | undefined {
    if (!href) return undefined;
    if (href.startsWith('/')) return `${base}${href}`;
    return href;
  }

  async function toggleLanguage(): Promise<void> {
    errorMessage = '';
    if (browser) {
      const newLang: Language = locale === 'ko' ? 'en' : 'ko';

      try {
        const response = await fetch('/api/locale', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ locale: newLang }),
        });

        if (response.ok) {
          await invalidateAll();
        } else {
          errorMessage = labels.languageToggleError;
        }
      } catch (error) {
        console.error('Failed to update locale:', error);
        errorMessage = labels.languageToggleError;
      }
    }
  }
</script>

<div>
  <header class="header">
    <div class="title-container" class:with-back={!!backLink}>
      <h1 class="title">{name}</h1>
      <div class="icons" class:with-back={!!backLink}>
        {#if backLink}
          <div class="back-button">
            <a href={withBase(backLink)} aria-label={labels.goBack} title={labels.goBack}>
              <ChevronLeft />
            </a>
          </div>
        {/if}
        <div class="other-icons">
          {#if isHome}
            <div class="lang-toggle-wrapper">
              <button class="lang-toggle" onclick={toggleLanguage} title={labels.toggleLanguage}>
                {langDisplay}
              </button>
              {#if errorMessage}
                <span class="lang-toggle-error" role="alert">{errorMessage}</span>
              {/if}
            </div>
          {/if}
          {#if productLink}
            <div class="icon">
              <a
                href={withBase(productLink)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={labels.goToProductPage}
                title={labels.goToProductPage}
              >
                <Globe />
              </a>
            </div>
          {/if}
          {#if githubLink}
            <div class="icon">
              <a
                class="icon-github"
                href={withBase(githubLink)}
                target="_blank"
                data-sveltekit-reload
                rel="external noopener noreferrer"
                aria-label={labels.goToGithubPage}
                title={labels.goToGithubPage}
              >
                <Github />
              </a>
            </div>
          {/if}

          {#if linkedinLink}
            <div class="icon">
              <a
                class="icon-linkedin"
                href={withBase(linkedinLink)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={labels.goToLinkedinPage}
                title={labels.goToLinkedinPage}
              >
                <Linkedin />
              </a>
            </div>
          {/if}
        </div>
      </div>
    </div>
    {#if role}
      <h2 class="role">{role}</h2>
    {/if}
    <p class="tagline">{tagline}</p>

    {#if metrics && metrics.length > 0}
      <div class="metrics-grid">
        {#each metrics as metric (metric.label)}
          <div class="metric-cell">
            <span class="metric-value">{metric.value}</span>
            <span class="metric-label">{metric.label}</span>
          </div>
        {/each}
      </div>
    {/if}

    {#if pillars && pillars.length > 0}
      <div class="pillars">
        {#each pillars as pillar (pillar.index)}
          <div class="pillar">
            <span class="pillar-index">{pillar.index}</span>
            <div class="pillar-content">
              <span class="pillar-title">{pillar.title}</span>
              <span class="pillar-desc">{pillar.description}</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </header>
</div>

<style>
  .header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title-container {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0 0 0.67em 0;
    gap: 1rem;
  }

  .title-container.with-back {
    justify-content: space-between;
    gap: 0;
  }

  .back-button {
    display: none;
    align-items: center;
    padding: var(--space-sm);
    padding-left: 0;
  }

  .back-button a {
    align-items: center;
    border-radius: 50%;
    color: var(--color-main);
    display: flex;
    justify-content: center;
    padding: var(--space-xs);
    text-decoration: none;
    transition:
      background 0.2s,
      color 0.2s,
      transform 0.1s;
  }

  .back-button a:active {
    transform: scale(0.9);
  }

  .back-button a:hover {
    background: color-mix(in srgb, var(--color-primary) 15%, transparent);
    color: var(--color-primary);
  }

  .title {
    font-size: 3rem;
    line-height: 1.1;
    margin: 0;
    word-break: keep-all;
    flex: 1;
  }

  .icons {
    align-items: center;
    display: flex;
    gap: 0.5rem;
  }

  .other-icons {
    align-items: center;
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
  }

  .role {
    font-size: 2rem;
    line-height: 1.1;
    margin: 0 0 0.67em 0;
    word-break: keep-all;
  }

  .tagline {
    color: var(--color-sub);
    font-size: 1.5rem;
    line-height: 1.1;
    margin: 0 0 0.67em 0;
    word-break: keep-all;
  }

  .metrics-grid {
    background: var(--color-bg-divider);
    border-radius: 8px;
    display: grid;
    gap: 1px;
    grid-template-columns: repeat(3, 1fr);
    margin: var(--space-md) 0 var(--space-sm);
    overflow: hidden;
  }

  .metric-cell {
    align-items: flex-start;
    background: var(--color-basic-bg);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: var(--space-sm) var(--space-md);
  }

  .metric-value {
    color: var(--color-primary);
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
  }

  .metric-label {
    color: var(--color-sub);
    font-size: 0.75rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .pillars {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: var(--space-sm) 0 var(--space-md);
  }

  .pillar {
    align-items: flex-start;
    background: var(--color-bg-subdivider);
    border-radius: 6px;
    display: flex;
    gap: 0.75rem;
    padding: 0.625rem var(--space-sm);
  }

  .pillar-index {
    color: var(--color-primary-hover);
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
    padding-top: 0.1rem;
  }

  .pillar-content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .pillar-title {
    color: var(--color-bold);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .pillar-desc {
    color: var(--color-sub);
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .lang-toggle-wrapper {
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.375rem;
  }

  .lang-toggle {
    background: transparent;
    border-radius: 8px;
    border: 1px solid var(--color-main);
    color: var(--color-main);
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    transition:
      background 0.2s,
      border-color 0.2s,
      color 0.2s,
      transform 0.1s;
  }

  .lang-toggle:active {
    transform: scale(0.95);
  }

  .lang-toggle:hover {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: #ffffff;
  }

  .lang-toggle-error {
    color: var(--color-error);
    font-size: 0.75rem;
  }

  .icon {
    display: flex;
    padding: 0.375rem;
  }

  .icon a :global(svg) {
    pointer-events: none;
  }

  .icon a {
    align-items: center;
    border-radius: 50%;
    color: var(--color-main);
    display: flex;
    flex-shrink: 0;
    height: 2.5rem;
    justify-content: center;
    overflow: hidden;
    text-decoration: none;
    transition:
      background 0.2s,
      color 0.2s,
      transform 0.1s;
    width: 2.5rem;
  }

  .icon a:active {
    transform: scale(0.9);
  }

  .icon a:not(.icon-github):not(.icon-linkedin):hover {
    background: color-mix(in srgb, var(--color-primary) 15%, transparent);
    color: var(--color-primary);
  }

  .icon-github:hover {
    background: #24292e;
    color: #ffffff;
  }

  .icon-linkedin:hover {
    background: #0077b5;
    color: #ffffff;
  }

  @media (max-width: 576px) {
    .title-container {
      flex-direction: column-reverse;
      justify-content: flex-start;
    }

    .back-button {
      display: flex;
    }

    .icons {
      width: 100%;
      margin-bottom: 0.5rem;
    }

    .other-icons {
      gap: 0.125rem;
    }

    .lang-toggle-wrapper {
      padding: 0.25rem;
    }

    .lang-toggle {
      font-size: 0.75rem;
      padding: 0.3rem 0.625rem;
    }

    .icon {
      padding: 0.25rem;
    }

    .icon a {
      height: 2rem;
      width: 2rem;
    }

    .title {
      width: 100%;
      flex: initial;
    }
  }

  @media (min-width: 576px) {
    .back-button {
      display: none;
    }
  }

  @media (max-width: 960px) {
    .title {
      font-size: 2.25rem;
    }

    .metric-cell {
      padding: var(--space-xs) var(--space-sm);
    }

    .metric-value {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 576px) {
    .metric-cell {
      padding: 0.5rem 0.75rem;
    }

    .metric-value {
      font-size: 1.1rem;
    }

    .pillar-desc {
      display: none;
    }
  }

  @media print {
    .icons {
      display: none !important;
    }

    .lang-toggle {
      display: none !important;
    }

    .title {
      font-size: 2.5rem;
    }
  }
</style>
