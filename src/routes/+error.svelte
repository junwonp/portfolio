<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { getLabels } from '$lib/data/labels';
  import type { Language } from '$lib/utils/language';

  const errorStatus = page.status || 500;

  const locale = $derived((page.data.locale as Language | undefined) ?? 'en');
  const labels = $derived(getLabels(locale));

  const errorMessage = $derived(page.error?.message || labels.errorOccurred);

  const goHome = () => {
    void goto(resolve('/'));
  };
</script>

<svelte:head>
  <title>
    {errorStatus === 404 ? `404 - ${labels.pageNotFound}` : labels.errorOccurred}
  </title>
</svelte:head>

<div class="error-wrapper">
  <div class="error-content">
    <h1 class="error-code">{errorStatus}</h1>
    <h2 class="error-message">
      {#if errorStatus === 404}
        {labels.pageNotFound}
      {:else}
        {labels.errorOccurred}
      {/if}
    </h2>
    {#if errorMessage && errorStatus !== 404}
      <p class="error-detail">{errorMessage}</p>
    {/if}
    <button class="home-button" onclick={goHome}>{labels.goHome}</button>
  </div>
</div>

<style>
  .error-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    background-color: var(--color-basic-bg);
  }

  .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    padding: 2rem;
    text-align: center;
  }

  .error-code {
    font-size: 8rem;
    font-weight: bold;
    margin: 0;
    line-height: 1;
    color: var(--color-bold);
  }

  .error-message {
    font-size: 2rem;
    margin: 1rem 0;
    color: var(--color-bold);
  }

  .error-detail {
    font-size: 1rem;
    color: var(--color-sub);
    margin: 1rem 0;
  }

  .home-button {
    margin-top: 2rem;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    background-color: var(--color-primary-bg);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .home-button:hover {
    opacity: 0.85;
  }

  .home-button:focus-visible {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
    opacity: 1;
  }

  @media (max-width: 768px) {
    .error-code {
      font-size: 5rem;
    }

    .error-message {
      font-size: 1.5rem;
    }
  }
</style>
