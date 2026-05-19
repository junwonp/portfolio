<script lang="ts">
  import {
    getPageScrollElement,
    getPageScrollHeight,
    getPageScrollY,
  } from '$lib/states/scrollSpy.svelte';

  let progress = $state(0);

  $effect(() => {
    function update() {
      const maxScrollY = getPageScrollHeight() - getPageScrollElement().clientHeight;
      progress = maxScrollY > 0 ? (getPageScrollY() / maxScrollY) * 100 : 0;
    }

    const scrollElement = getPageScrollElement();

    scrollElement.addEventListener('scroll', update, { passive: true });
    window.addEventListener('scroll', update, { passive: true });
    update();

    return () => {
      scrollElement.removeEventListener('scroll', update);
      window.removeEventListener('scroll', update);
    };
  });
</script>

<div class="progress-bar" style="width: {progress}%"></div>

<style>
  .progress-bar {
    background: var(--color-primary);
    height: 2px;
    left: 0;
    position: fixed;
    top: 0;
    transition: width 0.1s linear;
    z-index: 200;
  }

  @media print {
    .progress-bar {
      display: none !important;
    }
  }
</style>
