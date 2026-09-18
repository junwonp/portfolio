import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { DetailsGrid } from '@/components/admin/DetailsGrid';
import * as styles from '@/components/admin/DetailsGrid.css';

type DetailsProps = Parameters<typeof DetailsGrid>[0];

const POPULATED: DetailsProps = {
  webVitals: [
    {
      avgValue: 2.4,
      good: 20,
      metricName: 'LCP',
      needsImprovement: 7,
      poor: 3,
      samples: 30,
    },
  ],
  topCountries: [
    { count: 12, country: 'KR' },
    { count: 6, country: 'unknown' },
  ],
  topPages: [
    {
      avgActive: 12.5,
      avgArticleProgress: 40,
      avgDwell: 48.1,
      avgScroll: 80,
      path: '/projects/oneline',
      views: 9,
    },
    {
      avgActive: 3,
      avgArticleProgress: 10,
      avgDwell: 8,
      avgScroll: 20,
      path: '/privacy',
      views: 4,
    },
  ],
  topReferrers: [
    { count: 10, referrer: 'google.com' },
    { count: 5, referrer: 'github.com' },
  ],
};

const EMPTY: DetailsProps = {
  topCountries: [],
  topPages: [],
  topReferrers: [],
  webVitals: [],
};

const renderGrid = (props: DetailsProps): string =>
  renderToStaticMarkup(<DetailsGrid {...props} />);

describe('DetailsGrid', () => {
  it('renders the four detail sections inside the grid layout', () => {
    const html = renderGrid(POPULATED);

    expect(html).toContain(styles.detailsGrid);
    expect(html).toContain(styles.tableCard);
    expect(html).toContain(styles.flexCard);
    for (const title of [
      '가장 많이 방문한 페이지',
      '주요 유입 소스 (Referrer)',
      '주요 접속 국가',
      '코어 웹 바이탈',
    ]) {
      expect(html).toContain(title);
    }
  });

  it('renders every top page column header and row value', () => {
    const html = renderGrid(POPULATED);

    for (const header of [
      '페이지 경로',
      '조회 수',
      '평균 체류',
      '활성 시간',
      '평균 스크롤',
      '본문 진행',
    ]) {
      expect(html).toContain(header);
    }

    expect(html).toContain('title="/projects/oneline"');
    expect(html).toContain('>9<');
    expect(html).toContain('48.1초');
    expect(html).toContain('12.5초');
    expect(html).toContain('80%');
    expect(html).toContain('40%');
  });

  it('exposes scroll and article progress as clamped progressbars with inline widths', () => {
    const html = renderGrid(POPULATED);

    expect(html).toContain('aria-label="평균 스크롤"');
    expect(html).toContain('aria-label="본문 진행"');
    expect(html).toContain('aria-valuenow="80"');
    expect(html).toContain('width:80%');
    expect(html).toContain('aria-valuenow="40"');
    expect(html).toContain('width:40%');
    const expectedProgressBarCount = 2 * 2 + 2 + 2;
    expect((html.match(/role="progressbar"/g) ?? []).length).toBe(expectedProgressBarCount);
  });

  it('scales each referrer bar against the largest referrer count', () => {
    const html = renderGrid(POPULATED);

    expect(html).toContain('google.com');
    expect(html).toContain('aria-label="google.com 유입 비중"');
    expect(html).toContain('aria-valuenow="100"');
    expect(html).toContain('aria-label="github.com 유입 비중"');
    expect(html).toContain('aria-valuenow="50"');
    expect(html).toContain('width:50%');
  });

  it('renders unknown countries as direct/VPN traffic in both the label and the bar name', () => {
    const html = renderGrid(POPULATED);

    expect(html).toContain('직접 유입 / VPN');
    expect(html).toContain('aria-label="직접 유입 / VPN 접속 비중"');
    expect(html).toContain('aria-label="KR 접속 비중"');
    expect(html).toContain('aria-valuenow="100"');
    expect(html).toContain('aria-valuenow="50"');
  });

  it('renders the web vitals average with its sample count and rating breakdown', () => {
    const html = renderGrid(POPULATED);

    expect(html).toContain('LCP');
    expect(html).toContain('2.4 · 30회');
    expect(html).toContain('좋음 20 · 개선 필요 7 · 나쁨 3');
    expect(html).toContain(styles.mutedText);
  });

  it('shows an empty state in each section when every dataset is empty', () => {
    const html = renderGrid(EMPTY);

    for (const message of [
      '아직 기록된 방문자 정보가 없습니다.',
      '기록된 유입 경로 정보가 없습니다.',
      '기록된 국가 정보가 없습니다.',
      '기록된 Web Vitals 샘플이 없습니다.',
    ]) {
      expect(html).toContain(message);
    }

    expect(html).not.toContain('<table');
    expect((html.match(/role="status"/g) ?? []).length).toBe(4);
  });
});
