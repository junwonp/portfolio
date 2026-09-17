// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useDeferredClientRender } from '@/lib/hooks/useDeferredClientRender';

// jsdom lacks requestIdleCallback/cancelIdleCallback, so the fallback path is default and the idle path is stubbed.
function removeIdleCallbackSupport() {
  Reflect.deleteProperty(window, 'requestIdleCallback');
  Reflect.deleteProperty(window, 'cancelIdleCallback');
  expect('requestIdleCallback' in window).toBe(false);
}

afterEach(() => {
  // Vitest globals are off, so RTL's auto-cleanup never registers; unmount explicitly.
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('useDeferredClientRender', () => {
  it('flips the flag on the fallback timeout when requestIdleCallback is unavailable', () => {
    vi.useFakeTimers();
    removeIdleCallbackSupport();

    const { result } = renderHook(() => useDeferredClientRender(500));
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it('clears the pending fallback timeout when the component unmounts', () => {
    vi.useFakeTimers();
    removeIdleCallbackSupport();

    const { unmount } = renderHook(() => useDeferredClientRender(500));
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('schedules through requestIdleCallback and cancels the idle callback on cleanup', () => {
    let scheduledRender: (() => void) | undefined;
    const requestIdleCallback = vi.fn((callback: () => void) => {
      scheduledRender = callback;
      return 7;
    });
    const cancelIdleCallback = vi.fn();
    vi.stubGlobal('requestIdleCallback', requestIdleCallback);
    vi.stubGlobal('cancelIdleCallback', cancelIdleCallback);

    const { result } = renderHook(() => useDeferredClientRender(700));

    expect(result.current).toBe(false);
    expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), { timeout: 700 });
    expect(scheduledRender).toBeDefined();

    act(() => {
      scheduledRender?.();
    });

    expect(result.current).toBe(true);
    expect(cancelIdleCallback).toHaveBeenCalledWith(7);
  });

  it('returns early once the flag is true instead of scheduling another timer', () => {
    vi.useFakeTimers();
    removeIdleCallbackSupport();
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    const { result, rerender } = renderHook(
      ({ timeoutMs }: { timeoutMs: number }) => useDeferredClientRender(timeoutMs),
      { initialProps: { timeoutMs: 300 } },
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe(true);

    const scheduledBeforeRerender = setTimeoutSpy.mock.calls.length;
    rerender({ timeoutMs: 900 });

    expect(setTimeoutSpy.mock.calls.length).toBe(scheduledBeforeRerender);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not throw during cleanup and still commits the idle render when cancelIdleCallback is missing', () => {
    let scheduledRender: (() => void) | undefined;
    const requestIdleCallback = vi.fn((callback: () => void) => {
      scheduledRender = callback;
      return 11;
    });
    vi.stubGlobal('requestIdleCallback', requestIdleCallback);
    expect('cancelIdleCallback' in window).toBe(false);

    const { result, unmount } = renderHook(() => useDeferredClientRender(600));
    expect(result.current).toBe(false);

    expect(() => {
      act(() => {
        scheduledRender?.();
      });
    }).not.toThrow();
    expect(result.current).toBe(true);

    expect(() => unmount()).not.toThrow();
  });

  it('does not throw on unmount while an idle callback is pending without cancelIdleCallback', () => {
    const requestIdleCallback = vi.fn(() => 13);
    vi.stubGlobal('requestIdleCallback', requestIdleCallback);
    expect('cancelIdleCallback' in window).toBe(false);

    const { unmount } = renderHook(() => useDeferredClientRender(450));
    expect(requestIdleCallback).toHaveBeenCalledTimes(1);

    expect(() => unmount()).not.toThrow();
  });
});
