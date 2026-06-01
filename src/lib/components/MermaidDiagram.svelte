<script lang="ts">
  import { browser } from '$app/environment';

  interface Props {
    chart: string;
    eyebrow?: string;
    title: string;
  }

  let { chart, eyebrow = 'Diagram', title }: Props = $props();

  const renderId = `mermaid-${Math.random().toString(36).slice(2)}`;

  let errorMessage = $state('');
  let svg = $state('');

  function getCssVariable(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  $effect(() => {
    if (!browser) {
      return;
    }

    let isCancelled = false;

    async function renderDiagram(): Promise<void> {
      try {
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;
        const background = getCssVariable('--color-basic-bg');
        const border = getCssVariable('--color-bg-divider');
        const mutedBackground = getCssVariable('--color-code-bg');
        const primary = getCssVariable('--color-primary');
        const text = getCssVariable('--color-main');
        const titleText = getCssVariable('--color-bold');

        mermaid.initialize({
          flowchart: {
            curve: 'basis',
            useMaxWidth: true,
          },
          securityLevel: 'strict',
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            background,
            clusterBkg: mutedBackground,
            clusterBorder: border,
            edgeLabelBackground: background,
            fontFamily: 'Wanted Sans, sans-serif',
            lineColor: primary,
            mainBkg: background,
            nodeBorder: border,
            primaryBorderColor: border,
            primaryColor: background,
            primaryTextColor: titleText,
            secondaryColor: mutedBackground,
            secondaryTextColor: text,
            tertiaryColor: mutedBackground,
            tertiaryTextColor: text,
          },
        });

        const result = await mermaid.render(renderId, chart);

        if (isCancelled) {
          return;
        }

        errorMessage = '';
        svg = result.svg;
      } catch (error: unknown) {
        if (isCancelled) {
          return;
        }

        errorMessage = error instanceof Error ? error.message : 'Failed to render diagram.';
        svg = '';
      }
    }

    svg = '';
    errorMessage = '';
    void renderDiagram();

    return () => {
      isCancelled = true;
    };
  });
</script>

<figure class="mermaid-diagram" aria-label={title}>
  <figcaption class="diagram-header">
    <span>{eyebrow}</span>
    <strong>{title}</strong>
  </figcaption>
  <div class="diagram-frame">
    {#if svg}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <div class="diagram-surface">{@html svg}</div>
    {:else if errorMessage}
      <p class="diagram-error">{errorMessage}</p>
      <pre class="diagram-fallback">{chart}</pre>
    {:else}
      <div class="diagram-loading">Rendering diagram...</div>
    {/if}
  </div>
</figure>

<style>
  .mermaid-diagram {
    display: grid;
    gap: 12px;
    margin: 24px 0 32px;
    padding: var(--space-sm);
    border: 1px solid var(--color-bg-divider);
    border-radius: 14px;
    background: var(--color-basic-bg);
    overflow: hidden;
  }

  .diagram-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    padding: 2px 2px 0;
  }

  .diagram-header span {
    flex-shrink: 0;
    border: 1px solid var(--color-bg-divider);
    border-radius: 999px;
    padding: 5px 10px;
    background: var(--color-code-bg);
    color: var(--color-primary);
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  .diagram-header strong {
    color: var(--color-bold);
    font-size: 0.95rem;
    line-height: 1.4;
    text-align: right;
  }

  .diagram-frame {
    border: 1px solid var(--color-bg-subdivider);
    border-radius: 10px;
    background: var(--color-table-bg);
    overflow-x: auto;
  }

  .diagram-surface {
    display: grid;
    min-width: 0;
    padding: 4px var(--space-sm) var(--space-sm);
    place-items: center;
  }

  .diagram-loading,
  .diagram-error,
  .diagram-fallback {
    margin: 0;
    color: var(--color-main);
    font-family: var(--font-family-code);
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .diagram-loading {
    padding: var(--space-md);
    text-align: center;
  }

  .diagram-error {
    padding: var(--space-sm) var(--space-sm) 0;
    color: var(--color-error);
    font-weight: 700;
  }

  .diagram-fallback {
    padding: var(--space-sm);
    white-space: pre-wrap;
  }

  :global(.mermaid-diagram svg) {
    display: block;
    max-width: 100%;
    height: auto;
    font-family: var(--font-family-text), sans-serif !important;
  }

  :global(.mermaid-diagram svg .node rect),
  :global(.mermaid-diagram svg .node circle),
  :global(.mermaid-diagram svg .node polygon),
  :global(.mermaid-diagram svg .node path) {
    fill: var(--color-basic-bg) !important;
    stroke: var(--color-bg-divider) !important;
    stroke-width: 1.4px !important;
    transition:
      fill 0.2s ease,
      stroke 0.2s ease,
      filter 0.2s ease;
  }

  :global(.mermaid-diagram svg .node:hover rect),
  :global(.mermaid-diagram svg .node:hover circle),
  :global(.mermaid-diagram svg .node:hover polygon),
  :global(.mermaid-diagram svg .node:hover path) {
    fill: var(--color-code-bg) !important;
    stroke: var(--color-primary) !important;
  }

  :global(.mermaid-diagram svg .node .label) {
    font-weight: 700 !important;
    line-height: 1.35 !important;
    color: var(--color-bold) !important;
    fill: var(--color-bold) !important;
    overflow: visible !important;
    transition: fill 0.2s ease;
  }

  :global(.mermaid-diagram svg foreignObject),
  :global(.mermaid-diagram svg .label div),
  :global(.mermaid-diagram svg .label span),
  :global(.mermaid-diagram svg .nodeLabel) {
    line-height: 1.35 !important;
    overflow: visible !important;
  }

  :global(.mermaid-diagram svg .node:hover .label) {
    fill: var(--color-primary) !important;
  }

  :global(.mermaid-diagram svg .edgePath .path) {
    stroke: var(--color-primary) !important;
    stroke-width: 1.6px !important;
    transition:
      stroke 0.2s ease,
      stroke-width 0.2s ease;
  }

  :global(.mermaid-diagram svg .edgePath:hover .path) {
    stroke: var(--color-primary) !important;
    stroke-width: 2px !important;
  }

  :global(.mermaid-diagram svg .marker) {
    fill: var(--color-primary) !important;
    stroke: none !important;
    transition: fill 0.2s ease;
  }

  :global(.mermaid-diagram svg .cluster rect) {
    fill: color-mix(in srgb, var(--color-basic-bg) 60%, transparent) !important;
    stroke: var(--color-bg-divider) !important;
    stroke-width: 1px !important;
    stroke-dasharray: 4 4 !important;
    rx: 12px !important;
    ry: 12px !important;
  }

  @media (max-width: 720px) {
    .mermaid-diagram {
      border-radius: 12px;
      padding: var(--space-sm);
    }

    .diagram-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .diagram-header strong {
      text-align: left;
    }

    .diagram-surface {
      padding: 4px 10px 10px;
    }
  }
</style>
