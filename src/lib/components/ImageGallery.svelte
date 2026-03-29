<script lang="ts">
  import type { Snippet } from 'svelte';
  import { tick } from 'svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  const DRAG_THRESHOLD = 50;
  const MOBILE_BREAKPOINT = 768;

  let currentIndex = $state(0);
  let dragOffset = $state(0);
  let galleryContainer = $state<HTMLDivElement | undefined>(undefined);
  let isDragging = $state(false);
  let itemCount = $state(0);
  let isMobile = $state(false);
  let mouseCurrentX = 0;
  let mouseStartX = 0;
  let sliderContainer = $state<HTMLDivElement | undefined>(undefined);
  let touchCurrentX = 0;
  let touchStartX = 0;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  };

  const handleMouseEnd = () => {
    if (!isDragging) return;
    const diff = mouseCurrentX - mouseStartX;

    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff > 0) prev();
      else next();
    }

    isDragging = false;
    mouseStartX = 0;
    mouseCurrentX = 0;
    dragOffset = 0;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    mouseCurrentX = e.clientX;
    dragOffset = mouseCurrentX - mouseStartX;
  };

  const handleMouseStart = (e: MouseEvent) => {
    mouseStartX = e.clientX;
    mouseCurrentX = mouseStartX;
    isDragging = true;
    dragOffset = 0;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isMobile || !isDragging) return;
    e.stopPropagation();
    const diff = touchCurrentX - touchStartX;

    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff > 0) prev();
      else next();
    }

    isDragging = false;
    touchStartX = 0;
    touchCurrentX = 0;
    dragOffset = 0;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isMobile || !isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    touchCurrentX = e.touches[0].clientX;
    dragOffset = touchCurrentX - touchStartX;
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isMobile) return;
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
    isDragging = true;
    dragOffset = 0;
  };

  const next = () => {
    if (currentIndex < itemCount - 1) currentIndex++;
  };

  const prev = () => {
    if (currentIndex > 0) currentIndex--;
  };

  $effect(() => {
    const checkMobile = () => {
      isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });

  $effect(() => {
    if (!sliderContainer) return;

    const el = sliderContainer;
    const opts: AddEventListenerOptions = { passive: false };

    el.addEventListener('touchstart', handleTouchStart as EventListener, opts);
    el.addEventListener('touchmove', handleTouchMove as EventListener, opts);
    el.addEventListener('touchend', handleTouchEnd as EventListener, opts);
    el.addEventListener('touchcancel', handleTouchEnd as EventListener, opts);
    el.addEventListener('mousedown', handleMouseStart as EventListener);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseEnd);

    void tick().then(() => {
      itemCount = el.children.length;
    });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart as EventListener, opts);
      el.removeEventListener('touchmove', handleTouchMove as EventListener, opts);
      el.removeEventListener('touchend', handleTouchEnd as EventListener, opts);
      el.removeEventListener('touchcancel', handleTouchEnd as EventListener, opts);
      el.removeEventListener('mousedown', handleMouseStart as EventListener);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseEnd);
    };
  });

  $effect(() => {
    if (!galleryContainer || !isMobile || itemCount <= 1) return;

    const el = galleryContainer;
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Image gallery');
    el.addEventListener('keydown', handleKeyDown);

    return () => {
      el.removeAttribute('tabindex');
      el.removeAttribute('aria-label');
      el.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div class="image-gallery" class:mobile={isMobile} role="group" bind:this={galleryContainer}>
  {#if children}
    {#if isMobile}
      <div
        class="slider-container"
        class:dragging={isDragging}
        bind:this={sliderContainer}
        style="transform: translateX(calc(-{currentIndex} * 100% + {dragOffset}px))"
        draggable={false}
        role="presentation"
      >
        {@render children()}
      </div>
      {#if itemCount > 1}
        <div
          class="pager"
          aria-live="polite"
          aria-atomic="true"
          aria-label="Image {currentIndex + 1} of {itemCount}"
        >
          {currentIndex + 1}/{itemCount}
        </div>
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
    margin: 2rem -2rem;
    position: relative;
    touch-action: none;
    width: calc(100% + 4rem);
  }

  .image-gallery.mobile:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  @media (max-width: 576px) {
    .image-gallery.mobile {
      margin: 2rem -1.5rem;
      width: calc(100% + 3rem);
    }
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

  .image-gallery.mobile .slider-container :global(img),
  .image-gallery.mobile .slider-container :global(video) {
    user-select: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
    pointer-events: none;
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

  @media print {
    .image-gallery {
      display: flex !important;
      flex-wrap: wrap;
      overflow: visible;
      width: 100%;
      margin: 1rem 0;
    }

    /* reset mobile slider so all images show as a grid */
    .image-gallery.mobile {
      width: 100%;
      margin: 1rem 0;
    }

    .image-gallery.mobile .slider-container {
      flex-wrap: wrap;
      transform: none !important;
      width: 100%;
    }

    .image-gallery.mobile .slider-container :global(figure) {
      flex: 1 1 auto;
      max-width: calc(50% - 0.5rem);
    }

    .pager {
      display: none;
    }
  }
</style>
