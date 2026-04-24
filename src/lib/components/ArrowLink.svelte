<script lang="ts">
  interface Props {
    href: string;
    label: string;
    class?: string;
    color?: string; // Optional CSS color variable, e.g. "var(--color-primary)"
    reload?: boolean;
    target?: '_blank' | '_self' | '_parent' | '_top';
  }

  let {
    href,
    label,
    class: className = '',
    color = 'var(--color-primary)',
    reload = false,
    target = '_self',
  }: Props = $props();
</script>

<a
  {href}
  {target}
  class={['arrow-link', className].filter(Boolean).join(' ')}
  style:--link-color={color}
  style:--link-bg-hover={color.includes('var(--cat-color)')
    ? `color-mix(in srgb, var(--cat-color) 10%, transparent)`
    : 'var(--color-primary-transparent)'}
  data-sveltekit-reload={reload ? '' : undefined}
  rel={target === '_blank' ? 'noopener noreferrer' : undefined}
>
  {label} →
</a>

<style>
  .arrow-link {
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    color: var(--link-color);
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    margin-left: -0.5rem;
    border-radius: 4px;
    width: fit-content;
    transition:
      background-color 0.2s,
      transform 0.2s;
  }

  .arrow-link:hover {
    background-color: var(--link-bg-hover);
    text-decoration: underline;
    transform: translateX(2px);
  }
</style>
