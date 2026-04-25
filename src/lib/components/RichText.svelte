<script lang="ts">
  import type { TextPart } from '$lib/utils/markdown';

  interface Props {
    parts: TextPart[];
  }

  let { parts }: Props = $props();
</script>

{#each parts as part, i (i)}
  {#if part.type === 'bold'}
    <strong>{part.text}</strong>
  {:else if part.type === 'code'}
    <code>{part.text}</code>
  {:else}
    {part.text}
  {/if}
{/each}
