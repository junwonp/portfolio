'use client';

import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';
import Select from '@/components/ui/Select';
import type { DashboardAnalyticsPanelProps } from '@/lib/server/admin/dashboardData';

import * as shared from './adminShared.css';
import * as styles from './DashboardAnalyticsPanel.css';
import { DetailsGrid } from './DetailsGrid';
import { SessionsTable } from './SessionsTable';
import { StatsGrid } from './StatsGrid';
import { TrendChart } from './TrendChart';

export function DashboardAnalyticsPanel({
  stats,
  applicationFilterOptions,
  selectedApplicationLinkId,
  trafficRange,
  trafficSummary,
  dailyChart,
  topPages,
  topReferrers,
  topCountries,
  webVitals,
  sessions,
  totalSessionCount,
  sessionDetails,
  classification,
  timeRange,
}: DashboardAnalyticsPanelProps) {
  const filterOptions = [
    { value: '', label: '전체 방문' },
    ...applicationFilterOptions.map((link) => ({
      value: String(link.id),
      label: `${link.companyName} · ${link.label} · /${link.slug}`,
    })),
  ];

  return (
    <div
      id="dashboard-panel-analytics"
      className={shared.dashboardPanel}
      role="tabpanel"
      aria-labelledby="dashboard-tab-analytics"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the ARIA tabs pattern requires a focusable tabpanel
      tabIndex={0}
    >
      <Card
        variant="glass"
        radius="sm"
        as="section"
        className={styles.metricFilterCard}
        aria-labelledby="metric-filter-title"
      >
        <SectionHeading
          level={2}
          title="지표 범위"
          subtitle="전체 방문 또는 특정 회사/라벨 링크 기준으로 지표를 나눠 봅니다."
          id="metric-filter-title"
        />
        <form className={styles.metricFilterForm} method="GET" action="/a">
          <input type="hidden" name="range" value={trafficRange.value} />
          <input type="hidden" name="tab" value="analytics" />
          {classification && <input type="hidden" name="classification" value={classification} />}
          {timeRange && <input type="hidden" name="timeRange" value={timeRange} />}
          <label htmlFor="metric-filter-link">
            <span>회사 / 라벨</span>
            <Select
              id="metric-filter-link"
              name="linkId"
              value={selectedApplicationLinkId}
              options={filterOptions}
              onChange={() => {
                document.querySelector<HTMLFormElement>(`.${styles.metricFilterForm}`)?.submit();
              }}
            />
          </label>
          <button type="submit" className={shared.srOnly}>
            조회 적용
          </button>
        </form>
      </Card>

      <StatsGrid stats={stats} />

      <TrendChart
        trafficRange={trafficRange}
        trafficSummary={trafficSummary}
        dailyChart={dailyChart}
        selectedApplicationLinkId={selectedApplicationLinkId}
      />

      <DetailsGrid
        topPages={topPages}
        topReferrers={topReferrers}
        topCountries={topCountries}
        webVitals={webVitals}
      />

      <SessionsTable
        sessions={sessions}
        totalCount={totalSessionCount}
        sessionDetails={sessionDetails}
        classification={classification}
        timeRange={timeRange}
      />
    </div>
  );
}
