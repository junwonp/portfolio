// @vitest-environment jsdom
// @module-tag dom
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The transport owns beacon/opt-out policy (covered by analyticsTransport.test.ts); this suite asserts when the tracker flushes and what it sends.
const transport = vi.hoisted(() => ({
  getOrInitializeAnalyticsSession: vi.fn<() => { id: string; isNew: boolean }>(),
  sendAnalyticsPayload: vi.fn<(data: Record<string, unknown>, sessionId: string) => void>(),
}));
vi.mock('@/lib/analytics/analyticsTransport', () => transport);

// usePathname needs an app-router context Vitest lacks, so route changes swap this value and re-render.
const navigation = vi.hoisted(() => ({ pathname: '/projects/aira' }));
vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }));

const randomUUID = vi.hoisted(() => vi.fn(() => 'page-view-1'));

import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';

type MutableDocument = Document & Record<string, unknown>;

const ROUTE = '/projects/aira';
const NEXT_ROUTE = '/projects/oneline';
const HEARTBEAT_MS = 15000;

// Each fabricated jsdom property is tracked so afterEach can delete it and leave the environment untouched.
const overriddenProperties: Array<[object, string]> = [];

function override(target: object, property: string, value: unknown): void {
  Object.defineProperty(target, property, { configurable: true, value });
  overriddenProperties.push([target, property]);
}

interface ScrollContainerMetrics {
  clientHeight?: number;
  scrollHeight?: number;
  scrollTop?: number;
}

interface ScrollEnvironment {
  body?: ScrollContainerMetrics;
  html?: ScrollContainerMetrics;
  scrollingElement?: 'body' | 'html' | 'none';
  scrollY?: number | undefined;
}

// getBoundingClientRect is viewport-relative, so the article mock needs the scroll offset to place a document-top article at rect.top = -offset.
let scrollOffset = 0;

function setupScrollEnvironment(environment: ScrollEnvironment): void {
  const body = { clientHeight: 0, scrollHeight: 0, scrollTop: 0, ...environment.body };
  const html = { clientHeight: 0, scrollHeight: 0, scrollTop: 0, ...environment.html };
  scrollOffset = environment.scrollY ?? 0;

  for (const property of ['clientHeight', 'scrollHeight', 'scrollTop'] as const) {
    override(document.body, property, body[property]);
    override(document.documentElement, property, html[property]);
  }

  const scanningElement = environment.scrollingElement ?? 'none';
  const scrollingElement =
    scanningElement === 'html'
      ? document.documentElement
      : scanningElement === 'body'
        ? document.body
        : null;
  override(document as MutableDocument, 'scrollingElement', scrollingElement);
  override(document, 'visibilityState', 'visible');

  if ('scrollY' in environment) {
    vi.stubGlobal('scrollY', environment.scrollY);
  }
}

function setScrollTop(scrollTop: number): void {
  scrollOffset = scrollTop;
  override(document.documentElement, 'scrollTop', scrollTop);
  override(document.body, 'scrollTop', scrollTop);
}

function setVisibility(visibilityState: DocumentVisibilityState): void {
  override(document, 'visibilityState', visibilityState);
}

function rect(top: number): DOMRect {
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

interface ArticleOptions {
  articleHeight?: number;
  articleTop?: number;
  headings?: readonly string[];
}

function mountArticle(options: ArticleOptions = {}): HTMLElement {
  const { articleHeight = 2000, articleTop = 0, headings = ['Overview', 'Results'] } = options;
  const article = document.createElement('article');
  article.className = 'project-article';

  for (const heading of headings) {
    const h2 = document.createElement('h2');
    h2.textContent = heading;
    article.appendChild(h2);
  }

  document.body.appendChild(article);
  override(article, 'scrollHeight', articleHeight);
  vi.spyOn(article, 'getBoundingClientRect').mockImplementation(() =>
    rect(articleTop - scrollOffset),
  );
  return article;
}

// Engagement measurement is deferred to a frame; the suite captures the callbacks and runs them by hand.
const frames: FrameRequestCallback[] = [];

function captureFrames(): void {
  frames.length = 0;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.push(callback);
    return frames.length;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
}

function runFrames(): void {
  act(() => {
    for (const frame of frames.splice(0)) frame(0);
  });
}

function dispatchWindow(type: string): void {
  act(() => {
    window.dispatchEvent(new Event(type));
  });
}

function dispatchDocument(type: string): void {
  act(() => {
    document.dispatchEvent(new Event(type));
  });
}

function advanceTime(milliseconds: number): void {
  act(() => {
    vi.advanceTimersByTime(milliseconds);
  });
}

// The mount effect resolves the session id on a microtask, so the route-change effect only works once it settles.
async function settleSession(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
  });
}

