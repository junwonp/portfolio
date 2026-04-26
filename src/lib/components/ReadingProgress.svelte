<script lang="ts">
  let progress = $state(0);

  $effect(() => {
    function update() {
      const el = document.documentElement;
      progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    }

    window.addEventListener('scroll', update, { passive: true });
    return () => {
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
