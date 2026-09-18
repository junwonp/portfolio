import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { StatsGrid } from '@/components/admin/StatsGrid';
import * as styles from '@/components/admin/StatsGrid.css';

type Stats = Parameters<typeof StatsGrid>[0]['stats'];

const STATS: Stats = {
  avgActiveTime: 32.4,
  avgArticleProgress: 61.8,
  avgDwellTime: 48.2,
  avgScrollDepth: 74.5,
  totalPageViews: 1204,
  totalSessions: 318,
};

const renderStats = (stats: Stats): string => renderToStaticMarkup(<StatsGrid stats={stats} />);

describe('StatsGrid', () => {
  it('labels the section as the core metrics region', () => {
    const html = renderStats(STATS);

    expect(html).toContain('aria-label="핵심 지표"');
    expect(html).toContain(styles.metricsGrid);
  });

  it('renders all six metric labels with their values formatted as counts, seconds or percentages', () => {
    const html = renderStats(STATS);
    const metrics: [string, string][] = [
      ['총 세션 수', '318'],
      ['총 페이지 뷰', '1204'],
      ['평균 체류 시간', '48.2초'],
      ['평균 스크롤 깊이', '74.5%'],
      ['평균 활성 시간', '32.4초'],
      ['평균 본문 진행률', '61.8%'],
    ];

    for (const [label, value] of metrics) {
      expect(html).toContain(label);
      expect(html).toContain(value);
    }

    expect((html.match(/<dt/g) ?? []).length).toBe(6);
    expect((html.match(/<dd/g) ?? []).length).toBe(6);
  });

  it('renders each metric description, including the admin-exclusion note', () => {
    const html = renderStats(STATS);

    for (const description of [
      '고유 방문자 수 (어드민 제외)',
      '누적 기록된 페이지 조회 수',
      '페이지별 평균 머무른 시간',
      '사용자가 페이지를 내려본 평균 비율',
      '탭이 실제로 보였던 시간',
      '프로젝트 글 본문 기준 읽은 깊이',
    ]) {
      expect(html).toContain(description);
    }
  });

  it('renders a zeroed dashboard as explicit zeros rather than blank cells', () => {
    const html = renderStats({
      avgActiveTime: 0,
      avgArticleProgress: 0,
      avgDwellTime: 0,
      avgScrollDepth: 0,
      totalPageViews: 0,
      totalSessions: 0,
    });

    expect(html).toContain('>0<');
    expect((html.match(/>0초<\/dd>/g) ?? []).length).toBe(2);
    expect((html.match(/>0%<\/dd>/g) ?? []).length).toBe(2);
  });
});