const renderTracker = (): ReturnType<typeof render> => render(<AnalyticsTracker />);

const pageFlushes = (): Record<string, unknown>[] =>
  transport.sendAnalyticsPayload.mock.calls
    .map(([data]) => data)
    .filter((data) => data.eventType === 'page');

const lastFlush = (): Record<string, unknown> | undefined => pageFlushes().at(-1);

beforeEach(() => {
  transport.getOrInitializeAnalyticsSession.mockReturnValue({ id: 'session-1', isNew: false });
  transport.getOrInitializeAnalyticsSession.mockClear();
  transport.sendAnalyticsPayload.mockClear();
  randomUUID.mockClear();
  randomUUID.mockReturnValue('page-view-1');
  Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: randomUUID });
  navigation.pathname = ROUTE;
  history.replaceState({}, '', ROUTE);
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
});

afterEach(() => {
  // Vitest globals are off, so RTL's auto-cleanup never registers; unmount explicitly.
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  Reflect.deleteProperty(crypto, 'randomUUID');
  for (const [target, property] of overriddenProperties) {
    Reflect.deleteProperty(target, property);
  }
  overriddenProperties.length = 0;
  frames.length = 0;
  document.body.innerHTML = '';
  history.replaceState({}, '', '/');
});

describe('AnalyticsTracker session bootstrap', () => {
  it('sends one initial beacon for a brand-new session and nothing else on mount', async () => {
    transport.getOrInitializeAnalyticsSession.mockReturnValue({ id: 'session-1', isNew: true });
    captureFrames();

    renderTracker();

    expect(transport.sendAnalyticsPayload).toHaveBeenCalledTimes(1);
    expect(transport.sendAnalyticsPayload).toHaveBeenCalledWith({ isInitial: true }, 'session-1');

    await settleSession();
    runFrames();

    expect(transport.sendAnalyticsPayload).toHaveBeenCalledTimes(1);
  });

  it('skips the initial beacon when the session already existed', async () => {
    captureFrames();

    renderTracker();
    await settleSession();
    runFrames();
    dispatchWindow('pagehide');

    expect(transport.sendAnalyticsPayload).not.toHaveBeenCalledWith(
      { isInitial: true },
      'session-1',
    );
    expect(pageFlushes()).toHaveLength(1);
  });
});

