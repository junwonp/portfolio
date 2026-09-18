// @vitest-environment jsdom
// @module-tag dom
import { act, cleanup, renderHook } from '@testing-library/react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { afterEach, describe, expect, it, type Mock, vi } from 'vitest';

import * as styles from './BottomNav.css';
import { useBottomNavDrag } from './useBottomNavDrag';

interface TabSpec {
  id: string;
  label: string;
  left: number;
  width: number;
}

interface DragHarness {
  tabBar: HTMLDivElement;
  tabBarRef: { current: HTMLElement | null };
  tabButtons: HTMLButtonElement[];
  tabs: Array<{ id: string; label: string }>;
  pill: HTMLDivElement;
  capture: Mock;
  release: Mock;
  hasPointerCapture: Mock;
}

const DEFAULT_TABS: TabSpec[] = [
  { id: 'alpha', label: 'Alpha', left: 4, width: 60 },
  { id: 'beta', label: 'Beta', left: 70, width: 80 },
  { id: 'gamma', label: 'Gamma', left: 160, width: 50 },
];

// jsdom has no layout and no pointer capture, so the bar exposes measured offsets by hand.
function createHarness(specs: TabSpec[], barWidth = 400): DragHarness {
  const tabBar = document.createElement('div');
  const capture = vi.fn();
  const release = vi.fn();
  const hasPointerCapture = vi.fn(() => true);

  Object.defineProperty(tabBar, 'setPointerCapture', { configurable: true, value: capture });
  Object.defineProperty(tabBar, 'releasePointerCapture', { configurable: true, value: release });
  Object.defineProperty(tabBar, 'hasPointerCapture', {
    configurable: true,
    value: hasPointerCapture,
  });
  Object.defineProperty(tabBar, 'offsetWidth', { configurable: true, value: barWidth });

  const pill = document.createElement('div');
  pill.className = styles.activeBg;
  tabBar.appendChild(pill);

  const tabButtons = specs.map((spec) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = styles.tab;
    tab.textContent = spec.label;
    Object.defineProperty(tab, 'offsetLeft', { configurable: true, value: spec.left });
    Object.defineProperty(tab, 'offsetWidth', { configurable: true, value: spec.width });
    tabBar.appendChild(tab);
    return tab;
  });

  document.body.appendChild(tabBar);

  return {
    tabBar,
    tabBarRef: { current: tabBar },
    tabButtons,
    tabs: specs.map(({ id, label }) => ({ id, label })),
    pill,
    capture,
    release,
    hasPointerCapture,
  };
}

// The hook coalesces measurement into a frame, so tests capture the callbacks and run them by hand.
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

function pointerEvent(
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  init: { clientX: number; pointerId?: number; target?: HTMLElement },
): ReactPointerEvent<HTMLElement> {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: init.clientX,
    pointerId: init.pointerId ?? 1,
  });
  if (init.target) {
    Object.defineProperty(event, 'target', { value: init.target });
  }
  return event as unknown as ReactPointerEvent<HTMLElement>;
}

interface RenderOptions {
  activeIndex?: number;
  activeId?: string | null;
  windowWidth?: number;
}

function renderDragHook(harness: DragHarness, options: RenderOptions = {}) {
  const scrollToTarget = vi.fn();
  const view = renderHook(() =>
    useBottomNavDrag({
      tabBarRef: harness.tabBarRef,
      activeIndex: options.activeIndex ?? 1,
      activeId: options.activeId === undefined ? 'beta' : options.activeId,
      tabs: harness.tabs,
      windowWidth: options.windowWidth ?? 400,
      scrollToTarget,
    }),
  );

  return { ...view, scrollToTarget };
}

