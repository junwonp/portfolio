import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  env: vi.fn(),
  db: vi.fn(),
  limit: vi.fn(),
  record: vi.fn(),
}));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => undefined }) }));
vi.mock('@/lib/server/infrastructure/database', () => ({
  getCloudflareEnv: mocks.env,
  getDb: mocks.db,
}));
vi.mock('@/lib/server/analytics/tracking', () => ({ recordAnalyticsPayload: mocks.record }));

import { POST } from './route';

const CHROME_DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/120.0.0.0 Safari/537.36';

interface TestRequestOptions {
  cf?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const request = (body: string, host = 'junwon.dev', options: TestRequestOptions = {}) => {
  const req = new Request(`https://${host}/api/analytics/track`, {
    method: 'POST',
    body,
    headers: {
      host,
      'CF-Connecting-IP': '192.0.2.1',
      ...options.headers,
    },
  });
  if (options.cf) {
    Object.defineProperty(req, 'cf', { value: options.cf });
  }
  return req as NextRequest;
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.env.mockResolvedValue({
    APP_ENV: 'production',
    ANALYTICS_RATE_LIMITER: { limit: mocks.limit },
  });
  mocks.db.mockResolvedValue({});
  mocks.limit.mockResolvedValue({ success: true });
});

describe('analytics endpoint protection', () => {
  it('bypasses preview before accessing the database', async () => {
    mocks.env.mockResolvedValue({ APP_ENV: 'development' });
    expect((await POST(request('{}'))).status).toBe(200);
    expect(mocks.db).not.toHaveBeenCalled();
    expect(mocks.record).not.toHaveBeenCalled();
  });
  it('bypasses version preview hosts even with production bindings', async () => {
    await POST(request('{}', 'version.portfolio.workers.dev'));
    expect(mocks.db).not.toHaveBeenCalled();
  });
  it('rejects throttled requests before writing', async () => {
    mocks.limit.mockResolvedValue({ success: false });
    const response = await POST(request('{}'));
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('60');
    expect(mocks.record).not.toHaveBeenCalled();
  });
  it('fails closed if the production limiter is missing', async () => {
    mocks.env.mockResolvedValue({ APP_ENV: 'production' });
    expect((await POST(request('{}'))).status).toBe(503);
    expect(mocks.record).not.toHaveBeenCalled();
  });
  it('rejects an oversized body', async () => {
    expect((await POST(request('x'.repeat(8193)))).status).toBe(413);
    expect(mocks.record).not.toHaveBeenCalled();
  });
  it('bypasses collection when DNT is enabled', async () => {
    const response = await POST(
      request(JSON.stringify({ sessionId: 'test' }), 'junwon.dev', { headers: { dnt: '1' } }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, bypassed: true });
    expect(mocks.limit).not.toHaveBeenCalled();
    expect(mocks.record).not.toHaveBeenCalled();
  });
  it('bypasses collection when Sec-GPC is enabled', async () => {
    const response = await POST(
      request(JSON.stringify({ sessionId: 'test' }), 'junwon.dev', {
        headers: { 'sec-gpc': '1' },
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, bypassed: true });
    expect(mocks.record).not.toHaveBeenCalled();
  });
  it('records a valid request with cf geolocation and header-derived fields', async () => {
    const response = await POST(
      request(JSON.stringify({ path: '/', sessionId: 'test' }), 'junwon.dev', {
        cf: {
          city: 'Seoul',
          colo: 'ICN',
          country: 'KR',
          regionCode: '11',
          timezone: 'Asia/Seoul',
        },
        headers: {
          'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
          'user-agent': CHROME_DESKTOP_UA,
        },
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.record).toHaveBeenCalledWith({
      acceptLanguage: 'ko-kr',
      city: 'Seoul',
      colo: 'ICN',
      country: 'KR',
      db: {},
      payload: expect.objectContaining({ path: '/', sessionId: 'test' }),
      regionCode: '11',
      timezone: 'Asia/Seoul',
      userAgentHeader: CHROME_DESKTOP_UA,
    });
  });
  it('falls back to the cf-ipcountry header when request.cf is unavailable', async () => {
    await POST(
      request(JSON.stringify({ path: '/', sessionId: 'test' }), 'junwon.dev', {
        headers: { 'cf-ipcountry': 'JP' },
      }),
    );

    expect(mocks.record).toHaveBeenCalledWith(
      expect.objectContaining({
        city: 'unknown',
        colo: 'unknown',
        country: 'JP',
        regionCode: 'unknown',
        timezone: 'unknown',
      }),
    );
  });
});
