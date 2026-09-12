export const CHART_HEIGHT = 220;
export const CHART_WIDTH = 700;
export const PADDING_BOTTOM = 35;
export const PADDING_LEFT = 55;
export const PADDING_RIGHT = 25;
export const PADDING_TOP = 20;

export type RangeBucket = 'day' | 'month';

export interface DailyChartEntry {
  date: string;
  hasData: boolean;
  sessions: number;
  views: number;
}

export interface ChartPoint extends DailyChartEntry {
  x: number;
  ySessions: number;
  yViews: number;
}

export interface TrafficRange {
  bucket: RangeBucket;
  days: number;
  label: string;
  value: '7d' | '30d' | '1y';
}

export interface TrafficSummary {
  activeDays: number;
  quietDays: number;
  rangeEnd: string;
  rangeSessions: number;
  rangeStart: string;
  rangeViews: number;
}

export function buildChartPoints(dailyChart: DailyChartEntry[]): {
  maxVal: number;
  points: ChartPoint[];
} {
  const maxVal = Math.max(...dailyChart.map((d) => Math.max(d.sessions, d.views)), 10);
  const points = dailyChart.map((d, i) => {
    const x =
      PADDING_LEFT +
      (i / Math.max(dailyChart.length - 1, 1)) * (CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT);
    const ySessions =
      CHART_HEIGHT -
      PADDING_BOTTOM -
      (d.sessions / maxVal) * (CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM);
    const yViews =
      CHART_HEIGHT -
      PADDING_BOTTOM -
      (d.views / maxVal) * (CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM);
    return {
      x,
      ySessions,
      yViews,
      date: d.date,
      hasData: d.hasData,
      sessions: d.sessions,
      views: d.views,
    };
  });

  return { maxVal, points };
}

export function buildLinePath(points: ChartPoint[], key: 'ySessions' | 'yViews'): string {
  if (points.length === 0) return '';
  return (
    `M ${points[0].x} ${points[0][key]} ` +
    points
      .slice(1)
      .map((p) => `L ${p.x} ${p[key]}`)
      .join(' ')
  );
}

export function formatChartDate(date: string, bucket: RangeBucket): string {
  if (bucket === 'month') return date;
  return date.slice(5);
}
