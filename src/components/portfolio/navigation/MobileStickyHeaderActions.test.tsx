// @vitest-environment jsdom
// @module-tag dom
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { MockInstance } from 'vitest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const localeState = vi.hoisted(() => ({
  locale: 'ko' as 'ko' | 'en',
  setLocale: vi.fn(),
}));
vi.mock('@/lib/contexts/LocaleContext', async () => {
  const labelsModule =
    await vi.importActual<typeof import('@/lib/portfolio/labels')>('@/lib/portfolio/labels');
  return {
    useLocale: () => ({
      locale: localeState.locale,
      labels: labelsModule.getLabels(localeState.locale),
      setLocale: localeState.setLocale,
    }),
  };
});

const pathnameState = vi.hoisted(() => ({ value: '/' }));
vi.mock('next/navigation', () => ({
  usePathname: () => pathnameState.value,
}));

vi.mock('@/lib/analytics/analyticsTransport', () => ({ reportInteraction: vi.fn() }));
vi.mock('@/lib/analytics/outboundLinks', () => ({ reportOutboundLink: vi.fn() }));

import { reportInteraction } from '@/lib/analytics/analyticsTransport';
import { reportOutboundLink } from '@/lib/analytics/outboundLinks';
import { getLabels } from '@/lib/portfolio/labels';

import MobileStickyHeaderActions from './MobileStickyHeaderActions';

// jsdom has no Popover API, so the component's hidePopover call needs a stand-in.
const hidePopover = vi.fn();
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'hidePopover', {
    configurable: true,
    writable: true,
    value: hidePopover,
  });
});
afterAll(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'hidePopover');
});

// A closed popover is hidden from the accessibility tree, so menu queries opt into hidden nodes.
const MENU_QUERY = { hidden: true } as const;

function renderActions(
  props: Partial<{ githubLink: string; linkedinLink: string; name: string }> = {},
) {
  return render(<MobileStickyHeaderActions name="Junwon" {...props} />);
}

function getMoreButton(): HTMLElement {
  return screen.getByRole('button', { name: 'More actions' });
}

function getMenu(): HTMLElement {
  const menu = document.getElementById('more-actions-menu');
  if (!menu) {
    throw new Error('more actions menu is missing');
  }
  return menu;
}

function getMenuButton(name: string): HTMLElement {
  return screen.getByRole('button', { name, ...MENU_QUERY });
}

function stubShare(implementation: () => Promise<void>): ReturnType<typeof vi.fn> {
  const share = vi.fn(implementation);
  Object.defineProperty(window.navigator, 'share', { configurable: true, value: share });
  return share;
}

function stubClipboard(writeText: () => Promise<void>): ReturnType<typeof vi.fn> {
  const clipboardWrite = vi.fn(writeText);
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: { writeText: clipboardWrite },
  });
  return clipboardWrite;
}

function createToggleEvent(newState: 'open' | 'closed'): Event {
  const event = new Event('toggle', { bubbles: true });
  Object.defineProperty(event, 'newState', { value: newState });
  return event;
}

function createRect(values: { bottom: number; right: number }): DOMRect {
  return {
    bottom: values.bottom,
    height: 0,
    left: 0,
    right: values.right,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };
}

interface CapturedTimer {
  callback: () => void;
  timerId: ReturnType<typeof setTimeout>;
  index: number;
}

// userEvent does not run under Vitest fake timers, so the copy-reset timer is captured instead.
function takeScheduledTimer(spy: MockInstance, delay: number, fromIndex = 0): CapturedTimer {
  const index = spy.mock.calls.findIndex((call, callIndex) => {
    return callIndex >= fromIndex && call[1] === delay;
  });
  if (index === -1) {
    throw new Error(`no ${String(delay)}ms timer was scheduled`);
  }
  return {
    callback: spy.mock.calls[index]?.[0] as () => void,
    timerId: spy.mock.results[index]?.value as ReturnType<typeof setTimeout>,
    index,
  };
}

