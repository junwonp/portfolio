<script lang="ts">
  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import Github from '$lib/components/Icon/Github.svelte';
  import Globe from '$lib/components/Icon/Globe.svelte';
  import Linkedin from '$lib/components/Icon/Linkedin.svelte';
  import { getLabels } from '$lib/data/labels';
  import type { Language } from '$lib/utils/language';
  import { getPageLocale } from '$lib/utils/locale';

  interface Props {
    githubLink?: string;
    linkedinLink?: string;
    productLink?: string;
    name: string;
    role: string;
    tagline: string;
    isHome?: boolean;
  }

  const {
    githubLink,
    linkedinLink,
    productLink,
    name,
    role,
    tagline,
    isHome = false,
  }: Props = $props();

  const locale = $derived(getPageLocale());
  const labels = $derived(getLabels(locale));

  let errorMessage = $state('');

  const toggleLanguage = async () => {
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
  };

  const langDisplay = $derived(locale === 'ko' ? 'English' : '한국어');
</script>

<div>
  <header class="header">
    <div class="title-container">
      <h1 class="title">{name}</h1>
      <div class="icons">
        {#if isHome}
          <div class="lang-toggle-wrapper">
            <button class="lang-toggle" onclick={toggleLanguage} aria-label={labels.toggleLanguage}>
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
              href={productLink}
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
              href={githubLink}
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
              href={linkedinLink}
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
    {#if role}
      <h2 class="role">{role}</h2>
    {/if}
    <h3 class="tagline">{tagline}</h3>
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
    justify-content: space-between;
    margin: 0 0 0.67em 0;
  }

  .title {
    font-size: 5rem;
    line-height: 1.1;
    margin: 0;
    word-break: keep-all;
  }

  .icons {
    align-items: center;
    display: flex;
    gap: 0.5rem;
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

  .lang-toggle-wrapper {
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .lang-toggle {
    background: transparent;
    border-radius: 8px;
    border: 1px solid var(--color-main);
    color: var(--color-main);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    transition: all 0.2s;
  }

  .lang-toggle-error {
    color: var(--color-error, #e53e3e);
    font-size: 0.75rem;
  }

  .icon {
    padding: var(--space-sm);
  }

  @media (max-width: 960px) {
    .title {
      font-size: 3rem;
    }
  }

  @media (max-width: 576px) {
    .title-container {
      flex-direction: column-reverse;
      justify-content: flex-start;
    }

    .icons {
      justify-content: flex-end;
      width: 100%;
    }

    .title {
      justify-content: flex-start;
      width: 100%;
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
