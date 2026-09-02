import { afterEach, describe, expect, it, vi } from 'vitest';

import { sendAnalyticsPayload } from '@/components/analytics/analyticsTransport';

const sendBeacon = vi.fn();

function stubBrowser(referrer: string) {
  vi.stubGlobal('window', { location: { pathname: '/projects/aira' } });
  vi.stubGlobal('localStorage', { getItem: vi.fn(() => null) });
  vi.stubGlobal('navigator', { sendBeacon, userAgent: 'Vitest' });
  vi.stubGlobal('document', { referrer });
}

afterEach(() => {
  vi.unstubAllGlobals();
  sendBeacon.mockReset();
});

describe('sendAnalyticsPayload', () => {
  it('includes the document referrer on every beacon so attribution survives initial-beacon loss', () => {
    stubBrowser('https://junwon.dev/p48r');

    sendAnalyticsPayload({ eventType: 'page', path: '/projects/aira' }, 'session-1');

    const [endpoint, rawPayload] = sendBeacon.mock.calls[0];
    expect(endpoint).toBe('/api/analytics/track');
    expect(JSON.parse(rawPayload)).toMatchObject({
      referrer: 'https://junwon.dev/p48r',
      sessionId: 'session-1',
    });
  });

  it('falls back to direct when the document has no referrer', () => {
    stubBrowser('');

    sendAnalyticsPayload({ eventType: 'page', path: '/' }, 'session-2');

    expect(JSON.parse(sendBeacon.mock.calls[0][1])).toMatchObject({ referrer: 'direct' });
  });
});
