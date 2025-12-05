<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  let container: HTMLDivElement;
  let sliderContainer = $state<HTMLDivElement | undefined>(undefined);
  let isMobile = $state(false);
  let currentIndex = $state(0);
  let touchStartX = 0;
  let touchCurrentX = 0;
  let isDragging = $state(false);
  let itemCount = $state(0);
  let dragOffset = $state(0);

  onMount(() => {
    const checkMobile = () => {
      isMobile = window.innerWidth < 768;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });

  const updateItemCount = () => {
    if (sliderContainer) {
      itemCount = sliderContainer.children.length;
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isMobile) return;
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
    isDragging = true;
    dragOffset = 0;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isMobile || !isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    touchCurrentX = e.touches[0].clientX;
    dragOffset = touchCurrentX - touchStartX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isMobile || !isDragging) return;
    e.stopPropagation();
    const diff = touchCurrentX - touchStartX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        currentIndex--;
      } else if (diff < 0 && currentIndex < itemCount - 1) {
        currentIndex++;
      }
    }

    isDragging = false;
    touchStartX = 0;
    touchCurrentX = 0;
    dragOffset = 0;
  };

  $effect(() => {
    if (sliderContainer) {
      setTimeout(updateItemCount, 100);
    }
  });
</script>

<div class="image-gallery" class:mobile={isMobile} bind:this={container}>
  {#if children}
    {#if isMobile}
      <div
        class="slider-container"
        class:dragging={isDragging}
        bind:this={sliderContainer}
        style="transform: translateX(calc(-{currentIndex} * 100% + {dragOffset}px))"
        ontouchstart={handleTouchStart}
        ontouchmove={handleTouchMove}
        ontouchend={handleTouchEnd}
        ontouchcancel={handleTouchEnd}
      >
        {@render children()}
      </div>
      {#if itemCount > 1}
        <div class="pager">{currentIndex + 1}/{itemCount}</div>
      {/if}
    {:else}
      {@render children()}
    {/if}
  {/if}
</div>

<style>
  .image-gallery {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    align-items: flex-start;
    margin: 2rem 0;
  }

  .image-gallery.mobile {
    overflow: hidden;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding: 0;
    margin: 0;
    position: relative;
    touch-action: none;
  }

  .image-gallery.mobile .slider-container {
    display: flex;
    flex-direction: row;
    gap: 0;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
    padding: 0;
    touch-action: none;
    width: 100%;
  }

  .image-gallery.mobile .slider-container.dragging {
    transition: none;
  }

  .image-gallery.mobile .slider-container :global(figure) {
    flex: 0 0 100%;
    max-width: 100%;
    margin: 0;
    scroll-snap-align: start;
  }

  .image-gallery.mobile .pager {
    position: absolute;
    bottom: 0.5rem;
    right: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font-size: 0.75rem;
    line-height: 1;
  }

  .image-gallery :global(figure) {
    margin: 0;
    flex: 1;
    min-width: 0;
    max-width: calc(50% - 0.5rem);
  }

  .image-gallery :global(figure img),
  .image-gallery :global(figure video) {
    max-width: 100%;
    max-height: 60vh;
  }
</style>
