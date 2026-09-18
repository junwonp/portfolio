import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { TrafficSummaryGrid } from '@/components/admin/TrafficSummaryGrid';
import * as styles from '@/components/admin/TrendChart.css';
import type { RangeBucket, TrafficSummary } from '@/components/admin/trendChartGeometry';

const SUMMARY: TrafficSummary = {
  activeDays: 5,
  quietDays: 25,
  rangeEnd: '2026-01-30',
  rangeSessions: 41,
  rangeStart: '2026-01-01',
  rangeViews: 137,
};

const renderGrid = (bucket: RangeBucket, trafficSummary: TrafficSummary = SUMMARY): string =>
  renderToStaticMarkup(<TrafficSummaryGrid bucket={bucket} trafficSummary={trafficSummary} />);

describe('TrafficSummaryGrid', () => {
  it('renders all four summary labels and values', () => {
    const html = renderGrid('day');

    for (const label of ['기간 조회', '기간 세션', '활성 일', '무기록 일']) {
      expect(html).toContain(label);
    }

    expect(html).toContain('>137<');
    expect(html).toContain('>41<');
    expect(html).toContain('>5<');
    expect(html).toContain('>25<');
    expect(html).toContain(styles.trafficSummaryGrid);
    expect((html.match(new RegExp(styles.summaryItem, 'g')) ?? []).length).toBe(4);
  });

  it('labels the day bucket as days', () => {
    const html = renderGrid('day');

    expect(html).toContain('활성 일');
    expect(html).toContain('무기록 일');
    expect(html).not.toContain('활성 월');
  });

  it('switches the active and quiet labels to months for the month bucket', () => {
    const html = renderGrid('month');

    expect(html).toContain('활성 월');
    expect(html).toContain('무기록 월');
    expect(html).not.toContain('활성 일');
  });

  it('renders zero counts for a range with no recorded traffic', () => {
    const html = renderGrid('day', { ...SUMMARY, activeDays: 0, quietDays: 30 });

    expect(html).toContain('>0<');
    expect(html).toContain('>30<');
  });
});
