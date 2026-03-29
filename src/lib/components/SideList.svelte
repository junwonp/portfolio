<script lang="ts">
  interface Props {
    title: string;
    list: string[];
  }
  let { list, title }: Props = $props();
</script>

<div class="wrapper">
  <h3>{title}</h3>
  <ul>
    {#each list as item, index (index)}
      <li>{item}</li>
    {/each}
  </ul>
</div>

<style>
  .wrapper {
    margin: var(--space-xs);
  }
</style>
