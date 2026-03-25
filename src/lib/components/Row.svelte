<script lang="ts">
  import type { Snippet } from 'svelte';

  import Period from '$lib/components/Period.svelte';

  interface Props {
    additional?: Snippet;
    children?: Snippet;
    companyName: string;
    role: string;
    dateFrom: string;
    dateTo?: string;
  }

  const { additional, children, companyName, role, dateFrom, dateTo }: Props = $props();
</script>

<div class="row">
  <div class="left">
    <h3 class="company-name">{companyName}</h3>
    <span>{role}</span>
    <Period {dateFrom} {dateTo} />
    {#if additional}
      {@render additional()}
    {/if}
  </div>
  <div class="right">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .row {
    display: flex;
    padding: var(--space-row-padding) 0;

    @media (max-width: 960px) {
      flex-direction: column;
    }
  }

  .left {
    display: flex;
    flex-basis: 18rem;
    flex-direction: column;
    flex-shrink: 0;
    padding-right: 1rem;

    @media (max-width: 960px) {
      flex-basis: 100%;
      padding-bottom: 1rem;
      padding-right: 0;
    }
  }

  .company-name {
    margin-top: 0;
    margin-bottom: var(--space-xs);
  }

  .right {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    :global(> *:first-child) {
      padding-top: 0;
    }
  }
</style>
