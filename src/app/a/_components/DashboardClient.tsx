'use client';

import { useRef, useState } from 'react';

import type { RecentSession } from '@/lib/server/admin/dashboardData';

import styles from './admin.module.css';
import { logout } from '../actions';
import { DashboardAnalyticsPanel } from './DashboardAnalyticsPanel';
import { DashboardLinksPanel } from './DashboardLinksPanel';



interface DashboardClientProps {
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
  applicationLinks: {
    avgActiveTime: number;
    avgArticleProgress: number;
    avgDwellTime: number;
    avgScrollDepth: number;
    companyName: string;
    createdAt: string;
    expiresAt: string;
    id: number;
    label: string;
    lastSeenAt: string | null;
    projectIds: string[];
    role: 'web' | 'mobile' | 'ai' | null;
    sessions: number;
    slug: string;
    summaryPreset: string;
    views: number;
  }[];
  applicationProjectOptions: { id: string; title: string }[];
  dailyChart: { date: string; hasData: boolean; sessions: number; views: number }[];
  selectedApplicationLinkId: string;
  topCountries: { country: string; count: number }[];
  topPages: {
    avgActive: number;
    avgArticleProgress: number;
    avgDwell: number;
    avgScroll: number;
    path: string;
    views: number;
  }[];
  topReferrers: { count: number; referrer: string }[];
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
  webVitals: {
    avgValue: number;
    good: number;
    metricName: string;
    needsImprovement: number;
    poor: number;
    samples: number;
  }[];
  initialTab: 'analytics' | 'links';
  recentSessions: RecentSession[];
  writesDisabledReason: string | null;
  writesEnabled: boolean;
}

export function DashboardClient({
  stats,
  applicationFilterOptions,
  applicationLinks,
  applicationProjectOptions,
  dailyChart,
  selectedApplicationLinkId,
  topCountries,
  topPages,
  topReferrers,
  trafficRange,
  trafficSummary,
  webVitals,
  initialTab,
  recentSessions,
  writesDisabledReason,
  writesEnabled,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'links'>(initialTab);

  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);
  const swipeThreshold = 64;

  function handleSwipeStart(e: React.PointerEvent) {
    if (!e.isPrimary) return;
    swipeStartX.current = e.clientX;
    swipeStartY.current = e.clientY;
  }

  function handleSwipeEnd(e: React.PointerEvent) {
    if (swipeStartX.current === null || swipeStartY.current === null) return;
    const deltaX = e.clientX - swipeStartX.current;
    const deltaY = e.clientY - swipeStartY.current;
    swipeStartX.current = null;
    swipeStartY.current = null;

    if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0) {
      setActiveTab('links');
    } else {
      setActiveTab('analytics');
    }
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1>분석 대시보드</h1>
          <p className={styles.subtitle}>Cloudflare Edge 기반 실시간 방문자 행동 분석</p>
        </div>
        <form action={logout}>
          <button type="submit" className={styles.logoutBtn}>
            로그아웃
          </button>
        </form>
      </header>

      <section
        className={`${styles.dashboardViewSwitcher} ${styles.glass}`}
        aria-label="대시보드 화면 선택"
      >
        <div className={styles.switcherCopy}>
          <span>{activeTab === 'analytics' ? '기본 화면' : '관리 화면'}</span>
          <strong>{activeTab === 'analytics' ? '분석 지표' : '지원 링크 생성 및 관리'}</strong>
        </div>
        <div className={styles.segmentedControl} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'analytics'}
            className={activeTab === 'analytics' ? styles.active : ''}
            onClick={() => setActiveTab('analytics')}
          >
            분석
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'links'}
            className={activeTab === 'links' ? styles.active : ''}
            onClick={() => setActiveTab('links')}
          >
            링크
          </button>
        </div>
      </section>

      <div
        className={styles.dashboardSwipeViewport}
        role="region"
        onPointerDown={handleSwipeStart}
        onPointerUp={handleSwipeEnd}
        onPointerCancel={() => {
          swipeStartX.current = null;
          swipeStartY.current = null;
        }}
      >
        {activeTab === 'analytics' ? (
          <DashboardAnalyticsPanel
            stats={stats}
            applicationFilterOptions={applicationFilterOptions}
            selectedApplicationLinkId={selectedApplicationLinkId}
            trafficRange={trafficRange}
            trafficSummary={trafficSummary}
            dailyChart={dailyChart}
            topPages={topPages}
            topReferrers={topReferrers}
            topCountries={topCountries}
            webVitals={webVitals}
            recentSessions={recentSessions}
          />
        ) : (
          <DashboardLinksPanel
            applicationLinks={applicationLinks}
            applicationProjectOptions={applicationProjectOptions}
            writesDisabledReason={writesDisabledReason}
            writesEnabled={writesEnabled}
          />
        )}
      </div>
    </div>
  );
}
