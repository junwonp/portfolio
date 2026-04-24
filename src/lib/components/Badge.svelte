<script lang="ts">
  interface Props {
    text: string;
    color?: 'primary' | 'green' | 'orange' | 'sub';
    class?: string;
  }

  let { text, color, class: className = '' }: Props = $props();

  const resolvedColor = $derived.by(() => {
    if (color) return color;
    if (text.match(/^\d{4}$/)) return 'green'; // Years (2026, etc.)
    return 'orange'; // Fallback for company names or status
  });
</script>

<span class={['badge', resolvedColor, className]}>
  {text}
</span>
