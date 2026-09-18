// @vitest-environment jsdom
// @module-tag dom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useNavPill } from './useNavPill';

interface SpyOptions {
  threshold?: number | (() => number);
  isDisabled?: () => boolean;
}

const scrollSpyMock = vi.hoisted(() => ({
  useScrollSpy: vi.fn((_getIds: () => string[], _options?: SpyOptions) => 'beta'),
  getPageScrollY: vi.fn(() => 0),
  scrollPageTo: vi.fn(),
}));
vi.mock('@/lib/hooks/useScrollSpy', () => scrollSpyMock);

const dragMock = vi.hoisted(() => ({
  isDragging: false,
  calls: [] as Array<Record<string, unknown>>,
  handlers: {
    handlePointerDown: vi.fn(),
    handlePointerMove: vi.fn(),
    handlePointerUp: vi.fn(),
  },
}));
vi.mock('./useBottomNavDrag', () => ({
  useBottomNavDrag: (props: Record<string, unknown>) => {
    dragMock.calls.push(props);
    return {
      pillLeft: 12,
      pillWidth: 34,
      isDragging: dragMock.isDragging,
      dragOffset: 0,
      dragHoveredId: null,
      ...dragMock.handlers,
    };
  },
}));

const TABS = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
  { id: 'gamma', label: 'Gamma' },
];

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

function mountSection(id: string, top = 200): HTMLElement {
  const section = document.createElement('section');
  section.id = id;
  vi.spyOn(section, 'getBoundingClientRect').mockReturnValue(createRect(top));
  document.body.appendChild(section);
  return section;
}

function appendStickyHeader(height: number, hidden = false): HTMLElement {
  const header = document.createElement('div');
  header.className = 'sticky-header';
  if (hidden) {
    header.style.display = 'none';
  }
  Object.defineProperty(header, 'offsetHeight', { configurable: true, value: height });
  document.body.appendChild(header);
  return header;
}

function readThreshold(options: SpyOptions | undefined): number | undefined {
  const threshold = options?.threshold;
  return typeof threshold === 'function' ? threshold() : threshold;
}

function readDisabled(options: SpyOptions | undefined): boolean | undefined {
  return options?.isDisabled?.();
}

function latestOptions(): SpyOptions | undefined {
  return scrollSpyMock.useScrollSpy.mock.calls.at(-1)?.[1];
}

beforeEach(() => {
  scrollSpyMock.useScrollSpy.mockReturnValue('beta');
  scrollSpyMock.getPageScrollY.mockReturnValue(0);
  dragMock.isDragging = false;
  dragMock.calls.length = 0;
});

