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
      articleProgress: 0,
      activeTime: 0,
      dwellTime: 91,
      eventType: 'page',
      isInitial: true,
      maxVisibleSectionId: undefined,
      maxVisibleSectionLabel: undefined,
      pageViewId: undefined,
      path: '/projects/aira',
      referrer: 'https://example.com',
      scrollDepth: 100,
      sessionId: 'session-1',
      userAgent: 'Vitest',
    });
  });

  it('normalizes page engagement fields used for durable page view updates', () => {
    expect(
      parseAnalyticsPayloadBody({
        activeTime: 45.4,
        articleProgress: 120,
        dwellTime: 90,
        maxVisibleSectionId: '  section-deep-dive  ',
        maxVisibleSectionLabel: '  Deep Dive  ',
        pageViewId: '  page-view-1  ',
        path: '/projects/aira',
        referrer: 'direct',
        scrollDepth: 86,
        sessionId: 'session-1',
        userAgent: 'Vitest',
      }),
    ).toMatchObject({
      activeTime: 45,
      articleProgress: 100,
      eventType: 'page',
      maxVisibleSectionId: 'section-deep-dive',
      maxVisibleSectionLabel: 'Deep Dive',
      pageViewId: 'page-view-1',
    });
  });

  it('normalizes web vital payloads separately from page engagement payloads', () => {
    expect(
      parseAnalyticsPayloadBody({
        eventType: 'web-vital',
        metricDelta: 250.2,
        metricId: 'vital-1',
        metricName: 'LCP',
        metricRating: 'needs-improvement',
        metricValue: 2450.8,
        navigationType: 'navigate',
        path: '/projects/aira',
        referrer: 'direct',
        sessionId: 'session-1',
        userAgent: 'Vitest',
      }),
    ).toEqual({
      eventType: 'web-vital',
      metricDelta: 250.2,
      metricId: 'vital-1',
      metricName: 'LCP',
      metricRating: 'needs-improvement',
      metricValue: 2450.8,
      navigationType: 'navigate',
      path: '/projects/aira',
      referrer: 'direct',
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
