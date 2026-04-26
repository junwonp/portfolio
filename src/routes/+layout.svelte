<script lang="ts">
  import 'normalize.css';
  import '../app.css';
  import '$lib/styles/prism-gruvbox-light.css';
  import '$lib/styles/prism-gruvbox-dark.css';

  import type { Snippet } from 'svelte';

  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import favicon from '$lib/assets/favicon.svg';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ReadingProgress from '$lib/components/ReadingProgress.svelte';
  import { GITHUB_USERNAME, LINKEDIN_PROFILE, PORTFOLIO_URL } from '$lib/data/constants';
  import type { Language } from '$lib/utils/language';
  import { getMetadata } from '$lib/utils/metadata';

  interface Props {
    children: Snippet;
    data: { locale: Language };
  }

  let { children, data }: Props = $props();

  let canonicalUrl = $derived(`${PORTFOLIO_URL}${page.url.pathname}`);
  let currentLang = $derived(data.locale);
  let metadata = $derived(getMetadata(currentLang));
  let jsonLd = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Junwon Park',
      jobTitle: 'Front-end Developer',
      url: PORTFOLIO_URL,
      sameAs: [PORTFOLIO_URL, LINKEDIN_PROFILE],
      image: `${PORTFOLIO_URL}/images/preview.webp`,
      description: metadata.schemaDescription,
    }),
  );

  $effect(() => {
    if (browser) {
      document.documentElement.lang = currentLang;
    }
  });

  $effect(() => {
    if (!browser) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  });

  let isProjectPage = $derived(page.url.pathname.startsWith('/projects/'));

  $effect(() => {
    if (!browser) return;

    void page.url.pathname;

    void (async () => {
      const { default: mermaid } = await import('mermaid');
      mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'WantedSansVariable, system-ui, sans-serif',
      });

      const nodes = document.querySelectorAll<HTMLElement>('.language-mermaid');
      for (const node of nodes) {
        // Decode HTML entities (like &gt;) before mermaid processes them
        const rawContent = node.textContent || '';
        const decodedContent = rawContent
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/&amp;/g, '&');
        node.textContent = decodedContent;
      }

      await mermaid.run({
        nodes,
      });
    })();
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{metadata.title}</title>
  <meta name="author" content="Junwon Park" />
  <meta name="description" content={metadata.description} />

  <meta name="robots" content="noindex, nofollow" />
  <link rel="canonical" href={canonicalUrl} />

  <link rel="alternate" hreflang="ko" href={canonicalUrl} />
  <link rel="alternate" hreflang="en" href={canonicalUrl} />
  <link rel="alternate" hreflang="x-default" href={canonicalUrl} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={metadata.ogTitle} />
  <meta property="og:description" content={metadata.ogDescription} />
  <meta property="og:image" content={`${PORTFOLIO_URL}/images/preview.webp`} />
  <meta property="og:image:width" content="2400" />
  <meta property="og:image:height" content="1260" />
  <meta property="og:image:type" content="image/webp" />
  <meta property="og:image:alt" content={metadata.imageAlt} />
  <meta property="og:site_name" content={metadata.siteName} />
  <meta property="og:locale" content={metadata.locale} />
  <meta property="og:locale:alternate" content={metadata.locale === 'ko_KR' ? 'en_US' : 'ko_KR'} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content={canonicalUrl} />
  <meta name="twitter:title" content={metadata.twitterTitle} />
  <meta name="twitter:description" content={metadata.twitterDescription} />
  <meta name="twitter:image" content={`${PORTFOLIO_URL}/images/preview.webp`} />
  <meta name="twitter:image:alt" content={metadata.imageAlt} />
  <meta name="twitter:site" content={`@${GITHUB_USERNAME}`} />

  <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FFFFFF" />
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0d1116" />

  <link
    rel="preload"
    href="/fonts/WantedSansVariable.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
    fetchpriority="high"
  />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html '<script type="application/ld+json">' + jsonLd + '<' + '/script>'}
</svelte:head>

<ReadingProgress />
<BottomNav isProject={isProjectPage} />

<a href="#main-content" class="skip-link">{metadata.skipLink}</a>

<div class="wrapper">
  <div class="content-wrapper">
    <main id="main-content" class="content" tabindex="-1">
      {@render children()}
    </main>
  </div>
  <div class="footer-wrapper">
    <Footer />
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
  }

  .content-wrapper {
    display: flex;
    justify-content: center;
    flex-grow: 1;
  }

  main.content {
    width: 800px;
    max-width: 100%;
    padding: 2rem;
  }

  @media (max-width: 576px) {
    main.content {
      padding: 1rem; /* Standard mobile padding (16px) */
    }
  }

  @media (max-width: 960px) {
    .wrapper {
      /* Extra bottom space for the fixed tab bar (approx 56px height + 1rem bottom + safe area) */
      padding-bottom: calc(64px + env(safe-area-inset-bottom));
    }
  }

  @media (min-width: 1024px) {
    main.content {
      width: 900px;
    }
  }

  @media (min-width: 1280px) {
    main.content {
      width: 1000px;
    }
  }

  @media (min-width: 1536px) {
    main.content {
      width: 1200px;
    }
  }

  @media print {
    .wrapper {
      padding-bottom: 0 !important;
      min-height: 0 !important;
    }

    main.content {
      max-width: none !important;
      padding: 0 !important;
      width: 100% !important;
    }

    .footer-wrapper {
      display: none !important;
    }
  }

  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-primary-bg);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    z-index: 100;
    border-radius: 0 0 4px 0;
  }

  .skip-link:focus {
    top: 0;
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
  }
</style>
