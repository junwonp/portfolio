<script lang="ts">
  import { Check, Ellipsis, Printer, Share2 } from 'lucide-svelte';

  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import Github from '$lib/components/Icon/Github.svelte';
  import Linkedin from '$lib/components/Icon/Linkedin.svelte';
  import IconLink from '$lib/components/IconLink.svelte';
  import { getLabels } from '$lib/data/labels';
  import type { Language } from '$lib/utils/language';
  import { getPageLocale } from '$lib/utils/locale';

  interface Props {
    githubLink?: string;
    linkedinLink?: string;
    name: string;
  }

  let { githubLink, linkedinLink, name }: Props = $props();

  let labels = $derived(getLabels(getPageLocale()));
  let locale = $derived(getPageLocale());

  let errorMessage = $state('');
  let isCopied = $state(false);
  let isMenuOpen = $state(false);
  let copyTimer = $state<ReturnType<typeof setTimeout> | null>(null);

  const toggleLanguage = async () => {
    errorMessage = '';
    if (!browser) return;

    const newLang: Language = locale === 'ko' ? 'en' : 'ko';
    try {
      const response = await fetch('/api/locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: newLang }),
      });

      if (response.ok) {
        await invalidateAll();
      } else {
        errorMessage = labels.languageToggleError;
      }
    } catch {
      errorMessage = labels.languageToggleError;
    }
  };

  async function sharePage(): Promise<void> {
    const shareUrl = window.location.href;
    const text = '';
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

<header class="sticky-header" aria-label="Quick navigation header">
  <div class="actions">
    <div class="lang-toggle-wrapper pc-only">
      <button
        class="lang-toggle glass-effect"
        onclick={toggleLanguage}
        title={labels.toggleLanguage}
      >
        {locale === 'ko' ? 'English' : '한국어'}
      </button>
    </div>

    <div class="action-group glass-effect">
      <button
        class="lang-toggle-btn mobile-only"
        onclick={toggleLanguage}
        aria-label={labels.toggleLanguage}
        title={labels.toggleLanguage}
      >
        {locale === 'ko' ? 'EN' : 'KO'}
      </button>

      {#if githubLink}
        <IconLink href={githubLink} title={labels.goToGithubPage} type="github">
          <Github width={20} height={20} />
        </IconLink>
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

            {#if linkedinLink}
              <div class="menu-divider"></div>
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
    {#if errorMessage}
      <span class="error" role="alert">{errorMessage}</span>
    {/if}
  </div>
</header>

<style>
  .sticky-header {
    align-items: center;
    background: transparent;
    border-bottom: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    display: none;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    z-index: 50;
    height: auto;
  }

  @media (min-width: 576px) {
    .sticky-header {
      display: flex;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 800px;
      padding: 0 2rem;
      padding-top: 2rem;
    }
  }

  @media (min-width: 1024px) {
    .sticky-header {
      max-width: 900px;
    }
  }

  @media (min-width: 1280px) {
    .sticky-header {
      max-width: 1000px;
    }
  }

  @media (min-width: 1536px) {
    .sticky-header {
      max-width: 1200px;
    }
  }

  @media (max-width: 576px) {
    .sticky-header {
      display: flex;
      left: auto;
      right: 0;
      transform: none;
      width: auto;
      padding: 0 1rem;
      padding-top: calc(16px + env(safe-area-inset-top));
    }
  }
  /* Language toggle styles for desktop sticky header */
  .lang-toggle-wrapper {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
  }

  .lang-toggle {
    align-items: center;
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

  /* Responsive Display Utilities */
  .mobile-only {
    display: none !important;
  }

  .pc-only {
    display: block;
  }

  @media (max-width: 576px) {
    .mobile-only {
      display: inline-flex !important;
    }

    .pc-only {
      display: none !important;
    }
  }

  .actions {
    align-items: center;
    display: flex;
    flex-shrink: 0;
    gap: 0.5rem;
    min-width: 0;
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

  .action-group {
    border-radius: 9999px;
    display: flex;
    align-items: center;
    padding: 3px;
    gap: 1px;
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

  .error {
    color: var(--color-error);
    font-size: 0.7rem;
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

  :global(.sticky-header .icon-link) {
    width: 30px !important;
    height: 30px !important;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    color: var(--color-sub) !important;
    border-radius: 50% !important;
    transition:
      background-color 0.15s,
      color 0.15s,
      transform 0.1s !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :global(.sticky-header .icon-link:active) {
    transform: scale(0.85) !important;
    background: color-mix(in srgb, var(--color-main) 12%, var(--color-disabled-bg)) !important;
    color: var(--color-bold) !important;
  }

  :global(.sticky-header .icon-link:hover) {
    background-color: var(--color-disabled-bg) !important;
    color: var(--color-bold) !important;
  }
</style>