describe('AnalyticsTracker page flushes', () => {
  it('reports the furthest scroll depth, article progress and heading on pagehide', async () => {
    mountArticle();
    setupScrollEnvironment({
      html: { clientHeight: 200, scrollHeight: 2000, scrollTop: 0 },
      scrollingElement: 'html',
    });
    captureFrames();
    renderTracker();
    await settleSession();

    setScrollTop(900);
    dispatchWindow('scroll');
    setScrollTop(450);
    dispatchWindow('scroll');
    advanceTime(4000);
    dispatchWindow('pagehide');

    expect(pageFlushes()).toEqual([
      {
        activeTime: 4,
        articleProgress: 55,
        dwellTime: 4,
        eventType: 'page',
        maxVisibleSectionId: 'results',
        maxVisibleSectionLabel: 'Results',
        pageViewId: 'page-view-1',
        path: ROUTE,
        previousPath: ROUTE,
        scrollDepth: 50,
      },
    ]);
  });

  it('labels headings by parsed text, raw text and generated slug in turn', async () => {
    mountArticle({ headings: ['Results', ':', ''] });
    setupScrollEnvironment({
      html: { clientHeight: 2000, scrollHeight: 2000 },
      scrollingElement: 'html',
    });
    captureFrames();
    renderTracker();
    await settleSession();

    dispatchWindow('pagehide');

    // The last heading has no text at all, so its id doubles as the label.
    expect(lastFlush()).toMatchObject({
      maxVisibleSectionId: 'section-2',
      maxVisibleSectionLabel: 'section-2',
    });
  });

  it('reports an empty section when the page has no project article', async () => {
    setupScrollEnvironment({
      html: { clientHeight: 200, scrollHeight: 2000 },
      scrollingElement: 'html',
    });
    captureFrames();
    renderTracker();
    await settleSession();

    dispatchWindow('pagehide');

    expect(lastFlush()?.articleProgress).toBe(0);
    expect(lastFlush()?.maxVisibleSectionId).toBeUndefined();
    expect(lastFlush()?.maxVisibleSectionLabel).toBeUndefined();
  });

  it('freezes active time while the tab stays hidden', async () => {
    captureFrames();
    renderTracker();
    await settleSession();

    advanceTime(3000);
    setVisibility('hidden');
    dispatchDocument('visibilitychange');

    expect(lastFlush()).toMatchObject({ activeTime: 3, dwellTime: 3 });

    advanceTime(5000);
    dispatchDocument('visibilitychange');

    // Still hidden: the paused clock must not absorb the five hidden seconds.
    expect(lastFlush()).toMatchObject({ activeTime: 3, dwellTime: 8 });
  });

  it('resumes active time once the tab is visible again', async () => {
    captureFrames();
    renderTracker();
    await settleSession();

    advanceTime(3000);
    setVisibility('hidden');
    dispatchDocument('visibilitychange');

    setVisibility('visible');
    dispatchDocument('visibilitychange');
    dispatchDocument('visibilitychange');

    advanceTime(2000);
    setVisibility('hidden');
    dispatchDocument('visibilitychange');

    expect(lastFlush()).toMatchObject({ activeTime: 5, dwellTime: 5 });
  });

  it('flushes from the 15s heartbeat only while the page is visible', async () => {
    captureFrames();
    renderTracker();
    await settleSession();

    advanceTime(HEARTBEAT_MS);
    expect(pageFlushes()).toHaveLength(1);
    expect(lastFlush()).toMatchObject({ dwellTime: 15, path: ROUTE });

    setVisibility('hidden');
    advanceTime(HEARTBEAT_MS * 2);
    expect(pageFlushes()).toHaveLength(1);
  });

  it('flushes once and stops listening when unmounted', async () => {
    captureFrames();
    const { unmount } = renderTracker();
    await settleSession();
    advanceTime(2000);
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(pageFlushes()).toHaveLength(1);
    expect(lastFlush()).toMatchObject({ dwellTime: 2, path: ROUTE });

    dispatchWindow('pagehide');
    dispatchWindow('scroll');
    advanceTime(HEARTBEAT_MS);

    expect(pageFlushes()).toHaveLength(1);
  });
});