function startDrag(
  harness: DragHarness,
  handlePointerDown: (event: ReactPointerEvent<HTMLElement>) => void,
  clientX = 100,
): void {
  act(() => {
    handlePointerDown(pointerEvent('pointerdown', { clientX, pointerId: 1, target: harness.pill }));
  });
}

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('useBottomNavDrag measurement', () => {
  it('measures the active tab position on the next animation frame', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();

    const { result } = renderDragHook(harness, { activeIndex: 1, activeId: 'beta' });
    expect(frames).toHaveLength(1);
    expect(result.current.pillLeft).toBe(0);

    runNextFrame(frames);

    expect(result.current.pillLeft).toBe(70);
    expect(result.current.pillWidth).toBe(80);
  });

  it('leaves the pill unmeasured when no tab carries the active index', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();

    const { result } = renderDragHook(harness, { activeIndex: 9, activeId: 'missing' });
    runNextFrame(frames);

    expect(result.current.pillLeft).toBe(0);
    expect(result.current.pillWidth).toBe(0);
  });

  it('defers measurement until the bar, viewport, and active index are all ready', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();
    const scrollToTarget = vi.fn();
    const detachedRef: { current: HTMLElement | null } = { current: null };

    const { rerender } = renderHook(
      ({
        ref,
        windowWidth,
        activeIndex,
      }: {
        ref: { current: HTMLElement | null };
        windowWidth: number;
        activeIndex: number;
      }) =>
        useBottomNavDrag({
          tabBarRef: ref,
          activeIndex,
          activeId: 'beta',
          tabs: harness.tabs,
          windowWidth,
          scrollToTarget,
        }),
      { initialProps: { ref: detachedRef, windowWidth: 0, activeIndex: -1 } },
    );

    expect(frames).toHaveLength(0);

    rerender({ ref: harness.tabBarRef, windowWidth: 0, activeIndex: -1 });
    expect(frames).toHaveLength(0);

    rerender({ ref: harness.tabBarRef, windowWidth: 400, activeIndex: -1 });
    expect(frames).toHaveLength(0);

    rerender({ ref: harness.tabBarRef, windowWidth: 400, activeIndex: 1 });
    expect(frames).toHaveLength(1);
  });

  it('stops measuring while a drag is in progress', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();

    const { result } = renderDragHook(harness);
    runNextFrame(frames);
    expect(result.current.pillLeft).toBe(70);

    startDrag(harness, result.current.handlePointerDown);

    expect(frames).toHaveLength(0);
  });
});

describe('useBottomNavDrag pointer down', () => {
  it('starts a drag from the active pill and captures the pointer', () => {
    const harness = createHarness(DEFAULT_TABS);
    captureAnimationFrames();
    const { result } = renderDragHook(harness);

    const down = pointerEvent('pointerdown', { clientX: 120, pointerId: 7, target: harness.pill });
    act(() => {
      result.current.handlePointerDown(down);
    });

    expect(down.defaultPrevented).toBe(true);
    expect(result.current.isDragging).toBe(true);
    expect(result.current.dragHoveredId).toBe('beta');
    expect(harness.capture).toHaveBeenCalledWith(7);
  });

  it('starts a drag from a child of the active tab', () => {
    const harness = createHarness(DEFAULT_TABS);
    captureAnimationFrames();
    const { result } = renderDragHook(harness);
    const activeTab = harness.tabButtons[1];
    activeTab.className = `${styles.tab} ${styles.active}`;
    const child = document.createElement('span');
    activeTab.appendChild(child);

    act(() => {
      result.current.handlePointerDown(pointerEvent('pointerdown', { clientX: 10, target: child }));
    });

    expect(result.current.isDragging).toBe(true);
    expect(result.current.dragHoveredId).toBe('beta');
  });

  it('ignores a pointer-down on a tab that is not active', () => {
    const harness = createHarness(DEFAULT_TABS);
    captureAnimationFrames();
    const { result } = renderDragHook(harness);

    act(() => {
      result.current.handlePointerDown(
        pointerEvent('pointerdown', { clientX: 10, target: harness.tabButtons[0] }),
      );
    });

    expect(result.current.isDragging).toBe(false);
    expect(harness.capture).not.toHaveBeenCalled();
  });

  it('ignores a pointer-down event without a target', () => {
    const harness = createHarness(DEFAULT_TABS);
    captureAnimationFrames();
    const { result } = renderDragHook(harness);
    const targetless = pointerEvent('pointerdown', { clientX: 10 });

    act(() => {
      result.current.handlePointerDown(targetless);
    });

    expect(result.current.isDragging).toBe(false);
  });

  it('does not start a drag when the tab bar ref is empty', () => {
    const harness = createHarness(DEFAULT_TABS);
    captureAnimationFrames();
    const { result } = renderDragHook(harness);
    harness.tabBarRef.current = null;

    act(() => {
      result.current.handlePointerDown(
        pointerEvent('pointerdown', { clientX: 10, target: harness.pill }),
      );
    });

    expect(result.current.isDragging).toBe(false);
    expect(harness.capture).not.toHaveBeenCalled();
  });
});

