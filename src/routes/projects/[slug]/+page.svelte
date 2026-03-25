<script lang="ts">
  import Title from '$lib/components/Title.svelte';
  import { getLabels } from '$lib/data/labels';

  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const { component: Component, metadata, slug, locale } = $derived(data);
  const labels = $derived(getLabels(locale));
</script>

<svelte:head>
  <title>
    {`${metadata.title || slug} | ${labels.project}`}
  </title>
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

<a href="/" class="back-link">{labels.goBack}</a>

<Title
  githubLink={metadata.githubLink || ''}
  productLink={metadata.productLink || ''}
  name={metadata.title || slug}
  role={metadata.role || ''}
  tagline={metadata.description || ''}
/>
<article>
  {#if Component}
    <Component />
  {:else}
    <p>{labels.contentLoadError}</p>
  {/if}
</article>

<style>
  .back-link {
    display: inline-block;
    font-size: 0.9rem;
    margin-bottom: var(--space-md);
  }

  @media print {
    .back-link {
      display: none;
    }
  }
</style>