afterEach(() => {
  cleanup();
  if (vi.isFakeTimers()) {
    vi.clearAllTimers();
    vi.useRealTimers();
  }
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('useNavPill viewport tracking', () => {
  it('seeds the viewport width and re-reads it on resize', () => {
    renderHook(() => useNavPill({ isProject: false, tabs: TABS }));
    expect(dragMock.calls.at(-1)).toMatchObject({ windowWidth: 1024 });

    vi.stubGlobal('innerWidth', 640);
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(dragMock.calls.at(-1)).toMatchObject({ windowWidth: 640 });
  });

  it('stops listening for resize events after unmount', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const removeEventListener = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useNavPill({ isProject: false, tabs: TABS }));
    expect(addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});

describe('useNavPill scroll offsets', () => {
  it('offsets the home scroll by the visible sticky header height', () => {
    mountSection('alpha');
    appendStickyHeader(64);
    scrollSpyMock.getPageScrollY.mockReturnValue(30);

    const { result } = renderHook(() => useNavPill({ isProject: false, tabs: TABS }));
    act(() => {
      result.current.scrollToTarget('alpha');
    });

    expect(scrollSpyMock.scrollPageTo).toHaveBeenCalledWith(200 + 30 - 64);
  });

  it('uses a zero offset when the sticky header is hidden', () => {
    mountSection('alpha');
    appendStickyHeader(64, true);
    scrollSpyMock.getPageScrollY.mockReturnValue(30);

    const { result } = renderHook(() => useNavPill({ isProject: false, tabs: TABS }));
    act(() => {
      result.current.scrollToTarget('alpha');
    });

    expect(scrollSpyMock.scrollPageTo).toHaveBeenCalledWith(200 + 30);
  });

  it('uses a zero offset when there is no sticky header at all', () => {
    mountSection('alpha');
    scrollSpyMock.getPageScrollY.mockReturnValue(30);

    const { result } = renderHook(() => useNavPill({ isProject: false, tabs: TABS }));
    act(() => {
      result.current.scrollToTarget('alpha');
    });

    expect(scrollSpyMock.scrollPageTo).toHaveBeenCalledWith(200 + 30);
  });

  it('uses the fixed project offset even when a sticky header is present', () => {
    mountSection('alpha');
    appendStickyHeader(64);
    scrollSpyMock.getPageScrollY.mockReturnValue(30);

    const { result } = renderHook(() => useNavPill({ isProject: true, tabs: TABS }));
    act(() => {
      result.current.scrollToTarget('alpha');
    });

    expect(scrollSpyMock.scrollPageTo).toHaveBeenCalledWith(200 + 30 - 80);
  });

  it('ignores a scroll request for a section that is not in the document', () => {
    const { result } = renderHook(() => useNavPill({ isProject: false, tabs: TABS }));

    act(() => {
      result.current.scrollToTarget('ghost');
    });

    expect(scrollSpyMock.scrollPageTo).not.toHaveBeenCalled();
    expect(result.current.activeId).toBe('beta');
  });
});

describe('useNavPill active tab', () => {
  it('keeps the manually selected tab highlighted until the scroll settles', () => {
    vi.useFakeTimers();
    mountSection('gamma');

    const { result } = renderHook(() => useNavPill({ isProject: false, tabs: TABS }));
    expect(result.current.activeId).toBe('beta');

    act(() => {
      result.current.scrollToTarget('gamma');
    });

    expect(scrollSpyMock.scrollPageTo).toHaveBeenCalledTimes(1);
    expect(result.current.activeId).toBe('gamma');

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(result.current.activeId).toBe('beta');
  });

  it('restarts the settle timer when a second section is requested mid-scroll', () => {
    vi.useFakeTimers();
    mountSection('alpha');
    mountSection('gamma');

    const { result } = renderHook(() => useNavPill({ isProject: false, tabs: TABS }));

    act(() => {
      result.current.scrollToTarget('alpha');
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });
    act(() => {
      result.current.scrollToTarget('gamma');
    });
    expect(result.current.activeId).toBe('gamma');

    act(() => {
      vi.advanceTimersByTime(799);
    });
    // The first timer would have fired by now; only the restarted one may settle the scroll
    expect(result.current.activeId).toBe('gamma');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.activeId).toBe('beta');
  });

  it('clears the pending settle timer when the component unmounts', () => {
    vi.useFakeTimers();
    mountSection('alpha');

    const { result, unmount } = renderHook(() => useNavPill({ isProject: false, tabs: TABS }));
    act(() => {
      result.current.scrollToTarget('alpha');
    });
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('maps the active id to its tab index for the drag hook', () => {
    renderHook(() => useNavPill({ isProject: false, tabs: TABS }));

    expect(dragMock.calls.at(-1)).toMatchObject({
      activeId: 'beta',
      activeIndex: 1,
      tabs: TABS,
      windowWidth: 1024,
      scrollToTarget: expect.any(Function),
    });
  });

  it('reports a negative index when the spy returns an unknown id', () => {
    scrollSpyMock.useScrollSpy.mockReturnValue('unknown');

    renderHook(() => useNavPill({ isProject: false, tabs: TABS }));

    expect(dragMock.calls.at(-1)).toMatchObject({ activeId: 'unknown', activeIndex: -1 });
  });

  it('exposes the tab ids to the spy and forwards drag state and handlers', () => {
    const { result } = renderHook(() => useNavPill({ isProject: false, tabs: TABS }));

    const getIds = scrollSpyMock.useScrollSpy.mock.calls.at(-1)?.[0];
    expect(getIds?.()).toEqual(['alpha', 'beta', 'gamma']);

    expect(result.current.pillLeft).toBe(12);
    expect(result.current.pillWidth).toBe(34);
    expect(result.current.isDragging).toBe(false);
    expect(result.current.dragOffset).toBe(0);
    expect(result.current.dragHoveredId).toBeNull();
    expect(result.current.handlePointerDown).toBe(dragMock.handlers.handlePointerDown);
    expect(result.current.handlePointerMove).toBe(dragMock.handlers.handlePointerMove);
    expect(result.current.handlePointerUp).toBe(dragMock.handlers.handlePointerUp);
  });
});

describe('useNavPill scroll spy options', () => {
  it('passes a project-aware threshold to the scroll spy', () => {
    const { rerender } = renderHook(
      ({ isProject }: { isProject: boolean }) => useNavPill({ isProject, tabs: TABS }),
      { initialProps: { isProject: false } },
    );
    expect(readThreshold(latestOptions())).toBe(100);

    rerender({ isProject: true });

    expect(readThreshold(latestOptions())).toBe(120);
  });

  it('disables the scroll spy while settling a manual scroll and while dragging', () => {
    vi.useFakeTimers();
    mountSection('gamma');

    const { result, rerender } = renderHook(
      ({ isProject }: { isProject: boolean }) => useNavPill({ isProject, tabs: TABS }),
      { initialProps: { isProject: false } },
    );
    expect(readDisabled(latestOptions())).toBe(false);

    act(() => {
      result.current.scrollToTarget('gamma');
    });
    expect(readDisabled(latestOptions())).toBe(true);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    dragMock.isDragging = true;
    rerender({ isProject: false });

    expect(readDisabled(latestOptions())).toBe(true);
  });
});
