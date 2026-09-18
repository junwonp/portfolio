// @vitest-environment jsdom
// @module-tag dom
import { act, cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The theme module and transport stay real so persistence, DOM and beacon effects are asserted together; only sendBeacon is stubbed, where payload assertions land.
const sendBeacon = vi.hoisted(() => vi.fn<(url: string, data: string) => boolean>());

import ThemeToggle from '@/components/ui/ThemeToggle';
import * as styles from '@/components/ui/ThemeToggle.css';
import { applyPreference } from '@/lib/theme';

const SESSION_ID = 'session-theme';

const LABELS = {
  autoLabel: '시스템 테마',
  lightLabel: '라이트 테마',
  darkLabel: '다크 테마',
};

const toggleButton = (): HTMLElement => screen.getByRole('button');

const isDarkApplied = (): boolean => document.documentElement.classList.contains('dark');

const beacons = (): Record<string, unknown>[] =>
  sendBeacon.mock.calls.map(([, data]) => JSON.parse(data) as Record<string, unknown>);

const lastBeacon = (): Record<string, unknown> | undefined => beacons().at(-1);

const stubSystemDark = (systemDark: boolean): void => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: systemDark })),
  );
};

const renderToggle = (
  props: Partial<Parameters<typeof ThemeToggle>[0]> = {},
): ReturnType<typeof render> => render(<ThemeToggle {...LABELS} {...props} />);

beforeEach(() => {
  Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: sendBeacon });
  document.documentElement.classList.remove('dark');
  localStorage.clear();
  sessionStorage.setItem('portfolio_analytics_session_id', SESSION_ID);
  stubSystemDark(false);
});

afterEach(() => {
  cleanup();
  sendBeacon.mockClear();
  Reflect.deleteProperty(navigator, 'sendBeacon');
  vi.unstubAllGlobals();
  document.documentElement.classList.remove('dark');
  localStorage.clear();
  sessionStorage.clear();
});

describe('ThemeToggle rendering', () => {
  it('labels the button from the auto preference and shows a sun icon', () => {
    const { container } = renderToggle();

    expect(toggleButton()).toHaveAttribute('type', 'button');
    expect(toggleButton()).toHaveAccessibleName(LABELS.autoLabel);
    expect(toggleButton()).toHaveAttribute('title', LABELS.autoLabel);
    expect(toggleButton()).toHaveTextContent(LABELS.autoLabel);
    expect(container.querySelector('.lucide-sun')).not.toBeNull();
    expect(container.querySelector('.lucide-moon')).toBeNull();
    expect(toggleButton()).toHaveClass(styles.toggle);
  });

  it('shows the dark label and a moon icon for the stored dark preference', () => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');

    const { container } = renderToggle();

    expect(toggleButton()).toHaveAccessibleName(LABELS.darkLabel);
    expect(container.querySelector('.lucide-moon')).not.toBeNull();
    expect(container.querySelector('.lucide-sun')).toBeNull();
  });

  it('shows the light label for the stored light preference', () => {
    localStorage.setItem('theme', 'light');
    const { container } = renderToggle();

    expect(toggleButton()).toHaveAccessibleName(LABELS.lightLabel);
    expect(container.querySelector('.lucide-sun')).not.toBeNull();
  });

  it('honours a custom icon size and className', () => {
    const { container } = renderToggle({ className: 'surface-toggle', iconSize: 24 });

    expect(toggleButton()).toHaveClass('surface-toggle');
    expect(toggleButton()).not.toHaveClass(styles.toggle);
    expect(container.querySelector('svg')).toHaveAttribute('width', '24');
    expect(container.querySelector('svg')).toHaveAttribute('height', '24');
  });
});

// The server snapshots (null preference, light theme) are only reachable while rendering for hydration, so this case uses a static render.
describe('ThemeToggle server render', () => {
  it('renders the neutral auto label and sun icon before hydration', () => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');

    const html = renderToStaticMarkup(<ThemeToggle {...LABELS} />);

    expect(html).toContain(`aria-label="${LABELS.autoLabel}"`);
    expect(html).toContain('lucide-sun');
    expect(html).not.toContain('lucide-moon');
  });
});

describe('ThemeToggle interaction', () => {
  it('applies, persists and beacons the switch to dark', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const { container } = renderToggle({ onToggle });

    await user.click(toggleButton());

    expect(isDarkApplied()).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(toggleButton()).toHaveAccessibleName(LABELS.darkLabel);
    expect(container.querySelector('.lucide-moon')).not.toBeNull();
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(sendBeacon.mock.calls[0][0]).toBe('/api/analytics/track');
    expect(lastBeacon()).toEqual({
      action: 'open',
      eventType: 'interaction',
      interactionLabel: 'dark',
      interactionType: 'theme_toggle',
      referrer: 'direct',
      sessionId: SESSION_ID,
    });
  });

  it('returns to auto mode when the switch lands back on the system theme', async () => {
    const user = userEvent.setup();
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
    renderToggle();

    await user.click(toggleButton());

    expect(isDarkApplied()).toBe(false);
    expect(localStorage.getItem('theme')).toBeNull();
    expect(toggleButton()).toHaveAccessibleName(LABELS.autoLabel);
    expect(lastBeacon()).toMatchObject({ interactionLabel: 'light' });
  });

  it('clears the stored preference when dark matches a dark system', async () => {
    const user = userEvent.setup();
    stubSystemDark(true);
    localStorage.setItem('theme', 'light');
    renderToggle();

    await user.click(toggleButton());

    expect(isDarkApplied()).toBe(true);
    expect(localStorage.getItem('theme')).toBeNull();
    expect(toggleButton()).toHaveAccessibleName(LABELS.autoLabel);
    expect(lastBeacon()).toMatchObject({ interactionLabel: 'dark' });
  });

  it('follows an external theme change while mounted', () => {
    renderToggle();

    act(() => {
      applyPreference('dark');
    });

    expect(toggleButton()).toHaveAccessibleName(LABELS.darkLabel);
    expect(isDarkApplied()).toBe(true);
  });

  it('beacons a light interaction on the second click', async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(toggleButton());
    await user.click(toggleButton());

    expect(isDarkApplied()).toBe(false);
    expect(localStorage.getItem('theme')).toBeNull();
    expect(lastBeacon()).toMatchObject({ interactionLabel: 'light' });
  });
});
