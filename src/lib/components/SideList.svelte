<script lang="ts">
  import SkillChip from '$lib/components/SkillChip.svelte';

  interface Props {
    title: string;
    list: string[];
  }
  let { list, title }: Props = $props();
</script>

<div class="wrapper">
  <h3>{title}</h3>
  <div class="tag-list">
    {#each list as item (item)}
      <SkillChip skill={item} />
    {/each}
  </div>
</div>

<style>
  .wrapper {
    margin: var(--space-xs);
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin-top: 0.5rem;
  }
</style>
