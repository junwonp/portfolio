<script lang="ts">
  import { Printer } from 'lucide-svelte';

  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import Github from '$lib/components/Icon/Github.svelte';
  import Linkedin from '$lib/components/Icon/Linkedin.svelte';
  import IconLink from '$lib/components/IconLink.svelte';
  import ShareButton from '$lib/components/ShareButton.svelte';
  import { getLabels } from '$lib/data/labels';
  import type { Language } from '$lib/utils/language';
  import { getPageLocale } from '$lib/utils/locale';

  interface Props {
    githubLink?: string;
    linkedinLink?: string;
    name: string;
  }

  let { githubLink, linkedinLink, name }: Props = $props();

  let langDisplay = $derived(getPageLocale() === 'ko' ? 'English' : '한국어');
  let labels = $derived(getLabels(getPageLocale()));
  let locale = $derived(getPageLocale());

  let errorMessage = $state('');
  let isVisible = $state(false);

  $effect(() => {
    const sentinel = document.getElementById('intro-header-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = !entry.isIntersecting;
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  });

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
</script>

<header class="sticky-header" class:visible={isVisible} aria-label="Quick navigation header">
  <span class="name">{name}</span>
  <div class="actions">
    <div class="lang-toggle-wrapper">
      <button class="lang-toggle" onclick={toggleLanguage} aria-label={labels.toggleLanguage}>
        {langDisplay}
      </button>
    </div>

    <div class="action-group">
      <ShareButton shareLabel={labels.sharePage} copiedLabel={labels.linkCopied} />
      <div class="divider"></div>
      <IconLink href="/print" title={labels.printPage} type="normal">
        <Printer size={20} strokeWidth={2} />
      </IconLink>
      {#if githubLink || linkedinLink}
        <div class="divider"></div>
        {#if githubLink}
          <IconLink href={githubLink} title={labels.goToGithubPage} type="github">
            <Github width={20} height={20} />
          </IconLink>
        {/if}
        {#if linkedinLink}
          <IconLink href={linkedinLink} title={labels.goToLinkedinPage} type="linkedin">
            <Linkedin width={20} height={20} />
          </IconLink>
        {/if}
      {/if}
    </div>
    {#if errorMessage}
      <span class="error" role="alert">{errorMessage}</span>
    {/if}
  </div>
</header>

<style>
  .sticky-header {
    align-items: center;
    background: color-mix(in srgb, var(--color-basic-bg) 90%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-bg-divider);
    display: none;
    gap: 0.5rem;
    justify-content: space-between;
    left: 0;
    padding: 0 0.75rem;
    padding-top: env(safe-area-inset-top);
    position: fixed;
    right: 0;
    top: 0;
    z-index: 50;
    min-height: 56px;
    transform: translateY(-110%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sticky-header.visible {
    transform: translateY(0);
  }

  @media (max-width: 576px) {
    .sticky-header {
      display: flex;
    }
  }

  .name {
    color: var(--color-bold);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 0.5rem;
  }

  .actions {
    align-items: center;
    display: flex;
    flex-shrink: 0;
    gap: 0.5rem;
  }

  .lang-toggle {
    align-items: center;
    background-color: #ebeef1;
    :global(html.dark) & {
      background-color: #2d3239;
    }
    border-radius: 9999px;
    border: none;
    color: #404040;
    :global(html.dark) & {
      color: #c9d1d9;
    }
    cursor: pointer;
    display: flex;
    font-size: 0.8125rem;
    font-weight: 500;
    height: 38px;
    padding: 0 0.875rem;
    transition:
      background 0.2s,
      color 0.2s,
      transform 0.1s;
    white-space: nowrap;
  }

  .lang-toggle:active {
    transform: scale(0.96);
  }

  .lang-toggle:hover {
    background: var(--color-bg-divider);
    color: var(--color-primary);
  }

  .action-group {
    align-items: center;
    background-color: #ebeef1;
    :global(html.dark) & {
      background-color: #2d3239;
    }
    border-radius: 9999px;
    display: flex;
    gap: 2px;
    padding: 2px;
  }

  .divider {
    background: color-mix(in srgb, var(--color-main) 25%, transparent);
    height: 14px;
    width: 1px;
    margin: 0 2px;
  }

  .error {
    color: var(--color-error);
    font-size: 0.7rem;
  }

  :global(.sticky-header .icon-link) {
    padding: 6px !important;
  }
</style>
