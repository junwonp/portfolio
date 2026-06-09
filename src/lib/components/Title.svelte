<script lang="ts">
  import { Check, ChevronLeft, Ellipsis, Globe, Printer, Share2 } from 'lucide-svelte';

  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import Github from '$lib/components/Icon/Github.svelte';
  import Linkedin from '$lib/components/Icon/Linkedin.svelte';
  import IconLink from '$lib/components/IconLink.svelte';
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

  let labels = $derived(getLabels(getPageLocale()));
  let locale = $derived(getPageLocale());
  let metricColumnCount = $derived(Math.min(metrics?.length ?? 1, 4));

  let errorMessage = $state('');
  let isCopied = $state(false);
  let isMenuOpen = $state(false);
  let copyTimer = $state<ReturnType<typeof setTimeout> | null>(null);

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

  async function sharePage(): Promise<void> {
    const shareUrl = window.location.href;
    const text = tagline;
    const title = `${name} | ${labels.resumeTitle}`;

    if ('share' in navigator) {
      try {
        await navigator.share({ text, title, url: shareUrl });
        isMenuOpen = false;
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    // Fallback: clipboard copy
    try {
      await navigator.clipboard.writeText(shareUrl);
      isCopied = true;
      if (copyTimer) clearTimeout(copyTimer);
      copyTimer = setTimeout(() => {
        isCopied = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }
</script>

<svelte:window
  onclick={(e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (isMenuOpen && target && !target.closest('.more-menu-container')) {
      isMenuOpen = false;
    }
  }}
/>

<div>
  <header class="header">
    <div class="title-container" class:with-back={!!backLink}>
      <h1 class="title">{name}</h1>
      <div class="icons" class:with-back={!!backLink}>
        {#if backLink}
          <div class="back-button">
            <a href={backLink} aria-label={labels.goBack} title={labels.goBack}>
              <ChevronLeft />
            </a>
          </div>
        {/if}
        <div class="other-icons-container">
          <div class="other-icons">
            {#if isHome}
              <div class="lang-toggle-wrapper pc-only">
                <button class="lang-toggle" onclick={toggleLanguage} title={labels.toggleLanguage}>
                  {locale === 'ko' ? 'English' : '한국어'}
                </button>
              </div>
            {/if}

            <div class="action-group">
              {#if isHome}
                <button
                  class="lang-toggle-btn mobile-only"
                  onclick={toggleLanguage}
                  title={labels.toggleLanguage}
                  aria-label={labels.toggleLanguage}
                >
                  {locale === 'ko' ? 'EN' : 'KO'}
                </button>
                <div class="divider mobile-only"></div>
              {/if}

              {#if githubLink}
                <IconLink href={githubLink} title={labels.goToGithubPage} type="github">
                  <Github width={20} height={20} />
                </IconLink>
                <div class="divider"></div>
              {/if}

              <div class="more-menu-container">
                <button
                  class="more-button"
                  class:active={isMenuOpen}
                  onclick={(e) => {
                    e.stopPropagation();
                    isMenuOpen = !isMenuOpen;
                  }}
                  aria-label="More actions"
                  aria-expanded={isMenuOpen}
                >
                  <Ellipsis size={20} />
                </button>

                {#if isMenuOpen}
                  <div class="dropdown-menu">
                    <button class="dropdown-item" onclick={sharePage}>
                      {#if isCopied}
                        <Check size={16} />
                        <span>{labels.linkCopied}</span>
                      {:else}
                        <Share2 size={16} />
                        <span>{labels.sharePage}</span>
                      {/if}
                    </button>

                    <div class="menu-divider"></div>

                    <button
                      class="dropdown-item"
                      onclick={() => {
                        if (browser) window.print();
                        isMenuOpen = false;
                      }}
                    >
                      <Printer size={16} />
                      <span>{labels.printPage}</span>
                    </button>

                    {#if productLink || linkedinLink}
                      <div class="menu-divider"></div>
                    {/if}

                    {#if productLink}
                      <a
                        class="dropdown-item"
                        href={productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onclick={() => (isMenuOpen = false)}
                      >
                        <Globe size={16} />
                        <span>{labels.goToProductPage}</span>
                      </a>
                    {/if}

                    {#if linkedinLink}
                      <a
                        class="dropdown-item"
                        href={linkedinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onclick={() => (isMenuOpen = false)}
                      >
                        <Linkedin width={16} height={16} />
                        <span>{labels.goToLinkedinPage}</span>
                      </a>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
          </div>
          {#if errorMessage}
            <span class="lang-toggle-error" role="alert">{errorMessage}</span>
          {/if}
        </div>
      </div>
    </div>
    {#if role}
      <h2 class="role">{role}</h2>
    {/if}
    <p class="tagline">{tagline}</p>

    {#if metrics && metrics.length > 0}
      <dl
        class="metrics-grid"
        class:has-four-metrics={metricColumnCount === 4}
        style:--metric-count={metricColumnCount}
      >
        {#each metrics as metric (metric.label)}
          <div class="metric-cell">
            <dt class="metric-label">{metric.label}</dt>
            <dd class="metric-value">{metric.value}</dd>
          </div>
        {/each}
      </dl>
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
    max-width: 100%;
    min-width: 0;
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
    overflow-wrap: anywhere;
    line-height: 1.1;
    margin: 0;
    word-break: keep-all;
    flex: 1;
    min-width: 0;
    padding-right: 160px;
  }

  .icons {
    align-items: center;
    display: flex;
    gap: 0.5rem;
    max-width: 100%;
    min-width: 0;
  }

  .other-icons {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-left: auto;
    min-width: 0;
  }

  .action-group {
    align-items: center;
    background-color: rgba(255, 255, 255, 0.45);
    :global(html.dark) & {
      background-color: rgba(255, 255, 255, 0.06);
    }
    backdrop-filter: saturate(140%) blur(12px);
    -webkit-backdrop-filter: saturate(140%) blur(12px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    :global(html.dark) & {
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    border-radius: 9999px;
    display: flex;
    flex-shrink: 0;
    gap: 1px;
    padding: 3px;
    height: 36px;
    box-sizing: border-box;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.03),
      inset 0 1px 1px rgba(255, 255, 255, 0.8);
    :global(html.dark) & {
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
  }

  .divider {
    background: color-mix(in srgb, var(--color-main) 15%, transparent);
    height: 14px;
    width: 1px;
    margin: 0 3px;
  }

  .role {
    font-size: 2rem;
    line-height: 1.1;
    margin: 0 0 0.67em 0;
    overflow-wrap: anywhere;
    word-break: keep-all;
  }

  .tagline {
    color: var(--color-sub);
    font-size: 1.5rem;
    line-height: 1.1;
    margin: 0 0 0.67em 0;
    overflow-wrap: anywhere;
    word-break: keep-all;
  }

  .metrics-grid {
    border: 1px solid var(--color-bg-divider);
    border-radius: 10px;
    display: grid;
    gap: 0;
    grid-template-columns: repeat(var(--metric-count), minmax(0, 1fr));
    margin: var(--space-md) 0 var(--space-sm);
    padding: 0.25rem;
  }

  .metric-cell {
    align-items: flex-start;
    display: flex;
    flex: 1 1 10rem;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.75rem;
  }

  .metric-value {
    color: var(--color-primary);
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1;
    margin: 0;
    white-space: nowrap;
  }

  .metric-label {
    color: var(--color-sub);
    font-size: 0.78rem;
    letter-spacing: 0.02em;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .pillars {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: var(--space-sm) 0 var(--space-md);
  }

  .pillar {
    align-items: flex-start;
    background-color: #ebeef1;
    :global(html.dark) & {
      background-color: #2d3239;
    }
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
    color: #404040;
    :global(html.dark) & {
      color: #8b949e;
    }
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .other-icons-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .lang-toggle-wrapper {
    display: flex;
    align-items: center;
  }

  .lang-toggle {
    align-items: center;
    background-color: rgba(255, 255, 255, 0.45);
    :global(html.dark) & {
      background-color: rgba(255, 255, 255, 0.06);
    }
    backdrop-filter: saturate(140%) blur(12px);
    -webkit-backdrop-filter: saturate(140%) blur(12px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    :global(html.dark) & {
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    border-radius: 9999px;
    color: var(--color-sub);
    cursor: pointer;
    display: flex;
    font-size: 0.8125rem;
    font-weight: 500;
    height: 36px;
    padding: 0 0.875rem;
    transition:
      background-color 0.15s,
      color 0.15s,
      transform 0.1s;
    box-sizing: border-box;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.03),
      inset 0 1px 1px rgba(255, 255, 255, 0.8);
    :global(html.dark) & {
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
  }

  .lang-toggle:active {
    transform: scale(0.88);
    background-color: var(--color-disabled-bg);
    color: var(--color-bold);
  }

  .lang-toggle:hover {
    color: var(--color-bold);
  }

  .lang-toggle-btn {
    background: transparent;
    border: none;
    color: var(--color-sub);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 600;
    transition:
      background-color 0.15s,
      color 0.15s,
      transform 0.1s;
    box-sizing: border-box;
  }

  .lang-toggle-btn:hover {
    color: var(--color-bold);
    background-color: var(--color-disabled-bg);
  }

  .lang-toggle-btn:active {
    transform: scale(0.85) !important;
    background-color: color-mix(
      in srgb,
      var(--color-main) 12%,
      var(--color-disabled-bg)
    ) !important;
  }

  .lang-toggle-error {
    color: var(--color-error);
    font-size: 0.75rem;
  }

  /* Responsive Display Utilities */
  .mobile-only {
    display: none !important;
  }

  .pc-only {
    display: block;
  }

  :global(.action-group .icon-link) {
    padding: 5px !important;
    background: transparent !important;
    border: none !important;
    color: var(--color-sub) !important;
    border-radius: 9999px !important;
    transition:
      background-color 0.15s,
      color 0.15s,
      transform 0.1s !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :global(.action-group .icon-link:active) {
    transform: scale(0.88) !important;
    background: var(--color-disabled-bg) !important;
    color: var(--color-bold) !important;
  }

  .more-menu-container {
    position: relative;
    display: inline-flex;
  }

  .more-button {
    background: transparent;
    border: none;
    color: var(--color-sub);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    transition:
      background-color 0.15s,
      color 0.15s,
      transform 0.1s;
  }

  .more-button:hover {
    color: var(--color-bold);
    background-color: var(--color-disabled-bg);
  }

  .more-button:active {
    transform: scale(0.85) !important;
    background-color: color-mix(
      in srgb,
      var(--color-main) 12%,
      var(--color-disabled-bg)
    ) !important;
  }

  .more-button.active {
    color: var(--color-bold);
    background-color: rgba(0, 0, 0, 0.08) !important;
    :global(html.dark) & {
      background-color: rgba(255, 255, 255, 0.12) !important;
    }
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 100;
    min-width: 200px;
    background: rgba(255, 255, 255, 0.94);
    :global(html.dark) & {
      background: rgba(28, 28, 30, 0.95);
    }
    backdrop-filter: saturate(140%) blur(20px);
    -webkit-backdrop-filter: saturate(140%) blur(20px);
    border: 0.5px solid rgba(0, 0, 0, 0.08);
    :global(html.dark) & {
      border: 0.5px solid rgba(255, 255, 255, 0.08);
    }
    border-radius: 16px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
    :global(html.dark) & {
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    }
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    transform-origin: top right;
    animation: menu-reveal 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .menu-divider {
    background: rgba(0, 0, 0, 0.06);
    :global(html.dark) & {
      background: rgba(255, 255, 255, 0.08);
    }
    height: 0.5px;
    margin: 4px 6px;
  }

  @keyframes menu-reveal {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  :global(.dropdown-menu .dropdown-item) {
    background: transparent !important;
    border: none !important;
    color: var(--color-bold) !important;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 8px 12px;
    text-align: left;
    text-decoration: none !important;
    width: 100%;
    border-radius: 10px;
    transition:
      background-color 0.15s,
      color 0.15s,
      transform 0.1s;
    box-sizing: border-box;
  }

  :global(.dropdown-menu .dropdown-item:hover) {
    background-color: rgba(0, 0, 0, 0.05) !important;
    :global(html.dark) & {
      background-color: rgba(255, 255, 255, 0.08) !important;
    }
  }

  :global(.dropdown-menu .dropdown-item:active) {
    transform: scale(0.97);
    background-color: rgba(0, 0, 0, 0.08) !important;
    :global(html.dark) & {
      background-color: rgba(255, 255, 255, 0.12) !important;
    }
  }

  @media (max-width: 576px) {
    .title-container {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    .back-button {
      display: flex;
    }

    .icons {
      width: auto;
      margin-bottom: 0;
    }

    .other-icons {
      gap: 0.5rem;
      justify-content: flex-end;
      margin-left: 0;
      width: auto;
    }

    .mobile-only {
      display: inline-flex !important;
    }

    .pc-only {
      display: none !important;
    }

    .title {
      width: auto !important;
      flex: 1 !important;
      padding-right: 140px;
    }

    .action-group {
      display: none !important;
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
      padding: 0.65rem;
    }

    .metric-value {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 576px) {
    .metrics-grid {
      padding: 0.5rem;
    }

    .metric-cell {
      padding: 0.45rem;
    }

    .pillar-desc {
      display: none;
    }
  }

  @media (max-width: 420px) {
    .metrics-grid.has-four-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .action-group,
  .lang-toggle-wrapper {
    display: none !important;
  }
</style>
