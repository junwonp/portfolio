<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href: string;
    title: string;
    ariaLabel?: string;
    children: Snippet;
    type?: 'github' | 'linkedin' | 'normal';
    class?: string;
  }

  let {
    href,
    title,
    ariaLabel,
    children,
    type = 'normal',
    class: className = '',
  }: Props = $props();
</script>

<a
  {href}
  target="_blank"
  rel={type === 'github' ? 'external noopener noreferrer' : 'noopener noreferrer'}
  class="icon-link {type} {className}"
  {title}
  aria-label={ariaLabel || title}
  data-sveltekit-reload={type === 'github' ? '' : undefined}
>
  {@render children()}
</a>

<style>
  .icon-link {
    align-items: center;
    align-self: center;
    border-radius: 50%;
    color: var(--color-main);
    display: flex;
    justify-content: center;
    padding: var(--space-xs);
    text-decoration: none;
    transition:
      background 0.2s,
      color 0.2s,
      transform 0.1s;
  }

  .icon-link:active {
    transform: scale(0.9);
  }

  .icon-link.github:hover {
    background: #24292e;
    color: #ffffff;
  }

  .icon-link.linkedin:hover {
    background: #0077b5;
    color: #ffffff;
  }

  .icon-link.normal:hover {
    background: var(--color-bg-divider);
    color: var(--color-primary);
  }

  :global(.icon-link svg) {
    pointer-events: none;
  }
</style>
