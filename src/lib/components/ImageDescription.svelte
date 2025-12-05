<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    src: string;
    alt: string;
    children?: Snippet;
  }

  let { src, alt, children }: Props = $props();

  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.m4v'];
  const isVideo = videoExtensions.some((ext) => src.toLowerCase().endsWith(ext.toLowerCase()));
</script>

<figure class="image-description">
  {#if isVideo}
    <video {src} title={alt} autoplay loop muted playsinline>
      <source {src} type={`video/${src.split('.').pop() ?? 'mp4'}`} />
    </video>
  {:else}
    <img {src} {alt} loading="lazy" />
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
