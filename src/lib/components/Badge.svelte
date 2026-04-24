<script lang="ts">
  interface Props {
    text: string;
    color?: 'primary' | 'green' | 'orange' | 'sub';
    class?: string;
  }

  let { text, color, class: className = '' }: Props = $props();

  const resolvedColor = $derived.by(() => {
    if (color) return color;
    const t = text.toLowerCase();
    if (t === 'android' || t === '현재' || t === 'present') return 'green';
    if (t === 'ios') return 'primary';
    if (t === 'web') return 'orange';
    if (text.match(/^\d{4}$/)) return 'green'; // Years (2026, etc.)
    return 'orange'; // Fallback for company names or status
  });
</script>

<span class={['badge', resolvedColor, className].filter(Boolean).join(' ')}>
  {text}
</span>