describe('AnalyticsTracker scroll containers', () => {
  it('falls back to the body when html cannot scroll but the body can', async () => {
    setupScrollEnvironment({
      body: { clientHeight: 200, scrollHeight: 1200, scrollTop: 500 },
      html: { clientHeight: 200, scrollHeight: 200, scrollTop: 999 },
      scrollingElement: 'html',
    });
    captureFrames();
    renderTracker();
    await settleSession();

    dispatchWindow('pagehide');

    // 500 / (1200 - 200): both the position and the height came from the body.
    expect(lastFlush()).toMatchObject({ scrollDepth: 50 });
  });

  it('uses the window scroll position when no element scrolls', async () => {
    mountArticle();
    setupScrollEnvironment({
      html: { clientHeight: 200, scrollHeight: 200 },
      scrollY: 300,
      scrollingElement: 'none',
    });
    captureFrames();
    renderTracker();
    await settleSession();

    dispatchWindow('pagehide');

    // viewportBottom = 300 (window) + 200: the window offset reached the article.
    expect(lastFlush()).toMatchObject({ articleProgress: 25, scrollDepth: 0 });
  });

  it('treats a missing window scroll position as zero', async () => {
    mountArticle();
    setupScrollEnvironment({
      html: { clientHeight: 200, scrollHeight: 200 },
      scrollY: undefined,
      scrollingElement: 'none',
    });
    captureFrames();
    renderTracker();
    await settleSession();

    dispatchWindow('pagehide');

    expect(lastFlush()).toMatchObject({ articleProgress: 10, scrollDepth: 0 });
  });

  it('skips engagement updates when the window disappears before a scroll', async () => {
    mountArticle();
    setupScrollEnvironment({
      html: { clientHeight: 200, scrollHeight: 2000 },
      scrollingElement: 'html',
    });
    captureFrames();
    renderTracker();
    await settleSession();

    const realWindow = window;
    setScrollTop(900);
    vi.stubGlobal('window', undefined);
    realWindow.dispatchEvent(new Event('scroll'));
    realWindow.dispatchEvent(new Event('pagehide'));

    vi.unstubAllGlobals();
    realWindow.dispatchEvent(new Event('pagehide'));

    expect(pageFlushes()).toHaveLength(2);
    expect(pageFlushes()[0]).toMatchObject({
      articleProgress: 0,
      maxVisibleSectionId: undefined,
      scrollDepth: 0,
    });
    expect(pageFlushes()[1]).toMatchObject({
      articleProgress: 55,
      maxVisibleSectionId: 'results',
      scrollDepth: 50,
    });
  });
});

describe('AnalyticsTracker route changes', () => {
  it('waits for the session before flushing an early route change', async () => {
    captureFrames();
    const { rerender } = renderTracker();

    navigation.pathname = NEXT_ROUTE;
    rerender(<AnalyticsTracker />);

    expect(pageFlushes()).toHaveLength(0);

    await settleSession();

    expect(pageFlushes()).toHaveLength(1);
    expect(lastFlush()).toMatchObject({ pageViewId: 'page-view-1', path: ROUTE });
  });

  it('flushes the previous page and starts a fresh page view on navigation', async () => {
    captureFrames();
    const { rerender } = renderTracker();
    await settleSession();
    advanceTime(1000);
    dispatchWindow('pagehide');

    navigation.pathname = NEXT_ROUTE;
    randomUUID.mockReturnValueOnce('page-view-2');
    rerender(<AnalyticsTracker />);
    await settleSession();

    expect(lastFlush()).toMatchObject({
      pageViewId: 'page-view-1',
      path: ROUTE,
      previousPath: ROUTE,
    });

    dispatchWindow('pagehide');

    expect(lastFlush()).toMatchObject({
      pageViewId: 'page-view-2',
      path: NEXT_ROUTE,
      previousPath: NEXT_ROUTE,
    });
  });

  it('starts a route change with a paused clock while the tab is hidden', async () => {
    captureFrames();
    const { rerender } = renderTracker();
    await settleSession();

    setVisibility('hidden');
    dispatchDocument('visibilitychange');

    navigation.pathname = NEXT_ROUTE;
    randomUUID.mockReturnValueOnce('page-view-2');
    rerender(<AnalyticsTracker />);
    await settleSession();

    advanceTime(5000);
    setVisibility('visible');
    dispatchDocument('visibilitychange');
    advanceTime(2000);
    dispatchWindow('pagehide');

    // Dwell time is wall clock; only active time excludes the hidden stretch.
    expect(lastFlush()).toMatchObject({ activeTime: 2, dwellTime: 7, path: NEXT_ROUTE });
  });
});
