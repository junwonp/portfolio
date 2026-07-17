'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import styles from './MermaidDiagram.module.css';

interface Props {
  chart: string;
  eyebrow?: string;
  title: string;
}

const LIGHT_COLORS = {
  background: '#ffffff',
  border: '#dbe0e2',
  mutedBackground: '#f7f9fa',
  primary: '#2e6ebe',
  text: '#484848',
  titleText: '#000000',
};

const DARK_COLORS = {
  background: '#1a202c',
  border: '#3f495e',
  mutedBackground: '#262d3b',
  primary: '#7daff0',
  text: '#d4dbde',
  titleText: '#d4dbde',
};

export default function MermaidDiagram({ chart, eyebrow = 'Diagram', title }: Props) {
  const renderId = useId().replaceAll(':', '-');
  const [errorMessage, setErrorMessage] = useState('');
  const [svg, setSvg] = useState('');
  const [renderedChart, setRenderedChart] = useState('');
  const frameRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    let isCancelled = false;

    const requestRender = () => {
      window.setTimeout(() => {
        if (!isCancelled) {
          setShouldRender(true);
        }
      }, 0);
    };

    if (!frame) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    const isInitiallyVisible = rect.top < window.innerHeight + 200;

    if (isInitiallyVisible) {
      requestRender();
      return () => {
        isCancelled = true;
      };
    }

    if (typeof IntersectionObserver === 'undefined') {
      requestRender();
      return () => {
        isCancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
      }
    );

    observer.observe(frame);

    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    let isCancelled = false;

    async function renderDiagram(): Promise<void> {
      try {
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;

        const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
        const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

        mermaid.initialize({
          flowchart: {
            curve: 'basis',
            useMaxWidth: true,
          },
          securityLevel: 'strict',
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            background: colors.background,
            clusterBkg: colors.mutedBackground,
            clusterBorder: colors.border,
            edgeLabelBackground: colors.background,
            fontFamily: 'Wanted Sans, sans-serif',
            lineColor: colors.primary,
            mainBkg: colors.background,
            nodeBorder: colors.border,
            primaryBorderColor: colors.border,
            primaryColor: colors.background,
            primaryTextColor: colors.titleText,
            secondaryColor: colors.mutedBackground,
            secondaryTextColor: colors.text,
            tertiaryColor: colors.mutedBackground,
            tertiaryTextColor: colors.text,
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
  }, [chart, renderId, shouldRender]);

  return (
    <figure ref={frameRef} className={styles['mermaid-diagram']} aria-label={title}>
      <figcaption className={styles['diagram-header']}>
        <span>{eyebrow}</span>
        <strong>{title}</strong>
      </figcaption>
      <div className={styles['diagram-frame']}>
        {shouldRender && svg && renderedChart === chart ? (
          <div
            className={styles['diagram-surface']}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : shouldRender && errorMessage && renderedChart === chart ? (
          <>
            <p className={styles['diagram-error']}>{errorMessage}</p>
            <pre className={styles['diagram-fallback']}>{chart}</pre>
          </>
        ) : (
          <div className={styles['diagram-loading']}>
            {shouldRender ? 'Rendering diagram...' : 'Diagram will load when visible.'}
          </div>
        )}
      </div>
    </figure>
  );
}
