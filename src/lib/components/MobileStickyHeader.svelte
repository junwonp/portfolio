<script lang="ts">
  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import { base } from '$app/paths';
  import Github from '$lib/components/Icon/Github.svelte';
  import Linkedin from '$lib/components/Icon/Linkedin.svelte';
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

  function withBase(href?: string): string | undefined {
    if (!href) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    if (href.startsWith('/')) return `${base}${href}`;
    return href;
  }

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
    <button class="lang-toggle" onclick={toggleLanguage} aria-label={labels.toggleLanguage}>
      {langDisplay}
    </button>
    {#if githubLink}
      <a
        class="icon-link icon-github"
        href={githubLink}
        target="_blank"
        data-sveltekit-reload
        rel="external noopener noreferrer"
        aria-label={labels.goToGithubPage}
        title={labels.goToGithubPage}
      >
        <Github />
      </a>
    {/if}
    {#if linkedinLink}
      <a
        class="icon-link icon-linkedin"
        href={withBase(linkedinLink)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.goToLinkedinPage}
        title={labels.goToLinkedinPage}
      >
        <Linkedin />
      </a>
    {/if}
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
    padding: 0 1rem;
    padding-top: env(safe-area-inset-top);
    position: fixed;
    right: 0;
    top: 0;
    z-index: 50;
    min-height: 52px;
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
  }

  .actions {
    align-items: center;
    display: flex;
    flex-shrink: 0;
    gap: 0.25rem;
  }

  .lang-toggle {
    background: transparent;
    border: 1px solid var(--color-main);
    border-radius: 6px;
    color: var(--color-main);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.75rem;
    padding: 0.35rem 0.6rem;
    transition:
      background 0.2s,
      border-color 0.2s,
      color 0.2s;
    white-space: nowrap;
  }

  .lang-toggle:hover {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: #ffffff;
  }

  .icon-link {
    align-items: center;
    border-radius: 50%;
    color: var(--color-main);
    display: flex;
    height: 2.25rem;
    justify-content: center;
    text-decoration: none;
    transition:
      background 0.2s,
      color 0.2s;
    width: 2.25rem;
  }

  .icon-link :global(svg) {
    pointer-events: none;
  }

  .icon-github:hover {
    background: #24292e;
    color: #ffffff;
  }

  .icon-linkedin:hover {
    background: #0077b5;
    color: #ffffff;
  }

  .error {
    color: var(--color-error);
    font-size: 0.7rem;
  }
</style>
