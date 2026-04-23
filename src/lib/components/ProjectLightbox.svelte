<script lang="ts">
  import { onMount } from 'svelte';

  export interface LightboxImage {
    src: string;
    mobileSrc?: string;
    alt: string;
    caption?: string;
  }

  interface Props {
    images: LightboxImage[];
  }

  let { images }: Props = $props();

  let activeIndex = $state<number | null>(null);
  let isMobile = $state(false);

  const activeImage = $derived(activeIndex !== null ? images[activeIndex] : null);
  const dotIndices = $derived(images.map((_, i) => i));

  // Determine current source based on device
  function getSrc(image: LightboxImage) {
    return isMobile && image.mobileSrc ? image.mobileSrc : image.src;
  }

  function open(index: number): void {
    activeIndex = index;
  }

  function close(): void {
    activeIndex = null;
  }

  function prev(): void {
    if (activeIndex === null) return;
    activeIndex = (activeIndex - 1 + images.length) % images.length;
  }

  function next(): void {
    if (activeIndex === null) return;
    activeIndex = (activeIndex + 1) % images.length;
  }

  function onOverlayClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) close();
  }

  function onKeydown(e: KeyboardEvent): void {
    if (activeIndex === null) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }

  onMount(() => {
    const checkMobile = () => {
      isMobile = window.innerWidth <= 640;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });
</script>

<svelte:window onkeydown={onKeydown} />

<div class="lightbox-masonry">
  {#each images as image, i (i)}
    <button
      class="masonry-item"
      onclick={() => {
        open(i);
      }}
      aria-label="View {image.alt} fullscreen"
    >
      <img src={getSrc(image)} alt={image.alt} loading="lazy" />
      <span class="zoom-hint" aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </span>
    </button>
  {/each}
</div>

{#if activeIndex !== null && activeImage !== null}
  <div
    class="overlay"
    role="dialog"
    tabindex={-1}
    aria-modal="true"
    aria-label="Image viewer"
    onclick={onOverlayClick}
    onkeydown={onKeydown}
  >
    <button class="overlay-close" onclick={close} aria-label="Close">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>

    {#if images.length > 1}
      <button class="overlay-nav prev" onclick={prev} aria-label="Previous image">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    {/if}

    <div class="overlay-content">
      <img src={getSrc(activeImage)} alt={activeImage.alt} />
      {#if activeImage.caption}
        <p class="overlay-caption">{activeImage.caption}</p>
      {/if}
    </div>

    {#if images.length > 1}
      <button class="overlay-nav next" onclick={next} aria-label="Next image">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    {/if}

    {#if images.length > 1}
      <div class="overlay-dots" aria-hidden="true">
        {#each dotIndices as i (i)}
          <button
            class="dot"
            class:active={i === activeIndex}
            onclick={() => {
              open(i);
            }}
            aria-label="Go to image {i + 1}"
          ></button>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .lightbox-masonry {
    columns: 2;
    column-gap: 12px;
    margin-bottom: 48px;
  }

  .masonry-item {
    display: block;
    width: 100%;
    break-inside: avoid;
    margin-bottom: 12px;
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid var(--color-bg-divider);
    background: var(--color-disabled-bg);
    cursor: zoom-in;
    padding: 0;
    transition:
      border-color 0.2s,
      transform 0.2s ease;
  }

  /* Force image to fill the frame width and override global max-height */
  .masonry-item img {
    width: 100% !important;
    height: auto !important;
    max-height: none !important;
    display: block;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .masonry-item:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--color-shadow);
  }

  .masonry-item:hover img {
    transform: scale(1.02);
  }

  .zoom-hint {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 8px;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    backdrop-filter: blur(4px);
  }

  .masonry-item:hover .zoom-hint {
    opacity: 1;
  }

  /* Overlay */
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.92);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .overlay-close {
    position: absolute;
    top: 24px;
    right: 24px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
    border-radius: 12px;
    padding: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    z-index: 10;
  }

  .overlay-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .overlay-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    z-index: 10;
  }

  .overlay-nav:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .overlay-nav.prev {
    left: 24px;
  }

  .overlay-nav.next {
    right: 24px;
  }

  .overlay-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    max-width: min(95vw, 1200px);
    max-height: 90vh;
    position: relative;
  }

  .overlay-content img {
    max-width: 100%;
    max-height: calc(90vh - 80px);
    object-fit: contain;
    border-radius: 4px;
    display: block;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  .overlay-caption {
    font-size: 15px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    margin: 0;
    line-height: 1.5;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .overlay-dots {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .dot.active {
    background: var(--color-primary);
    transform: scale(1.4);
    box-shadow: 0 0 10px var(--color-primary);
  }

  @media (max-width: 640px) {
    .lightbox-masonry {
      columns: 1;
      gap: 16px;
    }

    .overlay-nav {
      display: none;
    }

    .overlay-close {
      top: 16px;
      right: 16px;
    }
  }
</style>
