<script lang="ts">
  import ShareButton from '$lib/components/ShareButton.svelte';
  import { getLabels } from '$lib/data/labels';
  import { getPageLocale } from '$lib/utils/locale';

  let labels = $derived(getLabels(getPageLocale()));
</script>

<footer class="wrapper">
  <ShareButton variant="text" shareLabel={labels.shareFooter} copiedLabel={labels.linkCopied} />
</footer>

<style>
  .wrapper {
    align-items: center;
    border-top: 1px solid var(--color-bg-divider);
    display: flex;
    justify-content: center;
    padding: var(--space-sm);
  }
</style>
