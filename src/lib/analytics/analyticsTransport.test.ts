import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ANALYTICS_SESSION_KEY,
  getOrInitializeAnalyticsSession,
  reportInteraction,
  sendAnalyticsPayload,
} from '@/lib/analytics/analyticsTransport';

const sendBeacon = vi.fn();
const randomUUID = vi.fn(() => 'generated-session-id');

interface BrowserStubOptions {
  ignored?: boolean;
  navigatorState?: 'no-send-beacon' | 'send-beacon' | 'unavailable';
  pathname?: string;
  sessionValue?: string | null;
}

function stubBrowser(referrer: string, options: BrowserStubOptions = {}) {
  const {
    ignored = false,
    navigatorState = 'send-beacon',
    pathname = '/projects/aira',
    sessionValue = null,
  } = options;
  const sessionStorageGetItem = vi.fn(() => sessionValue);
  const sessionStorageSetItem = vi.fn();

  vi.stubGlobal('window', { location: { pathname } });
  vi.stubGlobal('localStorage', { getItem: vi.fn(() => (ignored ? 'true' : null)) });
  vi.stubGlobal('document', { referrer });
  vi.stubGlobal('sessionStorage', {
    getItem: sessionStorageGetItem,
    setItem: sessionStorageSetItem,
  });
  vi.stubGlobal('crypto', { randomUUID });

  if (navigatorState === 'unavailable') {
    vi.stubGlobal('navigator', undefined);
  } else {
    vi.stubGlobal('navigator', navigatorState === 'send-beacon' ? { sendBeacon } : {});
  }

  return { sessionStorageGetItem, sessionStorageSetItem };
}

function stubFetch() {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
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

  it('skips sending when the window is unavailable', () => {
    const fetchMock = stubFetch();
    vi.stubGlobal('window', undefined);

    sendAnalyticsPayload({ eventType: 'page', path: '/' }, 'session-3');

    expect(sendBeacon).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('skips sending when the session id is empty', () => {
    stubBrowser('');
    const fetchMock = stubFetch();

    sendAnalyticsPayload({ eventType: 'page', path: '/' }, '');

    expect(sendBeacon).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('skips sending when the visitor opted out through portfolio_analytics_ignore', () => {
    stubBrowser('', { ignored: true });
    const fetchMock = stubFetch();

    sendAnalyticsPayload({ eventType: 'page', path: '/' }, 'session-4');

    expect(sendBeacon).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('includes the application slug when the path is a short link', () => {
    stubBrowser('', { pathname: '/r/p48r' });

    sendAnalyticsPayload({ eventType: 'page', path: '/r/p48r' }, 'session-5');

    expect(JSON.parse(sendBeacon.mock.calls[0][1])).toMatchObject({
      applicationSlug: 'p48r',
      sessionId: 'session-5',
    });
  });

  it('omits the application slug for paths that are not short links', () => {
    stubBrowser('', { pathname: '/projects/aira' });

    sendAnalyticsPayload({ eventType: 'page', path: '/projects/aira' }, 'session-6');

    expect(JSON.parse(sendBeacon.mock.calls[0][1])).not.toHaveProperty('applicationSlug');
  });

  it('falls back to a keepalive fetch when sendBeacon is unavailable', () => {
    stubBrowser('https://junwon.dev/', { navigatorState: 'no-send-beacon' });
    const fetchMock = stubFetch();

    sendAnalyticsPayload({ eventType: 'page', path: '/' }, 'session-7');

    expect(sendBeacon).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/track', {
      body: JSON.stringify({
        referrer: 'https://junwon.dev/',
        sessionId: 'session-7',
        eventType: 'page',
        path: '/',
      }),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      method: 'POST',
    });
  });

  it('falls back to a keepalive fetch when navigator is unavailable', () => {
    stubBrowser('', { navigatorState: 'unavailable' });
    const fetchMock = stubFetch();

    sendAnalyticsPayload({ eventType: 'page', path: '/' }, 'session-8');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/analytics/track',
      expect.objectContaining({ keepalive: true, method: 'POST' }),
    );
  });
});

describe('getOrInitializeAnalyticsSession', () => {
  it('returns an empty non-new session when the window is unavailable', () => {
    vi.stubGlobal('window', undefined);

    expect(getOrInitializeAnalyticsSession()).toEqual({ id: '', isNew: false });
  });

  it('reuses the session id already stored in sessionStorage', () => {
    const { sessionStorageSetItem } = stubBrowser('', { sessionValue: 'existing-session' });

    expect(getOrInitializeAnalyticsSession()).toEqual({ id: 'existing-session', isNew: false });
    expect(randomUUID).not.toHaveBeenCalled();
    expect(sessionStorageSetItem).not.toHaveBeenCalled();
  });

  it('creates and persists a session id when sessionStorage holds no id', () => {
    const { sessionStorageGetItem, sessionStorageSetItem } = stubBrowser('', {
      sessionValue: null,
    });

    expect(getOrInitializeAnalyticsSession()).toEqual({
      id: 'generated-session-id',
      isNew: true,
    });
    expect(sessionStorageGetItem).toHaveBeenCalledWith(ANALYTICS_SESSION_KEY);
    expect(randomUUID).toHaveBeenCalledTimes(1);
    expect(sessionStorageSetItem).toHaveBeenCalledWith(
      ANALYTICS_SESSION_KEY,
      'generated-session-id',
    );
  });
});

describe('reportInteraction', () => {
  it('sends an interaction event that carries the current session id', () => {
    stubBrowser('', { sessionValue: 'existing-session' });

    reportInteraction({
      action: 'open',
      interactionLabel: 'Aira case study',
      interactionType: 'project',
    });

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(JSON.parse(sendBeacon.mock.calls[0][1])).toMatchObject({
      action: 'open',
      eventType: 'interaction',
      interactionLabel: 'Aira case study',
      interactionType: 'project',
      sessionId: 'existing-session',
    });
  });
});
