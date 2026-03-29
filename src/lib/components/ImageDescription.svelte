<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    src: string;
    alt: string;
    mobileSrc?: string;
    priority?: boolean;
    width?: number;
    height?: number;
    children?: Snippet;
  }

  let { alt, children, height, mobileSrc, priority = false, src, width }: Props = $props();

  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.m4v'];
  const isVideo = videoExtensions.some((ext) => src.toLowerCase().endsWith(ext.toLowerCase()));
  let hasDimensions = $derived(!!(width && height));

  let videoEl = $state<HTMLVideoElement | undefined>(undefined);
  let imgEl = $state<HTMLImageElement | undefined>(undefined);
  let loaded = $state(false);

  const onLoad = () => {
    loaded = true;
  };

  $effect(() => {
    if (priority) {
      loaded = true;
      return;
    }
    if (!imgEl || loaded) return;
    if (imgEl.complete && imgEl.naturalWidth > 0) {
      loaded = true;
    }
  });

  $effect(() => {
    if (!videoEl) return;

    const el = videoEl;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!el.src) {
              el.src = src;
              el.load();
            }
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  });
</script>

<figure class="image-description">
  <div
    class="media-wrapper"
    class:loaded
    style={width && height ? `aspect-ratio: ${String(width)} / ${String(height)}` : undefined}
  >
    {#if !loaded && hasDimensions}
      <div class="skeleton" aria-hidden="true"></div>
    {/if}
    {#if isVideo}
      <video
        bind:this={videoEl}
        title={alt}
        loop
        muted
        playsinline
        preload="none"
        oncanplay={onLoad}
        class:loaded={loaded || !hasDimensions}
      >
        <track kind="captions" src="/captions/empty.vtt" label="No dialogue" default />
      </video>
    {:else if mobileSrc}
      <picture>
        <source media="(max-width: 768px)" srcset={mobileSrc} />
        <img
          bind:this={imgEl}
          {src}
          {alt}
          {width}
          {height}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : 'auto'}
          onload={onLoad}
          class:loaded={loaded || !hasDimensions}
        />
      </picture>
    {:else}
      <img
        bind:this={imgEl}
        {src}
        {alt}
        {width}
        {height}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        onload={onLoad}
        class:loaded={loaded || !hasDimensions}
      />
    {/if}
  </div>
  {#if children}
    <figcaption>{@render children()}</figcaption>
  {/if}
</figure>

<style>
  .image-description {
    margin: 2rem 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .media-wrapper {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
  }

  @keyframes skeleton-shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      var(--color-inline-bg) 0%,
      var(--color-disabled-bg) 50%,
      var(--color-inline-bg) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
  }

  .image-description img,
  .image-description video {
    max-width: 100%;
    max-height: 60vh;
    height: auto;
    object-fit: contain;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .image-description img.loaded,
  .image-description video.loaded {
    opacity: 1;
  }

  .image-description figcaption {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--color-sub);
    line-height: 1.6;
  }

  @media print {
    .skeleton {
      display: none;
    }

    .image-description img,
    .image-description video {
      opacity: 1 !important;
    }

    .image-description video {
      display: none;
    }
  }
</style>
