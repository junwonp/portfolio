<script lang="ts">
  import ImageGallery from '$lib/components/ImageGallery.svelte';

  interface Props {
    imageCount?: number;
  }

  let { imageCount = 3 }: Props = $props();

  let indices = $derived(Array.from({ length: imageCount }, (_, i) => i));
</script>

<ImageGallery>
  {#each indices as i (i)}
    <figure data-testid="gallery-item-{i}">
      <img src="/img{i}.jpg" alt="img {i}" />
    </figure>
  {/each}
</ImageGallery>
