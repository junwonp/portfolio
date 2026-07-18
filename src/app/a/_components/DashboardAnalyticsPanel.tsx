'use client';

import Select from '@/components/ui/Select';
import type { RecentSession } from '@/lib/server/admin/dashboardData';

import styles from './admin.module.css';
import { StatsGrid } from './StatsGrid';
import { TrendChart } from './TrendChart';
import { DetailsGrid } from './DetailsGrid';
import { RecentSessionsTable } from './RecentSessionsTable';

interface DashboardAnalyticsPanelProps {
  stats: {
    avgActiveTime: number;
    avgArticleProgress: number;
    avgDwellTime: number;
    avgScrollDepth: number;
    totalPageViews: number;
    totalSessions: number;
  };
  applicationFilterOptions: {
    companyName: string;
    id: number;
    label: string;
    slug: string;
  }[];
  selectedApplicationLinkId: string;
  trafficRange: {
    bucket: 'day' | 'month';
    days: number;
    label: string;
    value: '7d' | '30d' | '1y';
  };
  trafficSummary: {
    activeDays: number;
    quietDays: number;
    rangeEnd: string;
    rangeSessions: number;
    rangeStart: string;
    rangeViews: number;
  };
  dailyChart: { date: string; hasData: boolean; sessions: number; views: number }[];
  topPages: {
    avgActive: number;
    avgArticleProgress: number;
    avgDwell: number;
    avgScroll: number;
    path: string;
    views: number;
  }[];
  topReferrers: { count: number; referrer: string }[];
  topCountries: { country: string; count: number }[];
  webVitals: {
    avgValue: number;
    good: number;
    metricName: string;
    needsImprovement: number;
    poor: number;
    samples: number;
  }[];
  recentSessions: RecentSession[];
}

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
  recentSessions,
}: DashboardAnalyticsPanelProps) {
  const filterOptions = [
    { value: '', label: '전체 방문' },
    ...applicationFilterOptions.map((link) => ({
      value: String(link.id),
      label: `${link.companyName} · ${link.label} · /${link.slug}`,
    })),
  ];

  return (
    <div className={styles.dashboardPanel} role="tabpanel">
      <section
        className={`${styles.metricFilterCard} ${styles.glass}`}
        aria-labelledby="metric-filter-title"
      >
        <div>
          <h3 id="metric-filter-title">지표 범위</h3>
          <p className={styles.sectionSubtitle}>
            전체 방문 또는 특정 회사/라벨 링크 기준으로 지표를 나눠 봅니다.
          </p>
        </div>
        <form className={styles.metricFilterForm} method="GET" action="/a">
          <input type="hidden" name="range" value={trafficRange.value} />
          <input type="hidden" name="tab" value="analytics" />
          <label>
            <span>회사 / 라벨</span>
            <Select
              name="linkId"
              value={selectedApplicationLinkId}
              options={filterOptions}
              onChange={(val) => {
                const form = document.querySelector<HTMLFormElement>(
                  `.${styles.metricFilterForm}`,
                );
                if (form) {
                  const input = form.querySelector<HTMLInputElement>('input[name="linkId"]');
                  if (input) {
                    input.value = val;
                  }
                  form.submit();
                }
              }}
            />
          </label>
        </form>
      </section>

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

      <RecentSessionsTable recentSessions={recentSessions} />
    </div>
  );
}
