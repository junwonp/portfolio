// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import * as shared from '@/components/admin/adminShared.css';
import { DashboardAnalyticsPanel } from '@/components/admin/DashboardAnalyticsPanel';
import * as styles from '@/components/admin/DashboardAnalyticsPanel.css';
import type { DashboardAnalyticsPanelProps } from '@/lib/server/admin/dashboardData';

const BASE_PROPS: DashboardAnalyticsPanelProps = {
  applicationFilterOptions: [
    { companyName: 'Toss', id: 3, label: 'Toss Frontend', slug: 'toss-fe' },
    { companyName: 'Naver', id: 8, label: 'Naver Mobile', slug: 'naver-mo' },
  ],
  dailyChart: [
    { date: '2026-01-29', hasData: true, sessions: 4, views: 11 },
    { date: '2026-01-30', hasData: true, sessions: 6, views: 21 },
  ],
  localeSwitches: [{ count: 2, label: 'en' }],
  outboundLinks: [{ count: 5, label: 'github' }],
  selectedApplicationLinkId: '',
  sessionDetails: {},
  sessions: [],
  stats: {
    avgActiveTime: 12,
    avgArticleProgress: 50,
    avgDwellTime: 20,
    avgScrollDepth: 60,
    totalPageViews: 32,
    totalSessions: 10,
  },
  themeToggles: [{ count: 4, label: 'dark' }],
  topCountries: [{ count: 7, country: 'KR' }],
  topPages: [
    {
      avgActive: 5,
      avgArticleProgress: 25,
      avgDwell: 12,
      avgScroll: 70,
      path: '/',
      views: 9,
    },
  ],
  topReferrers: [{ count: 6, referrer: 'google.com' }],
  totalSessionCount: 10,
  trafficRange: { bucket: 'day', days: 30, label: '최근 30일', value: '30d' },
  trafficSummary: {
    activeDays: 2,
    quietDays: 28,
    rangeEnd: '2026-01-30',
    rangeSessions: 10,
    rangeStart: '2026-01-01',
    rangeViews: 32,
  },
  webVitals: [
    { avgValue: 2.1, good: 5, metricName: 'LCP', needsImprovement: 2, poor: 1, samples: 8 },
  ],
};

const panelElement = (overrides: Partial<DashboardAnalyticsPanelProps> = {}) => (
  <DashboardAnalyticsPanel
    applicationFilterOptions={BASE_PROPS.applicationFilterOptions}
    dailyChart={BASE_PROPS.dailyChart}
    localeSwitches={BASE_PROPS.localeSwitches}
    outboundLinks={BASE_PROPS.outboundLinks}
    selectedApplicationLinkId={BASE_PROPS.selectedApplicationLinkId}
    sessionDetails={BASE_PROPS.sessionDetails}
    sessions={BASE_PROPS.sessions}
    stats={BASE_PROPS.stats}
    themeToggles={BASE_PROPS.themeToggles}
    topCountries={BASE_PROPS.topCountries}
    topPages={BASE_PROPS.topPages}
    topReferrers={BASE_PROPS.topReferrers}
    totalSessionCount={BASE_PROPS.totalSessionCount}
    trafficRange={BASE_PROPS.trafficRange}
    trafficSummary={BASE_PROPS.trafficSummary}
    webVitals={BASE_PROPS.webVitals}
    {...overrides}
  />
);

