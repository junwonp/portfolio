<script lang="ts">
  import { Check, Share2 } from 'lucide-svelte';

  interface Props {
    copiedLabel: string;
    shareLabel: string;
    text?: string;
    title?: string;
    url?: string;
    variant?: 'icon' | 'text';
  }

  let { copiedLabel, shareLabel, text, title, url, variant = 'icon' }: Props = $props();

  let copied = $state(false);
  let timer = $state<ReturnType<typeof setTimeout> | null>(null);

  async function share(): Promise<void> {
    const shareUrl = url ?? window.location.href;

    if ('share' in navigator) {
      try {
        await navigator.share({ text, title, url: shareUrl });
        return;
      } catch (err) {
        // User cancelled — no feedback needed
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    await copyToClipboard(shareUrl);
  }

  async function copyToClipboard(shareUrl: string): Promise<void> {
    await navigator.clipboard.writeText(shareUrl);
    showCopied();
  }

  function showCopied(): void {
    copied = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

{#if variant === 'text'}
  <button
    class="share-btn-text"
    class:copied
    onclick={share}
    title={shareLabel}
    aria-label={shareLabel}
    aria-live="polite"
  >
    {#if copied}
      <Check size={15} strokeWidth={2.5} />
      <span>{copiedLabel}</span>
    {:else}
      <Share2 size={15} strokeWidth={2.5} />
      <span>{shareLabel}</span>
    {/if}
  </button>
{:else}
  <div class="share-wrapper">
    <button
      class="share-btn"
      onclick={share}
      title={shareLabel}
      aria-label={shareLabel}
      aria-live="polite"
    >
      {#if copied}
        <Check size={18} strokeWidth={2.5} />
      {:else}
        <Share2 size={18} strokeWidth={2.5} />
      {/if}
    </button>

    {#if copied}
      <div class="toast" role="status" aria-atomic="true">
        {copiedLabel}
      </div>
    {/if}
  </div>
{/if}

<style>
  /* ── icon variant ── */
  .share-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .share-btn {
    align-items: center;
    background: transparent;
    border-radius: 50%;
    border: none;
    color: var(--color-main);
    cursor: pointer;
    display: flex;
    justify-content: center;
    padding: var(--space-xs);
    transition:
      background 0.2s,
      color 0.2s,
      transform 0.1s;
  }

  .share-btn:hover {
    background: var(--color-bg-divider);
    color: var(--color-primary);
  }

  .share-btn:active {
    transform: scale(0.9);
  }

  .share-btn:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .toast {
    background: var(--color-main);
    border-radius: 6px;
    bottom: calc(100% + 8px);
    color: var(--color-basic-bg);
    font-size: 0.75rem;
    left: 50%;
    padding: 0.375rem 0.625rem;
    pointer-events: none;
    position: absolute;
    transform: translateX(-50%);
    white-space: nowrap;
    z-index: 10;
  }

  .toast::after {
    border-color: var(--color-main) transparent transparent transparent;
    border-style: solid;
    border-width: 4px 4px 0;
    bottom: -4px;
    content: '';
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
  }

  /* ── text variant ── */
  .share-btn-text {
    align-items: center;
    background: transparent;
    border-radius: 20px;
    border: 1px solid var(--color-bg-divider);
    color: var(--color-sub);
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 0.8125rem;
    gap: 0.375rem;
    padding: 0.4rem 0.875rem;
    transition:
      background 0.2s,
      border-color 0.2s,
      color 0.2s,
      transform 0.1s;
  }

  .share-btn-text:hover {
    background: color-mix(in srgb, var(--color-primary) 8%, transparent);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .share-btn-text:active {
    transform: scale(0.96);
  }

  .share-btn-text:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .share-btn-text.copied {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .share-btn-text span {
    line-height: 1;
  }
</style>
