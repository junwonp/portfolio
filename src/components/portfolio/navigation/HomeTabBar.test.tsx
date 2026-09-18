// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const pillState = vi.hoisted(() => ({
  value: {
    tabBarRef: { current: null as HTMLElement | null },
    activeId: 'alpha' as string | null,
    scrollToTarget: vi.fn(),
    pillLeft: 10,
    pillWidth: 50,
    isDragging: false,
    dragOffset: 0,
    dragHoveredId: null as string | null,
    handlePointerDown: vi.fn(),
    handlePointerMove: vi.fn(),
    handlePointerUp: vi.fn(),
  },
}));
vi.mock('./useNavPill', () => ({
  useNavPill: () => pillState.value,
}));

import * as styles from './BottomNav.css';
import HomeTabBar from './HomeTabBar';

const TABS = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
];

function renderTabBar(): void {
  render(<HomeTabBar ariaLabel="Section navigation" tabs={TABS} />);
}

function getPill(): HTMLElement {
  const pill = document.querySelector<HTMLElement>('[aria-hidden="true"]');
  if (!pill) {
    throw new Error('active pill element is missing');
  }
  return pill;
}

beforeEach(() => {
  pillState.value.activeId = 'alpha';
  pillState.value.pillLeft = 10;
  pillState.value.pillWidth = 50;
  pillState.value.isDragging = false;
  pillState.value.dragOffset = 0;
  pillState.value.dragHoveredId = null;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('HomeTabBar rendering', () => {
  it('marks the active tab and positions the pill from the measured values', () => {
    renderTabBar();

    expect(screen.getByRole('navigation', { name: 'Section navigation' })).toBeInTheDocument();
    expect(styles.active).not.toBe('');

    const activeTab = screen.getByRole('button', { name: 'Alpha' });
    expect(activeTab).toHaveAttribute('aria-current', 'location');
    expect(activeTab.classList.contains(styles.active)).toBe(true);
    expect(screen.getByRole('button', { name: 'Beta' }).classList.contains(styles.active)).toBe(
      false,
    );

    const pill = getPill();
    expect(pill.style.transform).toBe('translateX(10px)');
    expect(pill.style.width).toBe('50px');
  });

  it('follows the dragged pill and highlights the hovered tab instead of the active one', () => {
    pillState.value.isDragging = true;
    pillState.value.dragOffset = 25;
    pillState.value.dragHoveredId = 'beta';

    renderTabBar();

    const pill = getPill();
    expect(pill.classList.contains(styles.dragging)).toBe(true);
    expect(pill.style.transform).toBe('translateX(35px)');
    expect(screen.getByRole('button', { name: 'Beta' }).classList.contains(styles.active)).toBe(
      true,
    );
    expect(screen.getByRole('button', { name: 'Alpha' }).classList.contains(styles.active)).toBe(
      false,
    );
    expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute(
      'aria-current',
      'location',
    );
  });
});

describe('HomeTabBar interaction', () => {
  it('scrolls to the tab selected by a real click', async () => {
    const user = userEvent.setup();
    renderTabBar();

    await user.click(screen.getByRole('button', { name: 'Beta' }));

    expect(pillState.value.scrollToTarget).toHaveBeenCalledTimes(1);
    expect(pillState.value.scrollToTarget).toHaveBeenCalledWith('beta');
  });

  it('ignores tab clicks while a drag is in progress', async () => {
    const user = userEvent.setup();
    pillState.value.isDragging = true;
    renderTabBar();

    await user.click(screen.getByRole('button', { name: 'Beta' }));

    expect(pillState.value.scrollToTarget).not.toHaveBeenCalled();
  });

  it('wires the pointer handlers onto the tab bar', async () => {
    const user = userEvent.setup();
    renderTabBar();
    const nav = screen.getByRole('navigation', { name: 'Section navigation' });

    await user.pointer([{ keys: '[MouseLeft>]', target: nav }, { keys: '[/MouseLeft]' }]);

    expect(pillState.value.handlePointerDown).toHaveBeenCalledTimes(1);
    expect(pillState.value.handlePointerUp).toHaveBeenCalledTimes(1);
  });
});
