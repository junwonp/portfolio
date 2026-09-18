import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/server/admin/actions', () => ({
  createApplicationLink: vi.fn(),
  deleteApplicationLink: vi.fn(),
}));

import * as shared from '@/components/admin/adminShared.css';
import { DashboardLinksPanel } from '@/components/admin/DashboardLinksPanel';
import * as styles from '@/components/admin/DashboardLinksPanel.css';
import type { ApplicationLinkStats } from '@/lib/server/application-links/model';

const PROJECT_OPTIONS = [
  { id: 'oneline', title: 'Oneline' },
  { id: 'cafe', title: 'Cafe' },
];

const LINKS: ApplicationLinkStats[] = [
  {
    avgActiveTime: 12,
    avgArticleProgress: 40,
    avgDwellTime: 30,
    avgScrollDepth: 70,
    companyName: 'Toss',
    createdAt: '2026-01-01T00:00:00.000Z',
    expiresAt: '2026-03-01T00:00:00.000Z',
    id: 1,
    interactionCount: 3,
    interactionLabels: [],
    label: 'Toss Frontend',
    lastSeenAt: '2026-01-02T03:04:05.000Z',
    projectIds: ['oneline'],
    role: 'web',
    sessions: 12,
    slug: 'toss-fe',
    summaryPreset: 'web',
    views: 44,
  },
  {
    avgActiveTime: 0,
    avgArticleProgress: 0,
    avgDwellTime: 0,
    avgScrollDepth: 0,
    companyName: 'Naver',
    createdAt: '2026-01-03T00:00:00.000Z',
    expiresAt: '2026-04-01T00:00:00.000Z',
    id: 2,
    interactionCount: 0,
    interactionLabels: [],
    label: 'Naver Mobile',
    lastSeenAt: null,
    projectIds: [],
    role: 'mobile',
    sessions: 0,
    slug: 'naver-mo',
    summaryPreset: 'rn',
    views: 0,
  },
];

const renderPanel = (
  applicationLinks: ApplicationLinkStats[] = LINKS,
  options: { writesDisabledReason?: string | null; writesEnabled?: boolean } = {},
): string => {
  const { writesDisabledReason = null, writesEnabled = true } = options;

  return renderToStaticMarkup(
    <DashboardLinksPanel
      applicationLinks={applicationLinks}
      applicationProjectOptions={PROJECT_OPTIONS}
      writesDisabledReason={writesDisabledReason}
      writesEnabled={writesEnabled}
    />,
  );
};

describe('DashboardLinksPanel', () => {
  it('renders as the tabpanel the dashboard tab points at, reachable by keyboard', () => {
    const html = renderPanel();

    expect(html).toContain('id="dashboard-panel-links"');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain('aria-labelledby="dashboard-tab-links"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain(shared.dashboardPanel);
  });

  it('renders the creation card and the created-links card', () => {
    const html = renderPanel();

    expect(html).toContain('지원 링크 생성');
    expect(html).toContain('생성된 링크');
    expect(html).toContain('활성 링크 목록입니다. 상세 지표는 분석 화면에서 확인하세요.');
    expect(html).toContain('aria-labelledby="link-create-title"');
    expect(html).toContain('aria-labelledby="link-list-title"');
    expect(html).toContain(styles.applicationLinkCard);
  });

  it('states the exact creation subtitle when writes are enabled', () => {
    const html = renderPanel();

    expect(html).toContain('>회사별 짧은 URL과 맞춤 프로젝트 순서를 설정합니다.</p>');
  });

  it('appends the writes-disabled reason to the creation subtitle', () => {
    const html = renderPanel(LINKS, {
      writesDisabledReason: 'develop 환경에서는 링크 생성이 비활성화됩니다.',
      writesEnabled: false,
    });

    expect(html).toContain(
      '회사별 짧은 URL과 맞춤 프로젝트 순서를 설정합니다. develop 환경에서는 링크 생성이 비활성화됩니다.',
    );
  });

  it('counts the active links in the list badge', () => {
    expect(renderPanel()).toContain('2개 활성 링크');
    expect(renderPanel([])).toContain('0개 활성 링크');
  });

  it('declares all twelve link columns, hiding the action headers from sighted users', () => {
    const html = renderPanel();

    for (const header of [
      'Slug',
      '회사명',
      '라벨',
      '포지셔닝',
      '노출 프로젝트',
      '세션',
      '조회',
      '최근 방문',
      '만료',
    ]) {
      expect(html).toContain(header);
    }

    expect((html.match(/<th scope="col"/g) ?? []).length).toBe(12);
    for (const hidden of ['이력서', '인쇄', '삭제']) {
      expect(html).toMatch(new RegExp(`<span class="${shared.srOnly}">${hidden}</span>`));
    }
  });

  it('renders one card row per active link with its own slug and company', () => {
    const html = renderPanel();
    const rows = Array.from(html.matchAll(/<tr>[\s\S]*?<\/tr>/g), (match) => match[0]);

    const headerRowCount = 1;
    expect(rows).toHaveLength(headerRowCount + LINKS.length);
    expect(rows[1]).toContain('href="/r/toss-fe"');
    expect(rows[1]).toContain('Toss');
    expect(rows[2]).toContain('href="/r/naver-mo"');
    expect(rows[2]).toContain('Naver');
    expect(html).toContain(shared.tableScroll);
    expect(html).toContain(styles.linkTable);
  });

  it('shows the empty state and no table when there are no active links', () => {
    const html = renderPanel([]);

    expect(html).toContain('아직 생성된 지원 링크가 없습니다.');
    expect(html).not.toContain('<table');
    expect((html.match(/<tr/g) ?? []).length).toBe(0);
  });

  it('mounts the link form with the catalog project options', () => {
    const html = renderPanel();

    expect(html).toContain('name="companyName"');
    expect(html).toContain('name="slug"');
    expect(html).toContain('name="positioning"');
    expect(html).toContain('1순위');
    expect(html).toContain('링크 생성');
  });

  it('disables the link form and delete actions when writes are disabled', () => {
    const html = renderPanel(LINKS, { writesEnabled: false });
    const companyInput = /<input(?=[^>]*name="companyName")[^>]*\/>/.exec(html)?.[0] ?? '';
    const positioningSelect = /<select(?=[^>]*name="positioning")[^>]*>/.exec(html)?.[0] ?? '';

    expect(companyInput).toContain('required=""');
    expect(companyInput).toContain('disabled=""');
    expect(positioningSelect).toContain('disabled=""');
    expect((html.match(/disabled=""/g) ?? []).length).toBeGreaterThan(6);
  });
});