const renderPanel = (overrides: Partial<DashboardAnalyticsPanelProps> = {}): string =>
  renderToStaticMarkup(panelElement(overrides));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('DashboardAnalyticsPanel', () => {
  it('renders as the tabpanel the analytics tab points at, reachable by keyboard', () => {
    const html = renderPanel();

    expect(html).toContain('id="dashboard-panel-analytics"');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain('aria-labelledby="dashboard-tab-analytics"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain(shared.dashboardPanel);
  });

  it('renders the metric scope card with its heading and a GET form back to /a', () => {
    const html = renderPanel();

    expect(html).toContain('지표 범위');
    expect(html).toContain('전체 방문 또는 특정 회사/라벨 링크 기준으로 지표를 나눠 봅니다.');
    expect(html).toContain('method="GET"');
    expect(html).toContain('action="/a"');
    expect(html).toContain(styles.metricFilterCard);
    expect(html).toContain(styles.metricFilterForm);
    expect(html).toContain(`<button type="submit" class="${shared.srOnly}">조회 적용</button>`);
  });

  it('carries the traffic range and analytics tab through the filter submission', () => {
    const html = renderPanel();

    expect(html).toContain('<input type="hidden" name="range" value="30d"/>');
    expect(html).toContain('<input type="hidden" name="tab" value="analytics"/>');
  });

  it('omits the session filter inputs when no classification or time range is active', () => {
    const html = renderPanel();

    expect(html).not.toContain('name="classification"');
    expect(html).not.toContain('name="timeRange"');
  });

  it('round-trips the active classification and time range through hidden inputs', () => {
    const html = renderPanel({ classification: 'human', timeRange: '7d' });

    expect(html).toContain('<input type="hidden" name="classification" value="human"/>');
    expect(html).toContain('<input type="hidden" name="timeRange" value="7d"/>');
  });

  it('labels the link filter and offers the all-visitors default plus each active link', () => {
    const html = renderPanel();

    expect(html).toContain('for="metric-filter-link"');
    expect(html).toContain('<span>회사 / 라벨</span>');
    expect(html).toContain('name="linkId"');
    expect(html).toContain('<option value="" selected="">전체 방문</option>');
    expect(html).toContain('<option value="3">Toss · Toss Frontend · /r/toss-fe</option>');
    expect(html).toContain('<option value="8">Naver · Naver Mobile · /r/naver-mo</option>');
  });

  it('selects the requested link and drops the placeholder when the selection is unknown', () => {
    const selected = renderPanel({ selectedApplicationLinkId: '3' });
    expect(selected).toContain(
      '<option value="3" selected="">Toss · Toss Frontend · /r/toss-fe</option>',
    );

    const unknown = renderPanel({ selectedApplicationLinkId: '99' });
    expect(unknown).toContain('<option value="">선택해주세요</option>');
  });

  it('renders the stat cards, chart, detail tables, insight rankings and sessions table together', () => {
    const html = renderPanel();

    expect(html).toContain('aria-label="핵심 지표"');
    expect(html).toContain('최근 30일 트래픽');
    expect(html).toContain('aria-label="트래픽 기간 선택"');
    expect(html).toContain('가장 많이 방문한 페이지');
    expect(html).toContain('코어 웹 바이탈');
    expect(html).toContain('외부 링크 클릭');
    expect(html).toContain('접속 세션');
    expect(html).toContain('10개 세션');
    expect(html).toContain('role="img"');
  });

  it('shows the trend empty state while the other sections keep their own empty states', () => {
    const html = renderPanel({ dailyChart: [] });

    expect(html).toContain('트렌드 차트를 표시할 데이터가 없습니다.');
    expect(html).not.toContain('role="img"');
    expect(html).toContain('조건에 맞는 세션 정보가 없습니다.');
  });

  it('renders the populated sessions table with the active filters', () => {
    const html = renderPanel({
      classification: 'human',
      sessions: [
        {
          acceptLanguage: 'ko-KR',
          applicationLinkLabel: 'Toss Frontend',
          applicationLinkSlug: 'toss-fe',
          browser: 'Chrome',
          city: 'Seoul',
          classification: 'human',
          colo: 'ICN',
          createdAt: '2026-01-02T03:04:05.000Z',
          deviceType: 'desktop',
          id: 'session-1',
          ipCountry: 'KR',
          isBot: 0,
          os: 'macOS',
          pageViewsCount: 3,
          referrer: 'google.com',
          regionCode: 'KR',
          timezone: 'Asia/Seoul',
        },
      ],
      totalSessionCount: 1,
    });

    expect(html).toContain('1개 세션');
    expect(html).toContain('2026-01-02 03:04');
    expect(html).toContain('aria-label="세션 유형 필터"');
  });

  it('submits the metric filter form as soon as a different link is chosen', async () => {
    const user = userEvent.setup();
    const submitSpy = vi
      .spyOn(HTMLFormElement.prototype, 'submit')
      .mockImplementation(() => undefined);
    render(panelElement());

    await user.selectOptions(screen.getByLabelText('회사 / 라벨'), '3');

    expect(submitSpy).toHaveBeenCalledTimes(1);
    expect(submitSpy.mock.instances[0]).toHaveClass(styles.metricFilterForm);
  });
});