describe('useBottomNavDrag pointer move', () => {
  it('tracks the raw pointer delta and highlights the nearest tab', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();
    const { result } = renderDragHook(harness);
    runNextFrame(frames);

    startDrag(harness, result.current.handlePointerDown, 100);
    act(() => {
      result.current.handlePointerMove(
        pointerEvent('pointermove', { clientX: 140, target: harness.tabBar }),
      );
    });

    expect(result.current.dragOffset).toBe(40);
    // Pill center lands at 150px: nearest tab is gamma (center 185px)
    expect(result.current.dragHoveredId).toBe('gamma');
  });

  it('clamps the drag at the leading edge of the bar', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();
    const { result } = renderDragHook(harness);
    runNextFrame(frames);

    startDrag(harness, result.current.handlePointerDown, 100);
    act(() => {
      result.current.handlePointerMove(
        pointerEvent('pointermove', { clientX: 0, target: harness.tabBar }),
      );
    });

    // The pill may not travel past the 4px inset
    expect(result.current.dragOffset).toBe(4 - 70);
  });

  it('clamps the drag at the trailing edge of the bar', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();
    const { result } = renderDragHook(harness);
    runNextFrame(frames);

    startDrag(harness, result.current.handlePointerDown, 100);
    act(() => {
      result.current.handlePointerMove(
        pointerEvent('pointermove', { clientX: 500, target: harness.tabBar }),
      );
    });

    // The pill may not travel past barWidth - pillWidth - 4px
    expect(result.current.dragOffset).toBe(400 - 80 - 4 - 70);
  });

  it('ignores pointer moves before a drag starts', () => {
    const harness = createHarness(DEFAULT_TABS);
    captureAnimationFrames();
    const { result } = renderDragHook(harness);

    act(() => {
      result.current.handlePointerMove(
        pointerEvent('pointermove', { clientX: 300, target: harness.tabBar }),
      );
    });

    expect(result.current.dragOffset).toBe(0);
    expect(result.current.dragHoveredId).toBeNull();
  });

  it('ignores pointer moves once the tab bar ref is gone', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();
    const { result } = renderDragHook(harness);
    runNextFrame(frames);

    startDrag(harness, result.current.handlePointerDown, 100);
    harness.tabBarRef.current = null;
    act(() => {
      result.current.handlePointerMove(
        pointerEvent('pointermove', { clientX: 300, target: harness.tabBar }),
      );
    });

    expect(result.current.dragOffset).toBe(0);
  });
});

