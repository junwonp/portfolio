'use client';

import { useReportWebVitals } from 'next/web-vitals';

import {
  getOrInitializeAnalyticsSession,
  sendAnalyticsPayload,
} from '@/lib/components/analyticsTransport';

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

const reportWebVitals: ReportWebVitalsCallback = (metric) => {
  if (typeof window === 'undefined') return;

  const session = getOrInitializeAnalyticsSession();
  sendAnalyticsPayload(
    {
      eventType: 'web-vital',
      metricDelta: metric.delta,
      metricId: metric.id,
      metricName: metric.name,
      metricRating: metric.rating,
      metricValue: metric.value,
      navigationType: metric.navigationType,
      path: window.location.pathname,
      referrer: document.referrer || 'direct',
    },
    session.id,
  );
};

export default function WebVitalsTracker() {
  useReportWebVitals(reportWebVitals);

  return null;
}
