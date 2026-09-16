'use client';

import { type KeyboardEvent, useState } from 'react';

import Button from '@/components/ui/Button';
import { logout } from '@/lib/server/admin/actions';
import type { DashboardClientProps } from '@/lib/server/admin/dashboardData';

import { DashboardAnalyticsPanel } from './DashboardAnalyticsPanel';
import * as styles from './DashboardClient.css';
import { DashboardLinksPanel } from './DashboardLinksPanel';

type DashboardTab = 'analytics' | 'links';

const TAB_ORDER: DashboardTab[] = ['analytics', 'links'];

const TAB_IDS: Record<DashboardTab, string> = {
  analytics: 'dashboard-tab-analytics',
  links: 'dashboard-tab-links',
};

const PANEL_IDS: Record<DashboardTab, string> = {
  analytics: 'dashboard-panel-analytics',
  links: 'dashboard-panel-links',
};

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
  localeSwitches,
  outboundLinks,
  themeToggles,
  initialTab,
  sessions,
  totalSessionCount,
  sessionDetails,
  classification,
  timeRange,
  writesDisabledReason,
  writesEnabled,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'links'>(initialTab);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, current: DashboardTab) {
    const currentIndex = TAB_ORDER.indexOf(current);
    let nextIndex: number;
    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
        break;
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % TAB_ORDER.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = TAB_ORDER.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = TAB_ORDER[nextIndex];
    setActiveTab(nextTab);
    document.getElementById(TAB_IDS[nextTab])?.focus();
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1>분석 대시보드</h1>
          <p className={styles.subtitle}>Cloudflare Edge 기반 실시간 방문자 행동 분석</p>
        </div>
        <form action={logout}>
          <Button variant="outline" size="md" shape="rounded" type="submit">
            로그아웃
          </Button>
        </form>
      </header>

      <section className={styles.dashboardViewSwitcher} aria-label="대시보드 화면 선택">
        <div className={styles.switcherCopy}>
          <span>{activeTab === 'analytics' ? '기본 화면' : '관리 화면'}</span>
          <strong>{activeTab === 'analytics' ? '분석 지표' : '지원 링크 생성 및 관리'}</strong>
        </div>
        <div className={styles.segmentedControl} role="tablist" aria-label="대시보드 화면 선택">
          <Button
            id={TAB_IDS.analytics}
            variant={activeTab === 'analytics' ? 'primary' : 'ghost'}
            size="sm"
            shape="pill"
            type="button"
            role="tab"
            aria-selected={activeTab === 'analytics'}
            aria-controls={PANEL_IDS.analytics}
            tabIndex={activeTab === 'analytics' ? 0 : -1}
            onClick={() => setActiveTab('analytics')}
            onKeyDown={(event) => handleTabKeyDown(event, 'analytics')}
          >
            분석
          </Button>
          <Button
            id={TAB_IDS.links}
            variant={activeTab === 'links' ? 'primary' : 'ghost'}
            size="sm"
            shape="pill"
            type="button"
            role="tab"
            aria-selected={activeTab === 'links'}
            aria-controls={PANEL_IDS.links}
            tabIndex={activeTab === 'links' ? 0 : -1}
            onClick={() => setActiveTab('links')}
            onKeyDown={(event) => handleTabKeyDown(event, 'links')}
          >
            링크
          </Button>
        </div>
      </section>

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
          localeSwitches={localeSwitches}
          outboundLinks={outboundLinks}
          themeToggles={themeToggles}
          sessions={sessions}
          totalSessionCount={totalSessionCount}
          sessionDetails={sessionDetails}
          classification={classification}
          timeRange={timeRange}
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
  );
}
