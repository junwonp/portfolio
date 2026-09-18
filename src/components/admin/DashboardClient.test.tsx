// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const logout = vi.hoisted(() => vi.fn());
const createApplicationLink = vi.hoisted(() => vi.fn());
const deleteApplicationLink = vi.hoisted(() => vi.fn());
vi.mock('@/lib/server/admin/actions', () => ({
  createApplicationLink,
  deleteApplicationLink,
  logout,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import { DashboardClient } from '@/components/admin/DashboardClient';
import * as styles from '@/components/admin/DashboardClient.css';
import type { DashboardClientProps } from '@/lib/server/admin/dashboardData';

const BASE_PROPS: DashboardClientProps = {
  applicationFilterOptions: [
    { companyName: 'Toss', id: 3, label: 'Toss Frontend', slug: 'toss-fe' },
  ],
  applicationLinks: [
    {
      avgActiveTime: 4,
      avgArticleProgress: 30,
      avgDwellTime: 9,
      avgScrollDepth: 55,
      companyName: 'Toss',
      createdAt: '2026-01-01T00:00:00.000Z',
      expiresAt: '2026-03-01T00:00:00.000Z',
      id: 1,
      interactionCount: 0,
      interactionLabels: [],
      label: 'Toss Frontend',
      lastSeenAt: null,
      projectIds: ['oneline'],
      role: 'web',
      sessions: 0,
      slug: 'toss-fe',
      summaryPreset: 'web',
      views: 0,
    },
  ],
  applicationProjectOptions: [{ id: 'oneline', title: 'Oneline' }],
  dailyChart: [{ date: '2026-01-30', hasData: true, sessions: 2, views: 5 }],
  initialTab: 'analytics',
  localeSwitches: [],
  outboundLinks: [],
  selectedApplicationLinkId: '',
  sessionDetails: {},
  sessions: [],
  stats: {
    avgActiveTime: 0,
    avgArticleProgress: 0,
    avgDwellTime: 0,
    avgScrollDepth: 0,
    totalPageViews: 5,
    totalSessions: 2,
  },
  themeToggles: [],
  topCountries: [],
  topPages: [],
  topReferrers: [],
  totalSessionCount: 0,
  trafficRange: { bucket: 'day', days: 30, label: '최근 30일', value: '30d' },
  trafficSummary: {
    activeDays: 1,
    quietDays: 29,
    rangeEnd: '2026-01-30',
    rangeSessions: 2,
    rangeStart: '2026-01-01',
    rangeViews: 5,
  },
  webVitals: [],
  writesDisabledReason: null,
  writesEnabled: true,
};

const renderClient = (overrides: Partial<DashboardClientProps> = {}): ReturnType<typeof render> =>
  render(<DashboardClient {...BASE_PROPS} {...overrides} />);

const analyticsTab = (): HTMLElement => screen.getByRole('tab', { name: '분석' });
const linksTab = (): HTMLElement => screen.getByRole('tab', { name: '링크' });

afterEach(() => {
  cleanup();
});

describe('DashboardClient header', () => {
  it('renders the dashboard title, subtitle and logout form', () => {
    const { container } = renderClient();

    expect(screen.getByRole('heading', { name: '분석 대시보드' })).toBeInTheDocument();
    expect(screen.getByText('Cloudflare Edge 기반 실시간 방문자 행동 분석')).toHaveClass(
      styles.subtitle,
    );
    expect(container.querySelector(`.${styles.dashboardContainer}`)).not.toBeNull();

    const logoutButton = screen.getByRole('button', { name: '로그아웃' });
    expect(logoutButton.closest('form')).not.toBeNull();
    expect(logout).not.toHaveBeenCalled();
  });
});

describe('DashboardClient tabs', () => {
  it('marks up the segmented control as a labelled tablist', () => {
    renderClient();
    const tablist = screen.getByRole('tablist', { name: '대시보드 화면 선택' });

    expect(tablist).toHaveClass(styles.segmentedControl);
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(analyticsTab()).toHaveAttribute('id', 'dashboard-tab-analytics');
    expect(analyticsTab()).toHaveAttribute('aria-controls', 'dashboard-panel-analytics');
    expect(linksTab()).toHaveAttribute('id', 'dashboard-tab-links');
    expect(linksTab()).toHaveAttribute('aria-controls', 'dashboard-panel-links');
  });

  it('starts on the analytics tab with the analytics copy and panel', () => {
    renderClient();

    expect(analyticsTab()).toHaveAttribute('aria-selected', 'true');
    expect(analyticsTab()).toHaveAttribute('tabindex', '0');
    expect(linksTab()).toHaveAttribute('aria-selected', 'false');
    expect(linksTab()).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('기본 화면')).toBeInTheDocument();
    expect(screen.getByText('분석 지표')).toBeInTheDocument();
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(document.getElementById('dashboard-panel-analytics')).not.toBeNull();
    expect(document.getElementById('dashboard-panel-links')).toBeNull();
  });

  it('starts on the links tab when the dashboard was opened with that tab', () => {
    renderClient({ initialTab: 'links' });

    expect(linksTab()).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('관리 화면')).toBeInTheDocument();
    expect(screen.getByText('지원 링크 생성 및 관리')).toBeInTheDocument();
    expect(document.getElementById('dashboard-panel-links')).not.toBeNull();
    expect(document.getElementById('dashboard-panel-analytics')).toBeNull();
  });

  it('switches panels when a tab is clicked and switches back', async () => {
    const user = userEvent.setup();
    renderClient();

    await user.click(linksTab());

    expect(linksTab()).toHaveAttribute('aria-selected', 'true');
    expect(analyticsTab()).toHaveAttribute('aria-selected', 'false');
    expect(document.getElementById('dashboard-panel-links')).not.toBeNull();
    expect(document.getElementById('dashboard-panel-analytics')).toBeNull();

    await user.click(analyticsTab());

    expect(analyticsTab()).toHaveAttribute('aria-selected', 'true');
    expect(document.getElementById('dashboard-panel-analytics')).not.toBeNull();
    expect(document.getElementById('dashboard-panel-links')).toBeNull();
  });

  it('announces an empty links list with the writes-disabled reason', async () => {
    const user = userEvent.setup();
    renderClient({
      applicationLinks: [],
      writesDisabledReason: 'develop 환경에서는 링크 생성과 삭제가 비활성화됩니다.',
      writesEnabled: false,
    });

    await user.click(linksTab());

    expect(screen.getByText('아직 생성된 지원 링크가 없습니다.')).toBeInTheDocument();
    expect(
      screen.getByText(/develop 환경에서는 링크 생성과 삭제가 비활성화됩니다.$/),
    ).toBeInTheDocument();
  });
});

describe('DashboardClient tab keyboard navigation', () => {
  it('moves right from 분석 to 링크 and focuses the new tab', async () => {
    const user = userEvent.setup();
    renderClient();
    analyticsTab().focus();

    await user.keyboard('{ArrowRight}');

    expect(linksTab()).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(linksTab());
  });

  it('moves left from 링크 to 분석 and focuses the new tab', async () => {
    const user = userEvent.setup();
    renderClient({ initialTab: 'links' });
    linksTab().focus();

    await user.keyboard('{ArrowLeft}');

    expect(analyticsTab()).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(analyticsTab());
  });

  it('wraps left from the first tab to the last', async () => {
    const user = userEvent.setup();
    renderClient();
    analyticsTab().focus();

    await user.keyboard('{ArrowLeft}');

    expect(linksTab()).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(linksTab());
  });

  it('wraps right from the last tab to the first', async () => {
    const user = userEvent.setup();
    renderClient({ initialTab: 'links' });
    linksTab().focus();

    await user.keyboard('{ArrowRight}');

    expect(analyticsTab()).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(analyticsTab());
  });

  it('jumps to the first tab with Home and the last tab with End', async () => {
    const user = userEvent.setup();
    renderClient({ initialTab: 'links' });
    linksTab().focus();

    await user.keyboard('{Home}');

    expect(analyticsTab()).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(analyticsTab());

    await user.keyboard('{End}');

    expect(linksTab()).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(linksTab());
  });

  it('ignores keys outside the tab pattern', async () => {
    const user = userEvent.setup();
    renderClient();
    analyticsTab().focus();

    await user.keyboard('{ArrowUp}');
    await user.keyboard('a');

    expect(analyticsTab()).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(analyticsTab());
  });
});
