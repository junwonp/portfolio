// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// WebVitalsTracker hands its reporter to Next's useReportWebVitals, which subscribes it to the metric observers; capture it here to drive a metric directly.
const vitals = vi.hoisted(() => ({
  useReportWebVitals: vi.fn<(reporter: (metric: WebVitalMetric) => void) => void>(),
}));
vi.mock('next/web-vitals', () => ({ useReportWebVitals: vitals.useReportWebVitals }));

// The transport owns beacon/opt-out policy (covered by analyticsTransport.test.ts); this suite asserts the payload the tracker builds.
const transport = vi.hoisted(() => ({
  getOrInitializeAnalyticsSession: vi.fn<() => { id: string; isNew: boolean }>(),
  sendAnalyticsPayload: vi.fn<(data: Record<string, unknown>, sessionId: string) => void>(),
}));
vi.mock('@/lib/analytics/analyticsTransport', () => transport);

import WebVitalsTracker from '@/components/analytics/WebVitalsTracker';

interface WebVitalMetric {
  delta: number;
  id: string;
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
  navigationType: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  value: number;
}

const LCP_METRIC: WebVitalMetric = {
  delta: 120.5,
  id: 'v3-1767225600-1234',
  name: 'LCP',
  navigationType: 'navigate',
  rating: 'good',
  value: 2450,
};

const expectedPayload = (overrides: Partial<Record<string, unknown>> = {}) => ({
  eventType: 'web-vital',
  metricDelta: 120.5,
  metricId: 'v3-1767225600-1234',
  metricName: 'LCP',
  metricRating: 'good',
  metricValue: 2450,
  navigationType: 'navigate',
  path: '/projects/aira',
  referrer: 'https://search.example/query',
  ...overrides,
});

const firstReporter = (): ((metric: WebVitalMetric) => void) => {
  const reporter = vitals.useReportWebVitals.mock.calls[0]?.[0];
  if (!reporter) throw new Error('WebVitalsTracker did not register a web-vitals reporter');
  return reporter;
};

const renderTracker = (): ReturnType<typeof render> => render(<WebVitalsTracker />);

beforeEach(() => {
  transport.getOrInitializeAnalyticsSession.mockReturnValue({ id: 'session-1', isNew: false });
  transport.getOrInitializeAnalyticsSession.mockClear();
  transport.sendAnalyticsPayload.mockClear();
  vitals.useReportWebVitals.mockClear();
  history.replaceState({}, '', '/projects/aira');
  Object.defineProperty(document, 'referrer', {
    configurable: true,
    value: 'https://search.example/query',
  });
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(document, 'referrer');
  history.replaceState({}, '', '/');
});

describe('WebVitalsTracker', () => {
  it('registers a reporter with useReportWebVitals and renders nothing', () => {
    const { container } = renderTracker();

    expect(vitals.useReportWebVitals).toHaveBeenCalledTimes(1);
    expect(firstReporter()).toBeTypeOf('function');
    expect(container.innerHTML).toBe('');
  });

  it('beacons the metric with every field, the current path and the session id', () => {
    renderTracker();
    const reporter = firstReporter();

    reporter(LCP_METRIC);

    expect(transport.sendAnalyticsPayload).toHaveBeenCalledTimes(1);
    expect(transport.sendAnalyticsPayload).toHaveBeenCalledWith(expectedPayload(), 'session-1');
  });

  it('reports the document referrer as direct when the browser sent none', () => {
    Object.defineProperty(document, 'referrer', { configurable: true, value: '' });
    renderTracker();
    const reporter = firstReporter();

    reporter({ ...LCP_METRIC, name: 'CLS', rating: 'poor' });

    expect(transport.sendAnalyticsPayload).toHaveBeenCalledWith(
      expectedPayload({ metricName: 'CLS', metricRating: 'poor', referrer: 'direct' }),
      'session-1',
    );
  });

  it('reuses whichever session the transport already holds', () => {
    transport.getOrInitializeAnalyticsSession.mockReturnValue({ id: 'session-42', isNew: false });
    renderTracker();
    const reporter = firstReporter();

    reporter(LCP_METRIC);

    expect(transport.getOrInitializeAnalyticsSession).toHaveBeenCalledTimes(1);
    expect(transport.sendAnalyticsPayload).toHaveBeenCalledWith(expectedPayload(), 'session-42');
  });

  it('skips the beacon when the metric arrives outside a browser', () => {
    renderTracker();
    const reporter = firstReporter();

    vi.stubGlobal('window', undefined);
    reporter(LCP_METRIC);

    expect(transport.getOrInitializeAnalyticsSession).not.toHaveBeenCalled();
    expect(transport.sendAnalyticsPayload).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
