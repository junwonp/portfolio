import { describe, expect, it } from 'vitest';

import { parseAnalyticsPayloadBody } from '@/lib/server/analyticsPayload';

describe('parseAnalyticsPayloadBody', () => {
  it('normalizes and clamps public analytics payloads', () => {
    expect(
      parseAnalyticsPayloadBody({
        dwellTime: 90.6,
        isInitial: true,
        path: '/projects/aira',
        referrer: '  https://example.com  ',
        scrollDepth: 120,
        sessionId: 'session-1',
        userAgent: 'Vitest',
      }),
    ).toEqual({
      applicationSlug: undefined,
      dwellTime: 91,
      isInitial: true,
      path: '/projects/aira',
      referrer: 'https://example.com',
      scrollDepth: 100,
      sessionId: 'session-1',
      userAgent: 'Vitest',
    });
  });

  it('infers application link slugs from single-segment public paths', () => {
    expect(
      parseAnalyticsPayloadBody({
        dwellTime: 0,
        isInitial: false,
        path: '/abcd',
        referrer: 'direct',
        scrollDepth: 0,
        sessionId: 'session-1',
        userAgent: 'Vitest',
      })?.applicationSlug,
    ).toBe('abcd');
  });

  it('does not infer application slugs from reserved or invalid paths', () => {
    expect(
      parseAnalyticsPayloadBody({
        dwellTime: 0,
        isInitial: false,
        path: '/a',
        referrer: 'direct',
        scrollDepth: 0,
        sessionId: 'session-1',
        userAgent: 'Vitest',
      })?.applicationSlug,
    ).toBeUndefined();

    expect(
      parseAnalyticsPayloadBody({
        dwellTime: 0,
        isInitial: false,
        path: '/ab_cd',
        referrer: 'direct',
        scrollDepth: 0,
        sessionId: 'session-1',
        userAgent: 'Vitest',
      })?.applicationSlug,
    ).toBeUndefined();
  });

  it('rejects payloads without a valid session id', () => {
    expect(parseAnalyticsPayloadBody({ sessionId: '' })).toBeNull();
    expect(parseAnalyticsPayloadBody(null)).toBeNull();
  });
});