describe('useBottomNavDrag pointer up', () => {
  it('snaps the pill to the nearest tab and scrolls to it', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();
    const { result, scrollToTarget } = renderDragHook(harness);
    runNextFrame(frames);

    startDrag(harness, result.current.handlePointerDown, 100);
    act(() => {
      result.current.handlePointerMove(
        pointerEvent('pointermove', { clientX: 200, target: harness.tabBar }),
      );
    });

    const addEventListener = vi.spyOn(harness.tabBar, 'addEventListener');
    act(() => {
      result.current.handlePointerUp(
        pointerEvent('pointerup', { clientX: 200, pointerId: 1, target: harness.tabBar }),
      );
    });

    expect(result.current.isDragging).toBe(false);
    expect(result.current.dragHoveredId).toBeNull();
    expect(result.current.dragOffset).toBe(0);
    expect(result.current.pillLeft).toBe(160);
    expect(result.current.pillWidth).toBe(50);
    expect(scrollToTarget).toHaveBeenCalledWith('gamma');
    expect(harness.release).toHaveBeenCalledWith(1);
    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function), {
      capture: true,
      once: true,
    });
  });

  it('swallows exactly one click after a drag so the tab under the finger does not fire', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();
    const { result } = renderDragHook(harness);
    runNextFrame(frames);

    startDrag(harness, result.current.handlePointerDown, 100);
    act(() => {
      result.current.handlePointerMove(
        pointerEvent('pointermove', { clientX: 200, target: harness.tabBar }),
      );
    });
    act(() => {
      result.current.handlePointerUp(
        pointerEvent('pointerup', { clientX: 200, pointerId: 1, target: harness.tabBar }),
      );
    });

    const outsideClick = vi.fn();
    document.addEventListener('click', outsideClick);

    act(() => {
      harness.pill.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(outsideClick).not.toHaveBeenCalled();

    act(() => {
      harness.pill.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(outsideClick).toHaveBeenCalledTimes(1);

    document.removeEventListener('click', outsideClick);
  });

  it('keeps the active section when the drag settles back on it', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();
    const { result, scrollToTarget } = renderDragHook(harness);
    runNextFrame(frames);

    startDrag(harness, result.current.handlePointerDown, 100);
    act(() => {
      result.current.handlePointerUp(
        pointerEvent('pointerup', { clientX: 102, pointerId: 1, target: harness.tabBar }),
      );
    });

    expect(result.current.dragOffset).toBe(0);
    expect(result.current.pillLeft).toBe(70);
    expect(result.current.pillWidth).toBe(80);
    expect(scrollToTarget).not.toHaveBeenCalled();
  });

  it('does not release pointer capture the bar no longer holds', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();
    harness.hasPointerCapture.mockReturnValue(false);
    const { result } = renderDragHook(harness);
    runNextFrame(frames);

    startDrag(harness, result.current.handlePointerDown, 100);
    act(() => {
      result.current.handlePointerUp(
        pointerEvent('pointerup', { clientX: 200, pointerId: 1, target: harness.tabBar }),
      );
    });

    expect(harness.hasPointerCapture).toHaveBeenCalledWith(1);
    expect(harness.release).not.toHaveBeenCalled();
  });

  it('ignores a pointer-up when no drag is active', () => {
    const harness = createHarness(DEFAULT_TABS);
    captureAnimationFrames();
    const { result } = renderDragHook(harness);

    act(() => {
      result.current.handlePointerUp(
        pointerEvent('pointerup', { clientX: 200, pointerId: 1, target: harness.tabBar }),
      );
    });

    expect(result.current.isDragging).toBe(false);
    expect(result.current.dragOffset).toBe(0);
  });

  it('resets the drag without scrolling when the bar disappears before pointer-up', () => {
    const harness = createHarness(DEFAULT_TABS);
    const frames = captureAnimationFrames();
    const { result, scrollToTarget } = renderDragHook(harness);
    runNextFrame(frames);

    startDrag(harness, result.current.handlePointerDown, 100);
    harness.tabBarRef.current = null;
    act(() => {
      result.current.handlePointerUp(
        pointerEvent('pointerup', { clientX: 200, pointerId: 1, target: harness.pill }),
      );
    });

    expect(result.current.isDragging).toBe(false);
    expect(result.current.dragOffset).toBe(0);
    expect(scrollToTarget).not.toHaveBeenCalled();
  });

  it('resets the offset without snapping when the bar has no tabs left', () => {
    const harness = createHarness([]);
    const frames = captureAnimationFrames();
    const { result, scrollToTarget } = renderDragHook(harness, {
      activeIndex: 0,
      activeId: 'alpha',
    });
    runNextFrame(frames);

    harness.pill.className = styles.activeBg;
    startDrag(harness, result.current.handlePointerDown, 100);
    act(() => {
      result.current.handlePointerMove(
        pointerEvent('pointermove', { clientX: 160, target: harness.tabBar }),
      );
    });
    act(() => {
      result.current.handlePointerUp(
        pointerEvent('pointerup', { clientX: 160, pointerId: 1, target: harness.tabBar }),
      );
    });

    expect(result.current.dragOffset).toBe(0);
    expect(result.current.pillLeft).toBe(0);
    expect(scrollToTarget).not.toHaveBeenCalled();
  });
});
