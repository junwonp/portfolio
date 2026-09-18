// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const scrollSpyMock = vi.hoisted(() => ({
  useScrollSpy: vi.fn((_getIds: () => string[]) => 'beta'),
  getPageScrollY: vi.fn(() => 100),
  scrollPageTo: vi.fn(),
}));
vi.mock('@/lib/hooks/useScrollSpy', () => scrollSpyMock);

import DesktopSideNav from './DesktopSideNav';

const SECTIONS = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
];

function mountSection(id: string, top: number): void {
  const section = document.createElement('section');
  section.id = id;
  vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({
    bottom: top,
    height: 0,
    left: 0,
    right: 0,
    top,
    width: 0,
    x: 0,
    y: top,
    toJSON: () => ({}),
  });
  document.body.appendChild(section);
}

beforeEach(() => {
  scrollSpyMock.useScrollSpy.mockReturnValue('beta');
  scrollSpyMock.getPageScrollY.mockReturnValue(100);
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('DesktopSideNav', () => {
  it('renders the sections and marks the scrolled-to section as current', () => {
    render(<DesktopSideNav sections={SECTIONS} />);

    expect(screen.getByRole('navigation', { name: 'Page sections' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Beta' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(screen.getByRole('button', { name: 'Alpha' })).not.toHaveAttribute('aria-current');
  });

  it('tracks the section ids passed to the scroll spy', () => {
    render(<DesktopSideNav sections={SECTIONS} />);

    const getIds = scrollSpyMock.useScrollSpy.mock.calls[0]?.[0];
    expect(getIds?.()).toEqual(['alpha', 'beta']);
  });

  it('does not scroll when the requested section is missing from the document', async () => {
    const user = userEvent.setup();
    render(<DesktopSideNav sections={SECTIONS} />);

    await user.click(screen.getByRole('button', { name: 'Alpha' }));

    expect(scrollSpyMock.scrollPageTo).not.toHaveBeenCalled();
  });

  it('scrolls to the section top offset by the current page scroll', async () => {
    const user = userEvent.setup();
    mountSection('beta', 150);

    render(<DesktopSideNav sections={SECTIONS} />);
    await user.click(screen.getByRole('button', { name: 'Beta' }));

    expect(scrollSpyMock.scrollPageTo).toHaveBeenCalledWith(250);
  });
});
