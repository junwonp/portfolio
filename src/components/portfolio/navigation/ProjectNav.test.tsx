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
import ProjectNav from './ProjectNav';

const TABS = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
];

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

describe('ProjectNav rendering', () => {
  it('renders the section tabs and marks the active one', () => {
    render(<ProjectNav tabs={TABS} />);

    expect(screen.getByRole('navigation', { name: 'Project navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(screen.getByRole('button', { name: 'Beta' })).not.toHaveAttribute('aria-current');
  });

  it('hides the tab bar when the article has no sections', () => {
    render(<ProjectNav tabs={[]} />);

    expect(screen.queryByRole('navigation', { name: 'Project navigation' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
  });

  it('highlights the hovered tab instead of the active one while dragging', () => {
    pillState.value.isDragging = true;
    pillState.value.dragHoveredId = 'beta';

    render(<ProjectNav tabs={TABS} />);

    expect(screen.getByRole('button', { name: 'Beta' }).classList.contains(styles.active)).toBe(
      true,
    );
    expect(screen.getByRole('button', { name: 'Alpha' }).classList.contains(styles.active)).toBe(
      false,
    );
  });

  it('resolves a bare GitHub handle into a full profile URL', () => {
    const { unmount } = render(<ProjectNav tabs={TABS} githubLink="junwonp" />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/junwonp',
    );
    unmount();

    render(<ProjectNav tabs={TABS} githubLink="https://github.com/other" />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/other',
    );
  });

  it('renders only the outbound links that were provided', () => {
    const { unmount } = render(
      <ProjectNav tabs={TABS} productLink="https://example.com/product" />,
    );
    expect(screen.getByRole('link', { name: 'Visit site' })).toHaveAttribute(
      'href',
      'https://example.com/product',
    );
    expect(screen.queryByRole('link', { name: 'GitHub' })).toBeNull();
    unmount();

    render(<ProjectNav tabs={TABS} githubLink={null} productLink={null} />);
    expect(screen.queryByRole('link', { name: 'GitHub' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Visit site' })).toBeNull();
  });
});

describe('ProjectNav interaction', () => {
  it('returns to the previous page from the back button', async () => {
    const user = userEvent.setup();
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    render(<ProjectNav tabs={TABS} />);

    await user.click(screen.getByRole('button', { name: 'Go back' }));

    expect(back).toHaveBeenCalledTimes(1);
  });

  it('scrolls to the tab selected by a real click', async () => {
    const user = userEvent.setup();
    render(<ProjectNav tabs={TABS} />);

    await user.click(screen.getByRole('button', { name: 'Beta' }));

    expect(pillState.value.scrollToTarget).toHaveBeenCalledWith('beta');
  });

  it('ignores tab clicks while a drag is in progress', async () => {
    const user = userEvent.setup();
    pillState.value.isDragging = true;
    render(<ProjectNav tabs={TABS} />);

    await user.click(screen.getByRole('button', { name: 'Beta' }));

    expect(pillState.value.scrollToTarget).not.toHaveBeenCalled();
  });

  it('wires the pointer handlers onto the tab bar', async () => {
    const user = userEvent.setup();
    render(<ProjectNav tabs={TABS} />);
    const nav = screen.getByRole('navigation', { name: 'Project navigation' });

    await user.pointer([{ keys: '[MouseLeft>]', target: nav }, { keys: '[/MouseLeft]' }]);

    expect(pillState.value.handlePointerDown).toHaveBeenCalledTimes(1);
    expect(pillState.value.handlePointerUp).toHaveBeenCalledTimes(1);
  });
});
