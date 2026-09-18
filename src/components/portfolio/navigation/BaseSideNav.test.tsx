// @vitest-environment jsdom
// @module-tag dom
import { act, cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import BaseSideNav from './BaseSideNav';
import * as styles from './BaseSideNav.css';

const SECTIONS = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
];

function stubItemOffsets(items: HTMLElement[], tops: number[], heights: number[]): void {
  items.forEach((item, index) => {
    Object.defineProperty(item, 'offsetTop', { configurable: true, value: tops[index] });
    Object.defineProperty(item, 'offsetHeight', { configurable: true, value: heights[index] });
  });
}

function getActiveBackground(container: HTMLElement): HTMLElement {
  const background = container.querySelector<HTMLElement>('[aria-hidden="true"]');
  if (!background) {
    throw new Error('active background element is missing');
  }
  return background;
}

function resizeTo(width: number): void {
  vi.stubGlobal('innerWidth', width);
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('BaseSideNav markup', () => {
  it('marks the active section with aria-current and the active class', () => {
    render(<BaseSideNav sections={SECTIONS} activeId="beta" onselect={vi.fn()} />);

    expect(screen.getByRole('navigation', { name: 'Page sections' })).toBeInTheDocument();
    expect(styles.active).not.toBe('');

    const activeButton = screen.getByRole('button', { name: 'Beta' });
    expect(activeButton).toHaveAttribute('aria-current', 'location');
    expect(activeButton.classList.contains(styles.active)).toBe(true);

    const inactiveButton = screen.getByRole('button', { name: 'Alpha' });
    expect(inactiveButton).not.toHaveAttribute('aria-current');
    expect(inactiveButton.classList.contains(styles.active)).toBe(false);
  });

  it('uses a custom aria label when one is provided', () => {
    render(
      <BaseSideNav
        sections={SECTIONS}
        activeId={null}
        onselect={vi.fn()}
        ariaLabel="Project sections"
      />,
    );

    const nav = screen.getByRole('navigation', { name: 'Project sections' });
    expect(nav.querySelectorAll('button')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Beta' }).classList.contains(styles.active)).toBe(
      false,
    );
  });

  it('fades the active background out when no section is active', () => {
    const { container, rerender } = render(
      <BaseSideNav sections={SECTIONS} activeId={null} onselect={vi.fn()} />,
    );
    expect(getActiveBackground(container).style.opacity).toBe('0');

    rerender(<BaseSideNav sections={SECTIONS} activeId="alpha" onselect={vi.fn()} />);
    expect(getActiveBackground(container).style.opacity).toBe('1');
  });
});

describe('BaseSideNav measurement', () => {
  it('moves the active background onto the measured item on wide viewports', () => {
    const { container } = render(
      <BaseSideNav sections={SECTIONS} activeId="beta" onselect={vi.fn()} />,
    );
    stubItemOffsets(Array.from(container.querySelectorAll('li')), [12, 58], [40, 44]);

    resizeTo(1200);

    const background = getActiveBackground(container);
    expect(background.style.transform).toBe('translateY(58px)');
    expect(background.style.height).toBe('44px');
  });

  it('collapses the active background on narrow viewports', () => {
    const { container } = render(
      <BaseSideNav sections={SECTIONS} activeId="beta" onselect={vi.fn()} />,
    );
    stubItemOffsets(Array.from(container.querySelectorAll('li')), [12, 58], [40, 44]);

    resizeTo(1200);
    resizeTo(800);

    const background = getActiveBackground(container);
    expect(background.style.transform).toBe('translateY(0px)');
    expect(background.style.height).toBe('0px');
  });

  it('keeps the background collapsed when the active section is unknown', () => {
    const { container } = render(
      <BaseSideNav sections={SECTIONS} activeId="missing" onselect={vi.fn()} />,
    );
    stubItemOffsets(Array.from(container.querySelectorAll('li')), [12, 58], [40, 44]);

    resizeTo(1200);

    const background = getActiveBackground(container);
    expect(background.style.transform).toBe('translateY(0px)');
    expect(background.style.height).toBe('0px');
  });

  it('re-measures after the window grows back past the breakpoint', () => {
    const { container } = render(
      <BaseSideNav sections={SECTIONS} activeId="alpha" onselect={vi.fn()} />,
    );
    stubItemOffsets(Array.from(container.querySelectorAll('li')), [12, 58], [40, 44]);

    resizeTo(800);
    resizeTo(1024);

    const background = getActiveBackground(container);
    expect(background.style.transform).toBe('translateY(12px)');
    expect(background.style.height).toBe('40px');
  });
});

describe('BaseSideNav selection', () => {
  it('reports the selected section id from a real click', async () => {
    const user = userEvent.setup();
    const onselect = vi.fn();
    render(<BaseSideNav sections={SECTIONS} activeId="alpha" onselect={onselect} />);

    await user.click(screen.getByRole('button', { name: 'Beta' }));

    expect(onselect).toHaveBeenCalledTimes(1);
    expect(onselect).toHaveBeenCalledWith('beta');
  });
});
