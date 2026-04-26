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

  const VELOCITY_THRESHOLD = 0.3; // px/ms
  const DRAG_THRESHOLD_RATIO = 0.25;

  let activeIndex = $state<number | null>(null);
  let chromeVisible = $state(true);
  let dragX = $state(0);
  let hasDragged = false;
  let isDragging = $state(false);
  let isMobile = $state(false);
  let isSnapping = $state(false);
  let overlayEl = $state<HTMLDivElement | undefined>(undefined);
  let startX = 0;

  type Sample = { x: number; t: number };
  let velocitySamples: Sample[] = [];

  const activeImage = $derived(activeIndex !== null ? images[activeIndex] : null);
  const atEnd = $derived(activeIndex !== null && activeIndex === images.length - 1);
  const atStart = $derived(activeIndex === 0);
  const dotIndices = $derived(images.map((_, i) => i));
  const nextImage = $derived(
    activeIndex !== null && activeIndex < images.length - 1 ? images[activeIndex + 1] : null,
  );
  const prevImage = $derived(
    activeIndex !== null && activeIndex > 0 ? images[activeIndex - 1] : null,
  );

  function getSrc(image: LightboxImage) {
    return isMobile && image.mobileSrc ? image.mobileSrc : image.src;
  }

  function close(): void {
    activeIndex = null;
    dragX = 0;
  }

  function toggleChrome(): void {
    chromeVisible = !chromeVisible;
  }

  function next(): void {
    if (activeIndex === null || activeIndex === images.length - 1) return;
    activeIndex++;
  }

  function open(index: number): void {
    activeIndex = index;
    chromeVisible = true;
    dragX = 0;
  }

  function prev(): void {
    if (activeIndex === null || activeIndex === 0) return;
    activeIndex--;
  }

  function onOverlayClick(e: MouseEvent): void {
    if (hasDragged) {
      hasDragged = false;
      return;
    }
    const target = e.target as HTMLElement;
    // Ignore clicks on interactive elements (buttons handle their own actions)
    if (target.closest('button')) return;
    toggleChrome();
  }

  function onKeydown(e: KeyboardEvent): void {
    if (activeIndex === null) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    const velocity = getVelocity();
    const containerWidth = overlayEl?.offsetWidth ?? window.innerWidth;
    const threshold = containerWidth * DRAG_THRESHOLD_RATIO;

    const shouldGoNext = (dragX < -threshold || velocity < -VELOCITY_THRESHOLD) && !atEnd;
    const shouldGoPrev = (dragX > threshold || velocity > VELOCITY_THRESHOLD) && !atStart;

    if (shouldGoNext) {
      void navigateWithAnimation('next', containerWidth);
    } else if (shouldGoPrev) {
      void navigateWithAnimation('prev', containerWidth);
    } else {
      isSnapping = true;
      dragX = 0;
      setTimeout(() => {
        isSnapping = false;
      }, 350);
    }
  }

  function getVelocity(): number {
    if (velocitySamples.length < 2) return 0;
    const first = velocitySamples[0];
    const last = velocitySamples[velocitySamples.length - 1];
    const dt = last.t - first.t;
    return dt > 0 ? (last.x - first.x) / dt : 0;
  }

  function moveDrag(x: number) {
    if (!isDragging) return;
    let offset = x - startX;
    if (Math.abs(offset) > 5) hasDragged = true;

    // Rubber-band resistance at edges
    if (atStart && offset > 0) offset = offset * 0.3;
    else if (atEnd && offset < 0) offset = offset * 0.3;

    dragX = offset;
    recordSample(x);
  }

  function recordSample(x: number) {
    const now = performance.now();
    velocitySamples.push({ x, t: now });
    const cutoff = now - 100;
    velocitySamples = velocitySamples.filter((s) => s.t >= cutoff);
  }

  function startDrag(x: number) {
    if (isSnapping) return;
    isDragging = true;
    hasDragged = false;
    startX = x;
    dragX = 0;
    velocitySamples = [{ x, t: performance.now() }];
  }

  async function navigateWithAnimation(direction: 'next' | 'prev', containerWidth: number) {
    // Animate to reveal the pre-rendered adjacent slide (no blank screen)
    isSnapping = true;
    dragX = direction === 'next' ? -containerWidth : containerWidth;
    await new Promise((r) => setTimeout(r, 300));
    // Atomically disable transition + reset offset + update index
    isSnapping = false;
    dragX = 0;
    if (direction === 'next') activeIndex = (activeIndex ?? 0) + 1;
    else activeIndex = (activeIndex ?? 1) - 1;
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

  $effect(() => {
    if (!overlayEl) return;
    const el = overlayEl;

    const onTouchStart = (e: TouchEvent) => {
      startDrag(e.touches[0].clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      moveDrag(e.touches[0].clientX);
    };
    const onTouchEnd = () => {
      endDrag();
    };

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button')) return;
      startDrag(e.clientX);
    };
    const onMouseMove = (e: MouseEvent) => {
      moveDrag(e.clientX);
    };
    const onMouseUp = () => {
      endDrag();
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });
</script>

<svelte:window onkeydown={onKeydown} />

<div class="lightbox-masonry" class:mobile={isMobile}>
  {#if isMobile && images.length > 1}
    <button
      class="masonry-item first-only"
      onclick={() => {
        open(0);
      }}
      aria-label="View all {images.length} images"
    >
      <img src={getSrc(images[0])} alt={images[0].alt} loading="lazy" />
      <div class="more-indicator">
        <div class="indicator-content">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span class="label">전체 {images.length}장의 사진 보기</span>
        </div>
      </div>
    </button>
  {:else}
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
  {/if}
</div>

{#if activeIndex !== null && activeImage !== null}
  <div
    class="overlay"
    class:chrome-hidden={!chromeVisible}
    role="dialog"
    tabindex={-1}
    aria-modal="true"
    aria-label="Image viewer"
    onclick={onOverlayClick}
    onkeydown={onKeydown}
    bind:this={overlayEl}
  >
    <!-- Close -->
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

    <!-- 3-slide carousel: prev / current / next always rendered -->
    <div class="overlay-image-area">
      <div class="carousel-track" class:snapping={isSnapping} style="--drag-x: {dragX}px">
        <div class="carousel-slide">
          {#if prevImage !== null}
            <img src={getSrc(prevImage)} alt={prevImage.alt} draggable="false" />
          {/if}
        </div>
        <div class="carousel-slide">
          <img src={getSrc(activeImage)} alt={activeImage.alt} draggable="false" />
        </div>
        <div class="carousel-slide">
          {#if nextImage !== null}
            <img src={getSrc(nextImage)} alt={nextImage.alt} draggable="false" />
          {/if}
        </div>
      </div>
    </div>

    <!-- Nav buttons: fixed left/right, above image (z-index) -->
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

    <!-- Footer: caption + dots, always outside the image area -->
    <div class="overlay-footer">
      {#if activeImage.caption}
        <p class="overlay-caption">{activeImage.caption}</p>
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
  </div>
{/if}

<style>
  /* ── Masonry grid ── */
  .lightbox-masonry {
    columns: 2;
    column-gap: 24px;
    margin-bottom: 48px;
  }

  .masonry-item {
    display: block;
    width: 100%;
    break-inside: avoid;
    margin-bottom: 24px;
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

  .more-indicator {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    transition: background 0.3s ease;
  }

  .masonry-item:hover .more-indicator {
    background: rgba(0, 0, 0, 0.55);
  }

  .indicator-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: #fff;
    padding: 20px;
  }

  .indicator-content svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    opacity: 0.9;
  }

  .indicator-content .label {
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  /* ── Overlay shell ── */
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.92);
    backdrop-filter: blur(8px);
    overflow: hidden;
    cursor: grab;
  }

  .overlay:active {
    cursor: grabbing;
  }

  /* Close button: top-right, above everything */
  .overlay-close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 20;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.2s,
      transform 0.2s,
      opacity 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .overlay-close:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: scale(1.1);
  }

  .overlay-close svg {
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  }

  /* Chrome hidden state: fade out close, nav, footer */
  .chrome-hidden .overlay-close,
  .chrome-hidden .overlay-nav,
  .chrome-hidden .overlay-footer {
    opacity: 0;
    pointer-events: none;
  }

  /* ── Image area: full overlay, extends behind the footer ── */
  .overlay-image-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  /* ── 3-slide carousel track ── */
  /* Width = 300% so each slide = 1 viewport width.
     translateX(-33.333%) = -100vw, centering the middle slide. */
  .carousel-track {
    display: flex;
    width: 300%;
    height: 100%;
    transform: translateX(calc(-33.333% + var(--drag-x, 0px)));
    will-change: transform;
  }

  .carousel-track.snapping {
    transition: transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .carousel-slide {
    flex: 0 0 33.333%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Removed padding that was causing empty space at the top */
    padding: 0;
  }

  .carousel-slide img {
    /* Fill the longer screen dimension */
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
    border-radius: 4px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    pointer-events: none;
    -webkit-user-drag: none;
    user-select: none;
  }

  /* ── Footer: caption + dots, always outside the image area ── */
  .overlay-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 24px;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.2) 60%,
      transparent 100%
    );
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    transition: opacity 0.3s ease;
  }

  .overlay-caption {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    margin: 0;
    line-height: 1.4;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    max-width: 560px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  /* ── Nav buttons: fixed position, above image (z-index: 20) ── */
  .overlay-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
    border-radius: 50%;
    padding: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.2s,
      transform 0.2s,
      opacity 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .overlay-nav:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: translateY(-50%) scale(1.1);
  }

  .overlay-nav.prev {
    left: 12px;
  }

  .overlay-nav.next {
    right: 12px;
  }

  .overlay-nav svg {
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  }

  /* ── Dots: inside footer, no longer absolutely positioned ── */
  .overlay-dots {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-shrink: 0;
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

  /* ── Mobile adjustments ── */
  @media (max-width: 640px) {
    .lightbox-masonry {
      columns: 1;
      gap: 16px;
    }

    .overlay-nav {
      padding: 12px;
    }

    .carousel-slide {
      padding-top: 0;
    }
  }
</style>
