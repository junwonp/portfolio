// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const routerPush = vi.hoisted(() => vi.fn());
const searchParamsState = vi.hoisted(() => ({ current: new URLSearchParams() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
  useSearchParams: () => searchParamsState.current,
}));

import * as shared from '@/components/admin/adminShared.css';
import { TrendChart } from '@/components/admin/TrendChart';
import * as styles from '@/components/admin/TrendChart.css';
import type {
  DailyChartEntry,
  TrafficRange,
  TrafficSummary,
} from '@/components/admin/trendChartGeometry';

const DAY_RANGE: TrafficRange = { bucket: 'day', days: 30, label: '최근 30일', value: '30d' };
const MONTH_RANGE: TrafficRange = { bucket: 'month', days: 365, label: '최근 1년', value: '1y' };

const SUMMARY: TrafficSummary = {
  activeDays: 5,
  quietDays: 25,
  rangeEnd: '2026-01-30',
  rangeSessions: 10,
  rangeStart: '2026-01-01',
  rangeViews: 32,
};

const DAILY_CHART: DailyChartEntry[] = [
  { date: '2026-01-29', hasData: true, sessions: 4, views: 11 },
  { date: '2026-01-30', hasData: true, sessions: 6, views: 21 },
];

type TrendChartProps = Parameters<typeof TrendChart>[0];

const renderChart = (overrides: Partial<TrendChartProps> = {}): ReturnType<typeof render> =>
  render(
    <TrendChart
      trafficRange={DAY_RANGE}
      trafficSummary={SUMMARY}
      dailyChart={DAILY_CHART}
      selectedApplicationLinkId=""
      {...overrides}
    />,
  );

beforeEach(() => {
  searchParamsState.current = new URLSearchParams();
});

afterEach(() => {
  cleanup();
});

describe('TrendChart', () => {
  it('titles the section with the active range and explains how gaps are drawn', () => {
    renderChart();

    expect(screen.getByRole('heading', { name: '최근 30일 트래픽' })).toBeInTheDocument();
    expect(screen.getByText('01-01–01-30 기준, 기록이 없는 날짜은 0으로 표시')).toBeInTheDocument();
    expect(screen.getByText('최근 30일 트래픽').closest('section')).toHaveClass(
      shared.chartSection,
    );
  });

  it('describes a monthly range in months instead of days', () => {
    renderChart({
      trafficRange: MONTH_RANGE,
      trafficSummary: {
        ...SUMMARY,
        activeDays: 7,
        quietDays: 5,
        rangeEnd: '2026-06',
        rangeStart: '2025-07',
      },
    });

    expect(screen.getByRole('heading', { name: '최근 1년 트래픽' })).toBeInTheDocument();
    expect(
      screen.getByText('2025-07–2026-06 기준, 기록이 없는 월은 0으로 표시'),
    ).toBeInTheDocument();
    expect(screen.getByText('7개월 활성')).toBeInTheDocument();
  });

  it('badges the active day count for a day range', () => {
    renderChart();

    expect(screen.getByText('5일 활성')).toHaveClass(shared.rangeBadge);
  });

  it('offers the three range choices with the active one pressed', () => {
    renderChart();
    const group = screen.getByRole('group', { name: '트래픽 기간 선택' });

    expect(group.parentElement).toHaveClass(styles.chartActions);
    expect(screen.getByRole('button', { name: '7일' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: '30일' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '1년' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders the legend, the summary grid and the SVG chart when data exists', () => {
    renderChart();

    expect(screen.getByText('조회 수 (Views)')).toBeInTheDocument();
    expect(screen.getByText('기간 조회')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '최근 30일 트래픽 추이 차트' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('swaps the chart for an empty state when the range has no buckets', () => {
    renderChart({ dailyChart: [] });

    expect(screen.getByRole('status')).toHaveTextContent('트렌드 차트를 표시할 데이터가 없습니다.');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('navigates to the chosen range on the analytics tab without scrolling', async () => {
    const user = userEvent.setup();
    renderChart();

    await user.click(screen.getByRole('button', { name: '7일' }));

    expect(routerPush).toHaveBeenCalledTimes(1);
    expect(routerPush).toHaveBeenCalledWith('/a?range=7d&tab=analytics', { scroll: false });
  });

  it('keeps the selected application link and unrelated filters in the pushed query', async () => {
    const user = userEvent.setup();
    searchParamsState.current = new URLSearchParams('classification=human');
    renderChart({ selectedApplicationLinkId: '3' });

    await user.click(screen.getByRole('button', { name: '30일' }));

    expect(routerPush).toHaveBeenCalledWith(
      '/a?classification=human&linkId=3&range=30d&tab=analytics',
      { scroll: false },
    );
  });

  it('omits the linkId parameter when the dashboard shows all visitors', async () => {
    const user = userEvent.setup();
    searchParamsState.current = new URLSearchParams('linkId=9&range=30d');
    renderChart();

    await user.click(screen.getByRole('button', { name: '1년' }));

    expect(routerPush).toHaveBeenCalledWith('/a?range=1y&tab=analytics', { scroll: false });
  });
});
