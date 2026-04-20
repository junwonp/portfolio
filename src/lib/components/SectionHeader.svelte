<script lang="ts">
  interface Props {
    title: string;
  }
  let { title }: Props = $props();
</script>

<div class="section-header">
  <h2>{title}</h2>
</div>

<style>
  .section-header {
    margin-top: var(--space-xl);
    margin-bottom: var(--space-md);
  }

  h2 {
    font-size: var(--font-h2);
    font-weight: 800;
    color: var(--color-bold);
    letter-spacing: -0.02em;
    margin: 0;
  }

  @media (max-width: 960px) {
    .section-header {
      margin-top: var(--space-lg);
    }
  }
</style>
