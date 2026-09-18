// @vitest-environment jsdom
// @module-tag dom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

interface MediaQueryStub {
  matches: boolean;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  emitChange: () => void;
  listenerCount: () => number;
}

function createMediaQueryList(initialMatches: boolean): MediaQueryStub {
  const listeners: Array<() => void> = [];
  const addEventListener = vi.fn((event: string, listener: () => void) => {
    if (event === 'change') listeners.push(listener);
  });
  const removeEventListener = vi.fn((event: string, listener: () => void) => {
    if (event !== 'change') return;
    const index = listeners.indexOf(listener);
    if (index >= 0) listeners.splice(index, 1);
  });

  const stub: MediaQueryStub = {
    matches: initialMatches,
    addEventListener,
    removeEventListener,
    emitChange: () => {
      for (const listener of [...listeners]) listener();
    },
    listenerCount: () => listeners.length,
  };

  return stub;
}

function stubMatchMedia(matchesFor: (query: string) => boolean) {
  const lists: MediaQueryStub[] = [];
  const matchMedia = vi.fn((query: string) => {
    const list = createMediaQueryList(matchesFor(query));
    lists.push(list);
    return list;
  });

  vi.stubGlobal('matchMedia', matchMedia);

  return { matchMedia, lists };
}

describe('useMediaQuery', () => {
  it('starts false and reads the stubbed media query once the effect runs', () => {
    stubMatchMedia(() => true);
    const seen: boolean[] = [];

    const { result } = renderHook(() => {
      const matches = useMediaQuery('(min-width: 768px)');
      seen.push(matches);
      return matches;
    });

    expect(seen[0]).toBe(false);
    expect(result.current).toBe(true);
  });

  it('keeps returning false when the media query does not match', () => {
    const { matchMedia } = stubMatchMedia(() => false);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
    expect(result.current).toBe(false);
  });

  it('updates the result when the media query list emits a change event', () => {
    const { lists } = stubMatchMedia(() => false);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    const mediaQueryList = lists[0];
    expect(mediaQueryList).toBeDefined();
    expect(result.current).toBe(false);

    mediaQueryList.matches = true;
    act(() => {
      mediaQueryList.emitChange();
    });

    expect(mediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(result.current).toBe(true);
  });

  it('removes the change listener it added when the component unmounts', () => {
    const { lists } = stubMatchMedia(() => true);

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    const mediaQueryList = lists[0];
    expect(mediaQueryList).toBeDefined();
    expect(mediaQueryList.listenerCount()).toBe(1);

    const addedListener = mediaQueryList.addEventListener.mock.calls[0]?.[1];
    unmount();

    expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith('change', addedListener);
    expect(mediaQueryList.listenerCount()).toBe(0);
  });

  it('unsubscribes from the old query and resubscribes when the query changes', () => {
    const { matchMedia, lists } = stubMatchMedia((query) => query === '(min-width: 1024px)');

    const { result, rerender } = renderHook(
      ({ query }: { query: string }) => useMediaQuery(query),
      {
        initialProps: { query: '(min-width: 768px)' },
      },
    );

    expect(result.current).toBe(false);

    rerender({ query: '(min-width: 1024px)' });

    expect(matchMedia).toHaveBeenNthCalledWith(1, '(min-width: 768px)');
    expect(matchMedia).toHaveBeenNthCalledWith(2, '(min-width: 1024px)');
    expect(lists[0]?.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(result.current).toBe(true);
  });
});
