import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  MAX_OUTBOUND_LABEL_LENGTH,
  outboundLabelFromHref,
  reportOutboundLink,
} from '@/lib/analytics/outboundLinks';

const sendBeacon = vi.fn();
const ORIGIN = 'https://junwon.dev';

function stubBrowser(ignoreAnalytics = false) {
  vi.stubGlobal('window', { location: { origin: ORIGIN, pathname: '/ko' } });
  vi.stubGlobal('sessionStorage', { getItem: vi.fn(() => 'session-1'), setItem: vi.fn() });
  vi.stubGlobal('localStorage', { getItem: vi.fn(() => (ignoreAnalytics ? 'true' : null)) });
  vi.stubGlobal('navigator', { sendBeacon, userAgent: 'Vitest' });
  vi.stubGlobal('document', { referrer: '' });
}

afterEach(() => {
  vi.unstubAllGlobals();
  sendBeacon.mockReset();
});

describe('outboundLabelFromHref', () => {
  it('labels the fixed profile destinations', () => {
    expect(outboundLabelFromHref('https://github.com/junwonp')).toBe('github');
    expect(outboundLabelFromHref('https://gist.github.com/junwonp/1')).toBe('github');
    expect(outboundLabelFromHref('https://www.linkedin.com/in/junwonp')).toBe('linkedin');
    expect(outboundLabelFromHref('mailto:someone@example.com')).toBe('email');
    expect(outboundLabelFromHref('https://resume.junwon.dev')).toBe('resume');
  });

  it('reduces unknown external links to their registrable domain', () => {
    expect(outboundLabelFromHref('https://studio.camerafi.com/app')).toBe('external:camerafi.com');
    expect(outboundLabelFromHref('https://www.example.co.uk/path?q=1')).toBe(
      'external:example.co.uk',
    );
    expect(outboundLabelFromHref('//cdn.example.com/asset.js')).toBe('external:example.com');
    expect(outboundLabelFromHref('https://notgithub.com/x')).toBe('external:notgithub.com');
  });

  it('never reports internal navigation as outbound', () => {
    expect(outboundLabelFromHref('/ko/projects/aira')).toBeNull();
    expect(outboundLabelFromHref('#section-work')).toBeNull();
    expect(outboundLabelFromHref('?tab=work')).toBeNull();
    expect(outboundLabelFromHref('')).toBeNull();
    expect(outboundLabelFromHref(`${ORIGIN}/en/privacy`, ORIGIN)).toBeNull();
    expect(outboundLabelFromHref(`${ORIGIN}/ko/projects/aira`, ORIGIN)).toBeNull();
  });

  it('ignores schemes the portfolio does not track', () => {
    expect(outboundLabelFromHref('tel:+8200000000')).toBeNull();
    expect(outboundLabelFromHref('javascript:alert(1)')).toBeNull();
  });

  it('caps the derived domain label length', () => {
    const label = outboundLabelFromHref(`https://${'a'.repeat(160)}.com`);

    expect(label).not.toBeNull();
    expect(label?.length).toBeLessThanOrEqual(MAX_OUTBOUND_LABEL_LENGTH);
  });
});

describe('reportOutboundLink', () => {
  it('sends one outbound_link interaction for an external href', () => {
    stubBrowser();

    reportOutboundLink('https://github.com/junwonp');

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [endpoint, rawPayload] = sendBeacon.mock.calls[0];
    expect(endpoint).toBe('/api/analytics/track');
    expect(JSON.parse(rawPayload)).toMatchObject({
      eventType: 'interaction',
      interactionType: 'outbound_link',
      interactionLabel: 'github',
      action: 'open',
    });
  });

  it('stays silent for relative and same-origin hrefs', () => {
    stubBrowser();

    reportOutboundLink('/ko/projects/aira');
    reportOutboundLink(`${ORIGIN}/en/privacy`);

    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it('respects the analytics opt-out', () => {
    stubBrowser(true);

    reportOutboundLink('https://github.com/junwonp');

    expect(sendBeacon).not.toHaveBeenCalled();
  });
});
