// @vitest-environment jsdom
// @module-tag dom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { prefersReducedMotion } from '@/lib/utils/motion';
import {
  getPageScrollElement,
  getPageScrollHeight,
  getPageScrollY,
  scrollPageTo,
  useScrollSpy,
} from './useScrollSpy';

// scrollPageTo reads window/document directly, so mock the minimal surface it touches
function setupDom(reducedMotion: boolean): { scrollTo: ReturnType<typeof vi.fn> } {
  const windowScrollTo = vi.fn();
  const scrollingElement = { scrollTo: windowScrollTo };

  vi.stubGlobal('window', {
    scrollTo: windowScrollTo,
    matchMedia: vi.fn(() => ({ matches: reducedMotion })),
  });
  vi.stubGlobal('document', {
    body: { scrollHeight: 0, clientHeight: 100, scrollTop: 0 },
    documentElement: { scrollHeight: 0, clientHeight: 100 },
    scrollingElement,
  });

  return { scrollTo: windowScrollTo };
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('prefersReducedMotion', () => {
  it('returns false when the user prefers smooth motion', () => {
    setupDom(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  it('returns true when the user prefers reduced motion', () => {
    setupDom(true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it('returns false when matchMedia is unavailable', () => {
    vi.stubGlobal('window', { matchMedia: undefined });
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('scrollPageTo', () => {
  it('scrolls smoothly by default', () => {
    const { scrollTo } = setupDom(false);
    scrollPageTo(500);
    expect(scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'smooth' });
  });

  it('falls back to instant scrolling when reduced motion is preferred', () => {
    const { scrollTo } = setupDom(true);
    scrollPageTo(500);
    expect(scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'auto' });
  });

  it('keeps an explicit instant behavior when motion is fine', () => {
    const { scrollTo } = setupDom(false);
    scrollPageTo(500, 'instant');
    expect(scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'instant' });
  });

  it('targets document.body when the body is the scroll container', () => {
    const bodyScrollTo = vi.fn();
    vi.stubGlobal('window', {
      scrollTo: vi.fn(),
      matchMedia: vi.fn(() => ({ matches: false })),
    });
    vi.stubGlobal('document', {
      body: { scrollHeight: 2000, clientHeight: 100, scrollTop: 0, scrollTo: bodyScrollTo },
      documentElement: { scrollHeight: 100, clientHeight: 100 },
    });

    scrollPageTo(300);
    expect(bodyScrollTo).toHaveBeenCalledWith({ top: 300, behavior: 'smooth' });
    expect(getPageScrollElement()).toBe(document.body);
  });
});

function createRect(top: number): DOMRect {
  return {
    bottom: top,
    height: 0,
    left: 0,
    right: 0,
    top,
    width: 0,
    x: 0,
    y: top,
    toJSON: () => ({}),
  };
}

function mountSection(id: string, top: number): HTMLElement {
  const section = document.createElement('section');
  section.id = id;
  vi.spyOn(section, 'getBoundingClientRect').mockReturnValue(createRect(top));
  document.body.appendChild(section);
  return section;
}

// The hook coalesces scroll work into a frame, so tests capture the callbacks and run them by hand.
function captureAnimationFrames(): FrameRequestCallback[] {
  const frames: FrameRequestCallback[] = [];
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.push(callback);
    return frames.length;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  return frames;
}

function runNextFrame(frames: FrameRequestCallback[]): void {
  act(() => {
    const frame = frames.shift();
    frame?.(0);
  });
}

function dispatchScroll(): void {
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('getPageScrollElement', () => {
  it('falls back to the document element when the document is not available', () => {
    vi.stubGlobal('document', undefined);

    expect(getPageScrollElement()).toEqual({});
  });
});

describe('getPageScrollHeight', () => {
  it('returns the largest of the body and document heights', () => {
    Object.defineProperty(document.body, 'offsetHeight', { configurable: true, value: 900 });
    Object.defineProperty(document.body, 'scrollHeight', { configurable: true, value: 1100 });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 700,
    });
    Object.defineProperty(document.documentElement, 'offsetHeight', {
      configurable: true,
      value: 1200,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 1050,
    });

    expect(getPageScrollHeight()).toBe(1200);
  });

  it('returns zero when the document is not available', () => {
    vi.stubGlobal('document', undefined);

    expect(getPageScrollHeight()).toBe(0);
  });
});

describe('getPageScrollY', () => {
  afterEach(() => {
    Reflect.deleteProperty(document.body, 'scrollHeight');
    Reflect.deleteProperty(document.body, 'clientHeight');
    Reflect.deleteProperty(document.body, 'scrollTop');
    Reflect.deleteProperty(document.documentElement, 'scrollHeight');
    Reflect.deleteProperty(document.documentElement, 'clientHeight');
  });

  it('reads the window scroll position when the document scrolls the page', () => {
    vi.stubGlobal('scrollY', 420);

    expect(getPageScrollY()).toBe(420);
  });

  it('reads the body scroll position when the body is the scroll container', () => {
    Object.defineProperty(document.body, 'scrollHeight', { configurable: true, value: 3000 });
    Object.defineProperty(document.body, 'clientHeight', { configurable: true, value: 800 });
    Object.defineProperty(document.body, 'scrollTop', { configurable: true, value: 275 });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 800,
    });
    vi.stubGlobal('scrollY', 999);

    expect(getPageScrollElement()).toBe(document.body);
    expect(getPageScrollY()).toBe(275);
  });

  it('returns zero when the window is not available', () => {
    vi.stubGlobal('window', undefined);

    expect(getPageScrollY()).toBe(0);
  });
});

describe('useScrollSpy', () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
    Reflect.deleteProperty(document.body, 'scrollHeight');
    Reflect.deleteProperty(document.body, 'clientHeight');
    Reflect.deleteProperty(document.body, 'scrollTop');
    Reflect.deleteProperty(document.documentElement, 'scrollHeight');
    Reflect.deleteProperty(document.documentElement, 'clientHeight');
  });

  it('activates the section nearest the default threshold line after the first frame', () => {
    mountSection('alpha', 100);
    mountSection('beta', 260);
    const frames = captureAnimationFrames();

    const { result } = renderHook(() => useScrollSpy(() => ['alpha', 'beta']));

    expect(frames).toHaveLength(1);
    expect(result.current).toBe('');

    runNextFrame(frames);

    // alpha sits 20px from the 120px threshold line, beta 140px away
    expect(result.current).toBe('alpha');
  });

  it('honours an explicit numeric threshold when choosing the section', () => {
    mountSection('alpha', 100);
    mountSection('beta', 260);
    const frames = captureAnimationFrames();

    const { result } = renderHook(() => useScrollSpy(() => ['alpha', 'beta'], { threshold: 250 }));
    runNextFrame(frames);

    expect(result.current).toBe('beta');
  });

  it('resolves a function threshold on every measurement', () => {
    mountSection('alpha', 100);
    mountSection('beta', 260);
    const frames = captureAnimationFrames();
    const threshold = vi.fn(() => 90);

    const { result } = renderHook(() => useScrollSpy(() => ['alpha', 'beta'], { threshold }));
    runNextFrame(frames);

    expect(threshold).toHaveBeenCalled();
    expect(result.current).toBe('alpha');
  });

  it('pins the last section when the page is scrolled to the bottom', () => {
    mountSection('alpha', 100);
    mountSection('beta', 260);
    const frames = captureAnimationFrames();
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 3000,
    });
    vi.stubGlobal('innerHeight', 800);
    vi.stubGlobal('scrollY', 2200);

    const { result } = renderHook(() => useScrollSpy(() => ['alpha', 'beta']));
    runNextFrame(frames);

    // maxScrollY is 2200, so 2200 sits inside the bottom 50px band and wins over the threshold
    expect(result.current).toBe('beta');
  });

  it('stays inactive while disabled and picks the section up once re-enabled', () => {
    mountSection('alpha', 100);
    const frames = captureAnimationFrames();
    let disabled = true;

    const { result } = renderHook(() =>
      useScrollSpy(() => ['alpha'], { isDisabled: () => disabled }),
    );
    runNextFrame(frames);

    expect(result.current).toBe('');

    disabled = false;
    dispatchScroll();
    runNextFrame(frames);

    expect(result.current).toBe('alpha');
  });

  it('leaves the active id empty until any section id exists', () => {
    mountSection('alpha', 100);
    const frames = captureAnimationFrames();
    const ids: string[] = [];

    const { result, rerender } = renderHook(() => useScrollSpy(() => ids));
    runNextFrame(frames);

    expect(result.current).toBe('');

    ids.push('alpha');
    rerender();
    dispatchScroll();
    runNextFrame(frames);

    expect(result.current).toBe('alpha');
  });

  it('prefers a measured section over an id whose element is missing', () => {
    mountSection('beta', 260);
    const frames = captureAnimationFrames();

    const { result } = renderHook(() => useScrollSpy(() => ['ghost', 'beta']));
    runNextFrame(frames);

    expect(result.current).toBe('beta');
  });

  it('falls back to the first id when no section exists in the document', () => {
    const frames = captureAnimationFrames();

    const { result } = renderHook(() => useScrollSpy(() => ['ghost']));
    runNextFrame(frames);

    expect(result.current).toBe('ghost');
  });

  it('listens on both the scroll element and the window, and removes them on unmount', () => {
    mountSection('alpha', 100);
    const frames = captureAnimationFrames();
    const elementAdd = vi.spyOn(document.documentElement, 'addEventListener');
    const elementRemove = vi.spyOn(document.documentElement, 'removeEventListener');
    const windowAdd = vi.spyOn(window, 'addEventListener');
    const windowRemove = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useScrollSpy(() => ['alpha']));

    expect(elementAdd).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    expect(windowAdd).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    expect(frames).toHaveLength(1);

    unmount();

    expect(elementRemove).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(windowRemove).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('coalesces rapid scroll events into a single animation frame', () => {
    mountSection('alpha', 100);
    const frames = captureAnimationFrames();

    const { result } = renderHook(() => useScrollSpy(() => ['alpha']));
    expect(frames).toHaveLength(1);

    act(() => {
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
    });
    expect(frames).toHaveLength(1);

    runNextFrame(frames);
    expect(result.current).toBe('alpha');

    dispatchScroll();
    expect(frames).toHaveLength(1);
  });

  it('cancels the pending frame when the component unmounts before it runs', () => {
    mountSection('alpha', 100);
    const frames = captureAnimationFrames();
    const cancel = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancel);

    const { unmount } = renderHook(() => useScrollSpy(() => ['alpha']));
    expect(frames).toHaveLength(1);

    unmount();

    expect(cancel).toHaveBeenCalledWith(1);
  });

  it('does not cancel a frame that has already run', () => {
    mountSection('alpha', 100);
    const frames = captureAnimationFrames();
    const cancel = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancel);

    const { unmount } = renderHook(() => useScrollSpy(() => ['alpha']));
    runNextFrame(frames);

    unmount();

    expect(cancel).not.toHaveBeenCalled();
  });
});

describe('useScrollSpy SSR guards', () => {
  it('returns early from scrollPageTo when the window does not exist', () => {
    vi.stubGlobal('window', undefined);

    expect(() => scrollPageTo(100)).not.toThrow();
  });
});
