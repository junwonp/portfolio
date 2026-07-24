'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Measures the scrollHeight of a collapsed element (even when visually hidden
 * via grid-template-rows: 0fr) and exposes it as a CSS custom property so
 * CSS transitions can interpolate between explicit pixel values.
 *
 * This ensures simultaneous accordion open/close transitions stay perfectly
 * synchronized — no layout thrashing from competing `1fr` resolutions.
 */
export function useCollapseHeight(isOpen: boolean) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  // Callback ref: measure as soon as the DOM node is attached
  const ref = useCallback((node: HTMLDivElement | null) => {
    innerRef.current = node;
    if (node) {
      // scrollHeight reports the natural content height even when the
      // element is inside a 0fr grid track (overflow: hidden).
      setHeight(node.scrollHeight);
    }
  }, []);

  // Re-measure on content changes (e.g. project details toggled)
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setHeight(el.scrollHeight);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // When opening for the first time, measure synchronously in case
  // the ResizeObserver hasn't fired yet.
  useEffect(() => {
    if (isOpen && innerRef.current) {
      setHeight(innerRef.current.scrollHeight);
    }
  }, [isOpen]);

  const style = {
    '--collapse-height': `${height}px`,
  } as React.CSSProperties;

  return { ref, style };
}
