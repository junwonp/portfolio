<script lang="ts">
  import Period from '$lib/components/Period.svelte';
  import type { EducationProps } from '$lib/types/about';

  interface Props {
    education: EducationProps[];
  }
  let { education }: Props = $props();
</script>

<div class="education-list">
  {#each education as item (item.school)}
    <div class="item">
      <div class="info">
        <h3 class="school">{item.school}</h3>
        {#if item.major}
          <p class="major">{item.major}</p>
        {/if}
      </div>
      <div class="date-wrapper">
        <Period dateFrom={item.dateFrom} dateTo={item.dateTo} />
      </div>
    </div>
  {/each}
</div>

<style>
  .education-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-top: var(--space-md);
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .school {
    font-size: var(--font-h3);
    font-weight: 700;
    margin: 0;
    color: var(--color-bold);
  }

  .major {
    font-size: 0.9375rem;
    color: var(--color-main);
    margin: 0;
  }

  .date-wrapper {
    flex-shrink: 0;
    text-align: right;
    font-size: 0.875rem;
    color: var(--color-placeholder);
    padding-top: 0.125rem;
  }

  @media (max-width: 768px) {
    .item {
      flex-direction: column;
      gap: 0.5rem;
    }
    .date-wrapper {
      text-align: left;
    }
  }
</style>
