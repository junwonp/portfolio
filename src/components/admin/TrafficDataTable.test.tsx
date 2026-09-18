import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as shared from '@/components/admin/adminShared.css';
import { TrafficDataTable } from '@/components/admin/TrafficDataTable';
import type { DailyChartEntry } from '@/components/admin/trendChartGeometry';

const dailyChart: DailyChartEntry[] = [
  { date: '2026-01-01', hasData: true, sessions: 12, views: 40 },
  { date: '2026-01-02', hasData: false, sessions: 0, views: 0 },
  { date: '2026-01-03', hasData: true, sessions: 7, views: 19 },
];

const renderTable = (chart: DailyChartEntry[], rangeLabel = '최근 30일'): string =>
  renderToStaticMarkup(<TrafficDataTable dailyChart={chart} rangeLabel={rangeLabel} />);

describe('TrafficDataTable', () => {
  it('keeps the whole table inside the visually hidden wrapper', () => {
    const html = renderTable(dailyChart);

    expect(html).toContain(shared.srOnly);
    expect(html).toMatch(new RegExp(`<div class="${shared.srOnly}"><table>`));
  });

  it('captions the table with the active range label', () => {
    const html = renderTable(dailyChart, '최근 7일');

    expect(html).toContain('<caption>최근 7일 트래픽 데이터</caption>');
  });

  it('declares the date, session and view columns as column headers', () => {
    const html = renderTable(dailyChart);

    expect(html).toContain('<th scope="col">날짜</th>');
    expect(html).toContain('<th scope="col">세션 수</th>');
    expect(html).toContain('<th scope="col">조회 수</th>');
    expect((html.match(/<th scope="col"/g) ?? []).length).toBe(3);
  });

  it('renders one row per day with the date as the row header and raw counts', () => {
    const html = renderTable(dailyChart);

    expect(html).toContain('<th scope="row">2026-01-01</th>');
    expect(html).toContain('<th scope="row">2026-01-02</th>');
    expect(html).toContain('<th scope="row">2026-01-03</th>');
    expect((html.match(/<th scope="row"/g) ?? []).length).toBe(3);

    const rows = Array.from(html.matchAll(/<tr>[\s\S]*?<\/tr>/g), (match) => match[0]);
    const headerRowCount = 1;
    expect(rows).toHaveLength(headerRowCount + dailyChart.length);
    expect(rows[1]).toContain('<td>12</td><td>40</td>');
    expect(rows[2]).toContain('<td>0</td><td>0</td>');
    expect(rows[3]).toContain('<td>7</td><td>19</td>');
  });

  it('renders only the header row for an empty series', () => {
    const html = renderTable([], '최근 1년');

    expect(html).toContain('<caption>최근 1년 트래픽 데이터</caption>');
    expect((html.match(/<tr>/g) ?? []).length).toBe(1);
    expect(html).not.toContain('<th scope="row"');
  });
});