beforeEach(() => {
  localeState.locale = 'ko';
  pathnameState.value = '/';
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(window.navigator, 'share');
  Reflect.deleteProperty(window.navigator, 'clipboard');
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('MobileStickyHeaderActions language toggle', () => {
  it('switches to English from the desktop toggle and reports the interaction', async () => {
    const user = userEvent.setup();
    renderActions();

    await user.click(screen.getByRole('button', { name: 'English' }));

    expect(localeState.setLocale).toHaveBeenCalledWith('en');
    expect(reportInteraction).toHaveBeenCalledWith({
      interactionType: 'locale_switch',
      interactionLabel: 'en',
      action: 'open',
    });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows the mobile toggle label and switches back to Korean', async () => {
    localeState.locale = 'en';
    const user = userEvent.setup();
    renderActions();

    const mobileToggle = screen.getByRole('button', { name: getLabels('en').toggleLanguage });
    expect(mobileToggle).toHaveTextContent('KO');

    await user.click(mobileToggle);

    expect(localeState.setLocale).toHaveBeenCalledWith('ko');
    expect(reportInteraction).toHaveBeenCalledWith(
      expect.objectContaining({ interactionLabel: 'ko' }),
    );
  });

  it('surfaces an error alert when the switch fails and clears it on the next attempt', async () => {
    const user = userEvent.setup();
    localeState.setLocale.mockImplementationOnce(() => {
      throw new Error('blocked');
    });
    renderActions();

    await user.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByRole('alert')).toHaveTextContent(getLabels('ko').languageToggleError);
    expect(reportInteraction).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.queryByRole('alert')).toBeNull();
    expect(localeState.setLocale).toHaveBeenCalledTimes(2);
  });
});

describe('MobileStickyHeaderActions links and menu', () => {
  it('renders the GitHub link only when a link is given', () => {
    const labels = getLabels('ko');
    const { unmount } = render(
      <MobileStickyHeaderActions name="Junwon" githubLink="https://github.com/junwonp" />,
    );
    expect(screen.getByRole('link', { name: labels.goToGithubPage })).toHaveAttribute(
      'href',
      'https://github.com/junwonp',
    );
    unmount();

    renderActions();
    expect(screen.queryByRole('link', { name: labels.goToGithubPage })).toBeNull();
  });

  it('anchors the more menu under its button when opened', async () => {
    const user = userEvent.setup();
    renderActions();
    const moreButton = getMoreButton();
    vi.spyOn(moreButton, 'getBoundingClientRect').mockReturnValue(
      createRect({ bottom: 120, right: 380 }),
    );
    vi.stubGlobal('innerWidth', 500);

    await user.click(moreButton);

    const menu = getMenu();
    expect(menu.style.getPropertyValue('--menu-top')).toBe('128px');
    expect(menu.style.getPropertyValue('--menu-right')).toBe('120px');
  });

  it('mirrors the popover open state onto aria-expanded', () => {
    renderActions();
    const moreButton = getMoreButton();
    expect(moreButton).toHaveAttribute('aria-expanded', 'false');

    act(() => {
      getMenu().dispatchEvent(createToggleEvent('open'));
    });
    expect(moreButton).toHaveAttribute('aria-expanded', 'true');

    act(() => {
      getMenu().dispatchEvent(createToggleEvent('closed'));
    });
    expect(moreButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('offers the theme toggle from the menu on both localized home paths', () => {
    const labels = getLabels('ko');
    const { unmount } = renderActions();
    expect(getMenuButton(labels.themeAuto)).toBeInTheDocument();
    unmount();

    pathnameState.value = '/en';
    renderActions();
    expect(getMenuButton(labels.themeAuto)).toBeInTheDocument();
  });

  it('hides the theme toggle away from the home paths', () => {
    pathnameState.value = '/projects/alpha';
    renderActions();

    expect(
      screen.queryByRole('button', { name: getLabels('ko').themeAuto, ...MENU_QUERY }),
    ).toBeNull();
  });
});

describe('MobileStickyHeaderActions sharing', () => {
  it('shares the page through the Web Share API and closes the menu', async () => {
    const user = userEvent.setup();
    const share = stubShare(() => Promise.resolve());
    renderActions();

    await user.click(getMenuButton(getLabels('ko').sharePage));

    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(share).toHaveBeenCalledWith({
      text: '',
      title: `Junwon | ${getLabels('ko').resumeTitle}`,
      url: window.location.href,
    });
    await waitFor(() => expect(hidePopover).toHaveBeenCalled());
  });

  it('stays quiet and keeps the share label when the native dialog is dismissed', async () => {
    const user = userEvent.setup();
    const abortError = new Error('cancelled');
    abortError.name = 'AbortError';
    const share = stubShare(() => Promise.reject(abortError));
    const writeText = stubClipboard(() => Promise.resolve());
    renderActions();

    await user.click(getMenuButton(getLabels('ko').sharePage));
    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    await act(async () => {});

    expect(writeText).not.toHaveBeenCalled();
    expect(getMenuButton(getLabels('ko').sharePage)).toBeInTheDocument();
    expect(hidePopover).not.toHaveBeenCalled();
  });

  it('falls back to the clipboard when the native share fails for another reason', async () => {
    const user = userEvent.setup();
    const share = stubShare(() => Promise.reject(new Error('share unavailable')));
    const writeText = stubClipboard(() => Promise.resolve());
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    renderActions();

    await user.click(getMenuButton(getLabels('ko').sharePage));
    await act(async () => {});

    expect(share).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(getMenuButton(getLabels('ko').linkCopied)).toBeInTheDocument();

    const restoreTimer = takeScheduledTimer(setTimeoutSpy, 2000);
    clearTimeout(restoreTimer.timerId);
    act(() => {
      restoreTimer.callback();
    });

    expect(getMenuButton(getLabels('ko').sharePage)).toBeInTheDocument();
  });

  it('copies the link, swaps in the copied label, and restores it after two seconds', async () => {
    const user = userEvent.setup();
    const writeText = stubClipboard(() => Promise.resolve());
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    renderActions();

    await user.click(getMenuButton(getLabels('ko').sharePage));
    await act(async () => {});

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(getMenuButton(getLabels('ko').linkCopied)).toBeInTheDocument();

    const restoreTimer = takeScheduledTimer(setTimeoutSpy, 2000);
    clearTimeout(restoreTimer.timerId);
    act(() => {
      restoreTimer.callback();
    });

    expect(getMenuButton(getLabels('ko').sharePage)).toBeInTheDocument();
  });

  it('restarts the copied-label timer when the share action runs twice', async () => {
    const user = userEvent.setup();
    const writeText = stubClipboard(() => Promise.resolve());
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    renderActions();

    await user.click(getMenuButton(getLabels('ko').sharePage));
    await act(async () => {});
    const firstTimer = takeScheduledTimer(setTimeoutSpy, 2000);

    await user.click(getMenuButton(getLabels('ko').linkCopied));
    await act(async () => {});

    expect(writeText).toHaveBeenCalledTimes(2);
    expect(clearTimeoutSpy).toHaveBeenCalledWith(firstTimer.timerId);

    const secondTimer = takeScheduledTimer(setTimeoutSpy, 2000, firstTimer.index + 1);
    clearTimeout(secondTimer.timerId);
    act(() => {
      secondTimer.callback();
    });

    expect(getMenuButton(getLabels('ko').sharePage)).toBeInTheDocument();
  });

  it('logs and keeps the share label when the clipboard write fails', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const writeText = stubClipboard(() => Promise.reject(new Error('denied')));
    renderActions();

    await user.click(getMenuButton(getLabels('ko').sharePage));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    await act(async () => {});

    expect(consoleError).toHaveBeenCalledWith('Failed to copy link:', expect.any(Error));
    expect(getMenuButton(getLabels('ko').sharePage)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: getLabels('ko').linkCopied, ...MENU_QUERY }),
    ).toBeNull();
  });
});

