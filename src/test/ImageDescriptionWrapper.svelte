<script lang="ts">
  import ImageDescription from '$lib/components/ImageDescription.svelte';

  interface Props {
    src: string;
    alt: string;
    mobileSrc?: string;
    priority?: boolean;
    width?: number;
    height?: number;
    caption?: string;
  }

  let { src, alt, mobileSrc, priority, width, height, caption }: Props = $props();
</script>

<ImageDescription {src} {alt} {mobileSrc} {priority} {width} {height}>
  {#if caption}
    {caption}
  {/if}
</ImageDescription>
