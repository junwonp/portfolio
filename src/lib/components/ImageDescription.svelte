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

  let { src, alt, mobileSrc, priority = false, width, height, children }: Props = $props();

  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.m4v'];
  const isVideo = videoExtensions.some((ext) => src.toLowerCase().endsWith(ext.toLowerCase()));

  let videoEl = $state<HTMLVideoElement | undefined>(undefined);

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
  {#if isVideo}
    <video bind:this={videoEl} title={alt} loop muted playsinline preload="none">
      <track kind="captions" src="/captions/empty.vtt" label="No dialogue" default />
    </video>
  {:else if mobileSrc}
    <picture>
      <source media="(max-width: 768px)" srcset={mobileSrc} />
      <img
        {src}
        {alt}
        {width}
        {height}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
      />
    </picture>
  {:else}
    <img
      {src}
      {alt}
      {width}
      {height}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : 'auto'}
    />
  {/if}
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

  .image-description img,
  .image-description video {
    max-width: 100%;
    max-height: 60vh;
    height: auto;
    border-radius: 8px;
    object-fit: contain;
  }

  .image-description figcaption {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--color-sub);
    line-height: 1.6;
  }
</style>