describe('MobileStickyHeaderActions menu actions', () => {
  it('prints the page from the menu and closes it', async () => {
    const user = userEvent.setup();
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    renderActions();

    await user.click(getMenuButton(getLabels('ko').printPage));

    expect(print).toHaveBeenCalledTimes(1);
    expect(hidePopover).toHaveBeenCalled();
  });

  it('renders the LinkedIn entry only when a link is given and closes the menu on click', async () => {
    const user = userEvent.setup();
    const labels = getLabels('ko');
    const { unmount } = renderActions();
    expect(screen.queryByRole('link', { name: labels.goToLinkedinPage, ...MENU_QUERY })).toBeNull();
    unmount();

    renderActions({ linkedinLink: 'https://www.linkedin.com/in/junwonp' });
    const linkedinLink = screen.getByRole('link', {
      name: labels.goToLinkedinPage,
      ...MENU_QUERY,
    });
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/junwonp');

    await user.click(linkedinLink);

    expect(reportOutboundLink).toHaveBeenCalledWith('https://www.linkedin.com/in/junwonp');
    expect(hidePopover).toHaveBeenCalled();
  });
});

describe('MobileStickyHeaderActions copy timer cleanup', () => {
  it('clears the pending copied-label timer when the component unmounts', async () => {
    // Frozen fake timers deadlock user-event: RTL only advances its asyncWrapper drain when Jest is detected.
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup();
    const writeText = stubClipboard(() => Promise.resolve());
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = renderActions();

    await user.click(getMenuButton(getLabels('ko').sharePage));
    await act(async () => {});

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    const copyTimer = takeScheduledTimer(setTimeoutSpy, 2000);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledWith(copyTimer.timerId);
    expect(vi.getTimerCount()).toBe(0);
  });
});
