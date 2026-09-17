// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Vitest globals are off, so RTL's auto-cleanup never registers; unmount explicitly.
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// The store holds module-level singleton state, so each test re-imports a freshly reset module.
const loadAccordionStore = async () => {
  vi.resetModules();
  const { accordionState } = await import('@/lib/states/accordion');
  return accordionState;
};

describe('accordion state store', () => {
  it('reports whether a company accordion is open', async () => {
    const accordionState = await loadAccordionStore();

    expect(accordionState.hasCompany('Toss')).toBe(false);

    accordionState.toggleCompany('Toss');

    expect(accordionState.hasCompany('Toss')).toBe(true);
  });

  it('keeps a single company open by replacing the previous selection', async () => {
    const accordionState = await loadAccordionStore();

    accordionState.toggleCompany('Toss');
    accordionState.toggleCompany('Naver');

    expect(accordionState.hasCompany('Naver')).toBe(true);
    expect(accordionState.hasCompany('Toss')).toBe(false);
  });

  it('clears the open company when the open one is toggled again', async () => {
    const accordionState = await loadAccordionStore();

    accordionState.toggleCompany('Toss');
    accordionState.toggleCompany('Toss');

    expect(accordionState.hasCompany('Toss')).toBe(false);
  });

  it('tracks projects under a company-scoped key', async () => {
    const accordionState = await loadAccordionStore();

    expect(accordionState.isProjectOpen('Toss', 'Feed')).toBe(false);

    accordionState.toggleProject('Toss', 'Feed');

    expect(accordionState.isProjectOpen('Toss', 'Feed')).toBe(true);
    expect(accordionState.isProjectOpen('Naver', 'Feed')).toBe(false);
    expect(accordionState.isProjectOpen('Toss', 'Profile')).toBe(false);
  });

  it('keeps a single project open and clears it on the second toggle', async () => {
    const accordionState = await loadAccordionStore();

    accordionState.toggleProject('Toss', 'Feed');
    accordionState.toggleProject('Toss', 'Profile');

    expect(accordionState.isProjectOpen('Toss', 'Profile')).toBe(true);
    expect(accordionState.isProjectOpen('Toss', 'Feed')).toBe(false);

    accordionState.toggleProject('Toss', 'Profile');

    expect(accordionState.isProjectOpen('Toss', 'Profile')).toBe(false);
  });

  it('keeps company and project selections independent', async () => {
    const accordionState = await loadAccordionStore();

    accordionState.toggleCompany('Toss');
    accordionState.toggleProject('Toss', 'Feed');
    accordionState.toggleCompany('Toss');

    expect(accordionState.hasCompany('Toss')).toBe(false);
    expect(accordionState.isProjectOpen('Toss', 'Feed')).toBe(true);
  });

  it('invokes a new subscriber immediately and on every toggle', async () => {
    const accordionState = await loadAccordionStore();
    const listener = vi.fn();

    accordionState.subscribe(listener);

    expect(listener).toHaveBeenCalledTimes(1);

    accordionState.toggleCompany('Toss');
    accordionState.toggleProject('Toss', 'Feed');
    accordionState.toggleProject('Toss', 'Feed');

    expect(listener).toHaveBeenCalledTimes(4);
  });

  it('notifies every subscriber', async () => {
    const accordionState = await loadAccordionStore();
    const first = vi.fn();
    const second = vi.fn();

    accordionState.subscribe(first);
    accordionState.subscribe(second);
    accordionState.toggleCompany('Naver');

    expect(first).toHaveBeenCalledTimes(2);
    expect(second).toHaveBeenCalledTimes(2);
  });

  it('stops delivering notifications after unsubscribe', async () => {
    const accordionState = await loadAccordionStore();
    const listener = vi.fn();

    const unsubscribe = accordionState.subscribe(listener);
    unsubscribe();

    accordionState.toggleCompany('Toss');
    accordionState.toggleProject('Toss', 'Feed');

    expect(listener).toHaveBeenCalledTimes(1);
  });
});

// The hook reads the same module singleton, so it must share the freshly reset instance.
const loadAccordionHooks = async () => {
  vi.resetModules();
  return import('@/lib/states/accordion');
};

describe('useAccordionState hook', () => {
  it('starts with no company or project open on a fresh module', async () => {
    const { useAccordionState } = await loadAccordionHooks();

    const { result } = renderHook(() => useAccordionState());

    expect(result.current.hasCompany('Toss')).toBe(false);
    expect(result.current.isProjectOpen('Toss', 'Feed')).toBe(false);
  });

  it('reports the company toggled through the hook', async () => {
    const { useAccordionState } = await loadAccordionHooks();
    const { result } = renderHook(() => useAccordionState());

    act(() => {
      result.current.toggleCompany('Toss');
    });

    expect(result.current.hasCompany('Toss')).toBe(true);
  });

  it('tracks a project through the hook under the composed company key', async () => {
    const { useAccordionState } = await loadAccordionHooks();
    const { result } = renderHook(() => useAccordionState());

    act(() => {
      result.current.toggleProject('Toss', 'Feed');
    });

    expect(result.current.isProjectOpen('Toss', 'Feed')).toBe(true);
    expect(result.current.isProjectOpen('Naver', 'Feed')).toBe(false);
    expect(result.current.isProjectOpen('Toss', 'Profile')).toBe(false);

    act(() => {
      result.current.toggleProject('Toss', 'Feed');
    });

    expect(result.current.isProjectOpen('Toss', 'Feed')).toBe(false);
  });

  it('pushes a store toggle made outside the hook to the mounted subscriber', async () => {
    const { accordionState, useAccordionState } = await loadAccordionHooks();
    const { result } = renderHook(() => useAccordionState());

    act(() => {
      accordionState.toggleCompany('Naver');
    });

    expect(result.current.hasCompany('Naver')).toBe(true);
  });

  it('unsubscribes on unmount so a later store toggle cannot reach the stale hook', async () => {
    const { accordionState, useAccordionState } = await loadAccordionHooks();
    const originalSubscribe = accordionState.subscribe;
    const unsubscribe = vi.fn();

    vi.spyOn(accordionState, 'subscribe').mockImplementation((listener: () => void) => {
      const remove = originalSubscribe(listener);
      return () => {
        remove();
        unsubscribe();
      };
    });

    const { result, unmount } = renderHook(() => useAccordionState());

    act(() => {
      accordionState.toggleCompany('Toss');
    });
    expect(result.current.hasCompany('Toss')).toBe(true);

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);

    act(() => {
      accordionState.toggleCompany('Naver');
    });

    expect(accordionState.hasCompany('Naver')).toBe(true);
    expect(result.current.hasCompany('Naver')).toBe(false);
  });
});
