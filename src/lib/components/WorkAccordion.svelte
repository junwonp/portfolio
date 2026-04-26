<script lang="ts">
  import CompanyCard from '$lib/components/CompanyCard.svelte';
  import { getLabels } from '$lib/data/labels';
  import { skillState } from '$lib/states/skills.svelte';
  import type { WorkExperienceProps } from '$lib/types/about';
  import type { Language } from '$lib/utils/language';

  interface Props {
    experiences: WorkExperienceProps[];
    locale: Language;
  }

  let { experiences, locale }: Props = $props();

  let labels = $derived(getLabels(locale));
  let isFiltered = $derived(!skillState.isEmpty);
</script>

<div class="accordion">
  {#each experiences as exp (exp.companyName)}
    <CompanyCard {exp} {isFiltered} {labels} />
  {/each}
</div>

<style>
  .accordion {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>
