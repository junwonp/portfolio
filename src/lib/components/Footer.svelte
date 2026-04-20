<script lang="ts">
  import { GITHUB_PROFILE, GITHUB_USERNAME } from '$lib/data/constants';
  import { getLabels } from '$lib/data/labels';
  import { getPageLocale } from '$lib/utils/locale';

  let labels = $derived(getLabels(getPageLocale()));
</script>

<footer class="wrapper">
  <a
    href={GITHUB_PROFILE}
    target="_blank"
    rel="author me external noopener noreferrer"
    title={labels.goToGithubProfile}
  >
    <p class="link-text">{`@${GITHUB_USERNAME}`}</p>
  </a>
</footer>

<style>
  .wrapper {
    display: flex;
    border-top: 1px solid var(--color-bg-divider);
    padding: var(--space-sm);
    justify-content: center;
  }

  .link-text {
    margin: 0 var(--space-lg);
  }
</style>
