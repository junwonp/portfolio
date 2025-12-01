<script lang="ts">
  import { page } from '$app/state';
  import { getLabels } from '$lib/data/labels';
  import type { Language } from '$lib/utils/language';

  const locale = $derived((page.data.locale as Language | undefined) ?? 'en');
  const labels = $derived(getLabels(locale));
</script>

<footer class="wrapper">
  <a
    href="https://github.com/junuuon"
    target="_blank"
    rel="author me external noopener noreferrer"
    aria-label={labels.goToGithubProfile}
    title={labels.goToGithubProfile}
  >
    <p class="link-text">@junuuon</p>
  </a>
</footer>

<style>
  .wrapper {
    display: flex;
    border-top: 1px solid var(--color-bg-divider);
    padding: 10px;
    justify-content: center;
  }

  .link-text {
    margin: 0px 20px;
  }
</style>
