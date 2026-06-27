'use client';

import { useEffect, useId, useState } from 'react';

import styles from './MermaidDiagram.module.css';

interface Props {
  chart: string;
  eyebrow?: string;
  title: string;
}

function getCssVariable(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function MermaidDiagram({ chart, eyebrow = 'Diagram', title }: Props) {
  const renderId = useId().replaceAll(':', '-');
  const [errorMessage, setErrorMessage] = useState('');
  const [svg, setSvg] = useState('');
  const [renderedChart, setRenderedChart] = useState('');

  useEffect(() => {
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

        setErrorMessage('');
        setSvg(result.svg);
        setRenderedChart(chart);
      } catch (error: unknown) {
        if (isCancelled) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : 'Failed to render diagram.');
        setSvg('');
        setRenderedChart(chart);
      }
    }

    void renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [chart, renderId]);

  return (
    <figure className={styles['mermaid-diagram']} aria-label={title}>
      <figcaption className={styles['diagram-header']}>
        <span>{eyebrow}</span>
        <strong>{title}</strong>
      </figcaption>
      <div className={styles['diagram-frame']}>
        {svg && renderedChart === chart ? (
          <div
            className={styles['diagram-surface']}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : errorMessage && renderedChart === chart ? (
          <>
            <p className={styles['diagram-error']}>{errorMessage}</p>
            <pre className={styles['diagram-fallback']}>{chart}</pre>
          </>
        ) : (
          <div className={styles['diagram-loading']}>Rendering diagram...</div>
        )}
      </div>
    </figure>
  );
}
