// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Vitest globals are off, so RTL's auto-cleanup never registers; unmount explicitly.
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

import type { ProjectNavLinks } from '@/lib/stores/bottomNav';

// The store holds module-level singleton state, so each test re-imports a freshly reset module.
const loadProjectNavLinks = async () => {
  vi.resetModules();
  const { projectNavLinks } = await import('@/lib/stores/bottomNav');
  return projectNavLinks;
};

describe('project navigation links store', () => {
  it('starts with no links on a fresh module', async () => {
    const projectNavLinks = await loadProjectNavLinks();

    expect(projectNavLinks.get()).toBeNull();
  });

  it('delivers the current value immediately on subscription', async () => {
    const projectNavLinks = await loadProjectNavLinks();
    const seen: (ProjectNavLinks | null)[] = [];

    projectNavLinks.subscribe((value) => seen.push(value));

    expect(seen).toEqual([null]);

    projectNavLinks.set({ productLink: 'https://example.com/product' });

    const later: (ProjectNavLinks | null)[] = [];
    projectNavLinks.subscribe((value) => later.push(value));

    expect(later).toEqual([{ productLink: 'https://example.com/product' }]);
  });

  it('broadcasts to every listener and remembers the last value', async () => {
    const projectNavLinks = await loadProjectNavLinks();
    const first = vi.fn();
    const second = vi.fn();

    projectNavLinks.subscribe(first);
    projectNavLinks.subscribe(second);
    first.mockClear();
    second.mockClear();

    projectNavLinks.set({ githubLink: 'https://github.com/junwonp' });

    expect(first).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenCalledWith({ githubLink: 'https://github.com/junwonp' });
    expect(second).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledWith({ githubLink: 'https://github.com/junwonp' });
    expect(projectNavLinks.get()).toEqual({ githubLink: 'https://github.com/junwonp' });

    projectNavLinks.set({
      githubLink: 'https://github.com/junwonp',
      productLink: 'https://example.com/product',
    });

    expect(projectNavLinks.get()).toEqual({
      githubLink: 'https://github.com/junwonp',
      productLink: 'https://example.com/product',
    });
  });

  it('stops delivering updates to an unsubscribed listener', async () => {
    const projectNavLinks = await loadProjectNavLinks();
    const listener = vi.fn();

    const unsubscribe = projectNavLinks.subscribe(listener);
    unsubscribe();
    projectNavLinks.set({ productLink: 'https://example.com/product' });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('keeps other listeners subscribed when one unsubscribes', async () => {
    const projectNavLinks = await loadProjectNavLinks();
    const removed = vi.fn();
    const kept = vi.fn();

    const unsubscribe = projectNavLinks.subscribe(removed);
    projectNavLinks.subscribe(kept);
    unsubscribe();
    removed.mockClear();
    kept.mockClear();

    projectNavLinks.set({ productLink: 'https://example.com/product' });

    expect(removed).not.toHaveBeenCalled();
    expect(kept).toHaveBeenCalledTimes(1);
  });

  it('resets to no links when null is set', async () => {
    const projectNavLinks = await loadProjectNavLinks();
    const listener = vi.fn();

    projectNavLinks.set({ productLink: 'https://example.com/product' });
    projectNavLinks.subscribe(listener);
    projectNavLinks.set(null);

    expect(projectNavLinks.get()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenLastCalledWith(null);
  });
});

// The hook seeds from the same module singleton, so it must share the freshly reset instance.
const loadProjectNavLinksHooks = async () => {
  vi.resetModules();
  return import('@/lib/stores/bottomNav');
};

describe('useProjectNavLinks hook', () => {
  it('starts with null links on a fresh module', async () => {
    const { useProjectNavLinks } = await loadProjectNavLinksHooks();

    const { result } = renderHook(() => useProjectNavLinks());

    expect(result.current).toBeNull();
  });

  it('seeds its initial state from the value the store already holds', async () => {
    const { projectNavLinks, useProjectNavLinks } = await loadProjectNavLinksHooks();
    projectNavLinks.set({ productLink: 'https://example.com/product' });

    const { result } = renderHook(() => useProjectNavLinks());

    expect(result.current).toEqual({ productLink: 'https://example.com/product' });
  });

  it('pushes a store set made outside the hook to the mounted subscriber', async () => {
    const { projectNavLinks, useProjectNavLinks } = await loadProjectNavLinksHooks();
    const { result } = renderHook(() => useProjectNavLinks());
    expect(result.current).toBeNull();

    act(() => {
      projectNavLinks.set({ githubLink: 'https://github.com/junwonp' });
    });

    expect(result.current).toEqual({ githubLink: 'https://github.com/junwonp' });
  });

  it('resets the mounted hook to null when the store is set to null', async () => {
    const { projectNavLinks, useProjectNavLinks } = await loadProjectNavLinksHooks();
    const { result } = renderHook(() => useProjectNavLinks());

    act(() => {
      projectNavLinks.set({ productLink: 'https://example.com/product' });
    });
    expect(result.current).not.toBeNull();

    act(() => {
      projectNavLinks.set(null);
    });

    expect(result.current).toBeNull();
  });

  it('unsubscribes on unmount so a later set cannot reach the stale hook', async () => {
    const { projectNavLinks, useProjectNavLinks } = await loadProjectNavLinksHooks();
    const originalSubscribe = projectNavLinks.subscribe;
    const unsubscribe = vi.fn();

    vi.spyOn(projectNavLinks, 'subscribe').mockImplementation(
      (listener: (value: ProjectNavLinks | null) => void) => {
        const remove = originalSubscribe(listener);
        return () => {
          remove();
          unsubscribe();
        };
      },
    );

    const { result, unmount } = renderHook(() => useProjectNavLinks());

    act(() => {
      projectNavLinks.set({ productLink: 'https://example.com/product' });
    });
    expect(result.current).toEqual({ productLink: 'https://example.com/product' });

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);

    act(() => {
      projectNavLinks.set({ githubLink: 'https://github.com/junwonp' });
    });

    expect(projectNavLinks.get()).toEqual({ githubLink: 'https://github.com/junwonp' });
    expect(result.current).toEqual({ productLink: 'https://example.com/product' });
  });
});
