"use client";

import { useEffect, useState } from "react";

export function useDeferredClientRender(timeoutMs = 1200): boolean {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;

    const render = () => {
      setShouldRender(true);
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(render, { timeout: timeoutMs });

      return () => {
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(render, timeoutMs);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [shouldRender, timeoutMs]);

  return shouldRender;
}
