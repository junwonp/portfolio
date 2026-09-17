import { describe, expect, it } from 'vitest';

import {
  buildChartPoints,
  buildLinePath,
  CHART_HEIGHT,
  CHART_WIDTH,
  type ChartPoint,
  type DailyChartEntry,
  formatChartDate,
  PADDING_BOTTOM,
  PADDING_LEFT,
  PADDING_RIGHT,
  PADDING_TOP,
  type RangeBucket,
} from '@/components/admin/trendChartGeometry';

const entry = (date: string, sessions: number, views: number, hasData = true): DailyChartEntry => ({
  date,
  hasData,
  sessions,
  views,
});

const point = (x: number, ySessions: number, yViews: number): ChartPoint => ({
  date: '2026-01-01',
  hasData: true,
  sessions: 0,
  views: 0,
  x,
  ySessions,
  yViews,
});

describe('traffic trend chart geometry', () => {
  it('exposes the SVG frame constants the chart lays out against', () => {
    expect([
      CHART_HEIGHT,
      CHART_WIDTH,
      PADDING_TOP,
      PADDING_RIGHT,
      PADDING_BOTTOM,
      PADDING_LEFT,
    ]).toEqual([220, 700, 20, 25, 35, 55]);
  });

  it('returns the floor scale and no points for an empty series', () => {
    expect(buildChartPoints([])).toEqual({ maxVal: 10, points: [] });
  });

  it('places a single point at the left padding with exact coordinates', () => {
    const { maxVal, points } = buildChartPoints([entry('2026-01-01', 10, 20)]);

    expect(maxVal).toBe(20);
    expect(points).toEqual([
      {
        date: '2026-01-01',
        hasData: true,
        sessions: 10,
        views: 20,
        x: 55,
        ySessions: 102.5,
        yViews: 20,
      },
    ]);
  });

  it('floors the scale at 10 and pins all-zero values to the baseline', () => {
    const { maxVal, points } = buildChartPoints([
      entry('2026-01-01', 0, 0),
      entry('2026-01-02', 0, 0),
      entry('2026-01-03', 0, 0),
    ]);

    expect(maxVal).toBe(10);
    expect(points.map((p) => [p.x, p.ySessions, p.yViews])).toEqual([
      [55, 185, 185],
      [365, 185, 185],
      [675, 185, 185],
    ]);
  });

  it.each([
    [0, 0, 10],
    [4, 3, 10],
    [10, 10, 10],
    [5, 120, 120],
    [90, 12, 90],
  ])('from sessions %d and views %d derives maxVal %d', (sessions, views, expected) => {
    expect(buildChartPoints([entry('2026-01-01', sessions, views)]).maxVal).toBe(expected);
  });

  it('scales both series against the largest value across every entry', () => {
    const { maxVal, points } = buildChartPoints([
      entry('2026-01-01', 120, 40),
      entry('2026-01-02', 10, 90, false),
    ]);

    expect(maxVal).toBe(120);
    expect(points[0].ySessions).toBe(20);
    expect(points[1].yViews).toBe(61.25);
    expect(points[1].hasData).toBe(false);
  });

  it('returns an empty path when there are no points', () => {
    expect(buildLinePath([], 'ySessions')).toBe('');
    expect(buildLinePath([], 'yViews')).toBe('');
  });

  it('starts a single-point path with a move command and no line segments', () => {
    // The join produces nothing here, so the separator space after the move command stays.
    expect(buildLinePath([point(55, 100, 150)], 'ySessions')).toBe('M 55 100 ');
    expect(buildLinePath([point(55, 100, 150)], 'yViews')).toBe('M 55 150 ');
  });

  it('chains one line command per extra point for the requested series', () => {
    const points = [point(0, 10, 100), point(100, 20, 200), point(200, 30, 300)];

    expect(buildLinePath(points, 'ySessions')).toBe('M 0 10 L 100 20 L 200 30');
    expect(buildLinePath(points, 'yViews')).toBe('M 0 100 L 100 200 L 200 300');
  });

  it('renders the path of a chart built by buildChartPoints', () => {
    const { points } = buildChartPoints([entry('2026-01-01', 0, 0), entry('2026-01-02', 0, 0)]);

    expect(buildLinePath(points, 'ySessions')).toBe('M 55 185 L 675 185');
  });

  const dateCases: [string, RangeBucket, string][] = [
    ['2026-01-05', 'day', '01-05'],
    ['2026-01-05', 'month', '2026-01-05'],
    ['2026-01', 'day', '01'],
    ['', 'day', ''],
  ];

  it.each(dateCases)('formats "%s" for the %s bucket as "%s"', (date, bucket, expected) => {
    expect(formatChartDate(date, bucket)).toBe(expected);
  });
});
