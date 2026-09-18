// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The outbound-link logic and transport stay real so the click path runs end to end; only sendBeacon is stubbed, and payload assertions land there.
const sendBeacon = vi.hoisted(() => vi.fn<(url: string, data: string) => boolean>());

import OutboundLink from '@/components/ui/OutboundLink';

const SESSION_ID = 'session-outbound';

const beacons = (): Record<string, unknown>[] =>
  sendBeacon.mock.calls.map(([, data]) => JSON.parse(data) as Record<string, unknown>);

const lastBeacon = (): Record<string, unknown> | undefined => beacons().at(-1);

// jsdom has no navigation and a real anchor click logs unimplemented navigation; this capture listener cancels the default while React's handler still runs.
const suppressNavigation = (event: Event): void => event.preventDefault();

beforeEach(() => {
  document.addEventListener('click', suppressNavigation, true);
  Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: sendBeacon });
  sessionStorage.setItem('portfolio_analytics_session_id', SESSION_ID);
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  document.removeEventListener('click', suppressNavigation, true);
  sendBeacon.mockClear();
  Reflect.deleteProperty(navigator, 'sendBeacon');
  sessionStorage.clear();
  localStorage.clear();
});

describe('OutboundLink anchor', () => {
  it('opens the destination in a new tab with a safe rel', () => {
    render(
      <OutboundLink
        ariaLabel="GitHub 프로필"
        className="link-class"
        href="https://github.com/junwon"
        title="GitHub"
      >
        GitHub
      </OutboundLink>,
    );
    const link = screen.getByRole('link', { name: 'GitHub 프로필' });

    expect(link).toHaveAttribute('href', 'https://github.com/junwon');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('title', 'GitHub');
    expect(link).toHaveClass('link-class');
    expect(link).toHaveTextContent('GitHub');
  });
});

describe('OutboundLink click reporting', () => {
  it('beacons the known host when the link is clicked', async () => {
    const user = userEvent.setup();
    render(<OutboundLink href="https://github.com/junwon">GitHub</OutboundLink>);

    await user.click(screen.getByRole('link', { name: 'GitHub' }));

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(sendBeacon.mock.calls[0][0]).toBe('/api/analytics/track');
    expect(lastBeacon()).toEqual({
      action: 'open',
      eventType: 'interaction',
      interactionLabel: 'github',
      interactionType: 'outbound_link',
      referrer: 'direct',
      sessionId: SESSION_ID,
    });
  });

  it('derives the label from the href it actually renders', async () => {
    const user = userEvent.setup();
    render(<OutboundLink href="https://news.ycombinator.com/item?id=1">Discussion</OutboundLink>);

    await user.click(screen.getByRole('link', { name: 'Discussion' }));

    expect(lastBeacon()).toMatchObject({ interactionLabel: 'external:ycombinator.com' });
  });

  it('reports mailto destinations as email', async () => {
    const user = userEvent.setup();
    render(<OutboundLink href="mailto:hello@example.com">Mail</OutboundLink>);

    await user.click(screen.getByRole('link', { name: 'Mail' }));

    expect(lastBeacon()).toMatchObject({ interactionLabel: 'email' });
  });

  it('skips internal, same-origin and untracked destinations', async () => {
    const user = userEvent.setup();
    render(
      <>
        <OutboundLink href="/projects/aira">Internal</OutboundLink>
        <OutboundLink href="http://localhost:3000/projects/aira">Same origin</OutboundLink>
        <OutboundLink href="tel:+821012345678">Phone</OutboundLink>
      </>,
    );

    await user.click(screen.getByRole('link', { name: 'Internal' }));
    await user.click(screen.getByRole('link', { name: 'Same origin' }));
    await user.click(screen.getByRole('link', { name: 'Phone' }));

    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it('honours the visitor opt-out for the click it reports', async () => {
    const user = userEvent.setup();
    localStorage.setItem('portfolio_analytics_ignore', 'true');
    render(<OutboundLink href="https://github.com/junwon">GitHub</OutboundLink>);

    await user.click(screen.getByRole('link', { name: 'GitHub' }));

    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it('runs the caller handler after reporting the click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <OutboundLink href="https://www.linkedin.com/in/junwon" onClick={onClick}>
        LinkedIn
      </OutboundLink>,
    );

    await user.click(screen.getByRole('link', { name: 'LinkedIn' }));

    expect(lastBeacon()).toMatchObject({ interactionLabel: 'linkedin' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
