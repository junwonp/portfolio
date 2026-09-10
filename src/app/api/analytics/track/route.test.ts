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

const request = (body: string, host = 'junwon.dev') =>
  new Request(`https://${host}/api/analytics/track`, {
    method: 'POST',
    body,
    headers: { host, 'CF-Connecting-IP': '192.0.2.1' },
  }) as NextRequest;

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
  it('records a valid request', async () => {
    const response = await POST(
      request(
        JSON.stringify({ path: '/', sessionId: 'test', userAgent: 'test', referrer: 'direct' }),
      ),
    );
    expect(response.status).toBe(200);
    expect(mocks.record).toHaveBeenCalledOnce();
  });
});
