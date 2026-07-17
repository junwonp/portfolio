export interface DailyChartPoint {
  date: string;
  hasData: boolean;
  sessions: number;
  views: number;
}

export interface RawDailyChartPoint {
  date: string;
  sessions: number;
  views: number;
}

export type TrafficBucket = 'day' | 'month';

export type TrafficRangeValue = '7d' | '30d' | '1y';

export interface TrafficRangeConfig {
  bucket: TrafficBucket;
  days: number;
  label: string;
  value: TrafficRangeValue;
}

export interface TrafficSummary {
  activeDays: number;
  quietDays: number;
  rangeEnd: string;
  rangeSessions: number;
  rangeStart: string;
  rangeViews: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const TRAFFIC_RANGE_CONFIGS: Record<TrafficRangeValue, TrafficRangeConfig> = {
  '7d': {
    bucket: 'day',
    days: 7,
    label: '최근 7일',
    value: '7d',
  },
  '30d': {
    bucket: 'day',
    days: 30,
    label: '최근 30일',
    value: '30d',
  },
  '1y': {
    bucket: 'month',
    days: 365,
    label: '최근 1년',
    value: '1y',
  },
};

export const getIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

export const addUtcDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * MS_PER_DAY);

export const getIsoMonth = (date: Date): string => date.toISOString().slice(0, 7);

export const addUtcMonths = (date: Date, months: number): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));

export const getTrafficRangeConfig = (value: string | null): TrafficRangeConfig => {
  if (value === '7d' || value === '30d' || value === '1y') {
    return TRAFFIC_RANGE_CONFIGS[value];
  }

  return TRAFFIC_RANGE_CONFIGS['30d'];
};

export const buildDailyChartRange = (
  rawPoints: RawDailyChartPoint[],
  endDate: Date,
  days: number,
): DailyChartPoint[] => {
  const normalizedEndDate = new Date(
    Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()),
  );
  const startDate = addUtcDays(normalizedEndDate, -(days - 1));
  const pointByDate = new Map(rawPoints.map((point) => [point.date, point]));

  return Array.from({ length: days }, (_, index) => {
    const date = getIsoDate(addUtcDays(startDate, index));
    const point = pointByDate.get(date);
    const sessions = point?.sessions ?? 0;
    const views = point?.views ?? 0;

    return {
      date,
      hasData: sessions > 0 || views > 0,
      sessions,
      views,
    };
  });
};

export const buildMonthlyChartRange = (
  rawPoints: RawDailyChartPoint[],
  endDate: Date,
  months: number,
): DailyChartPoint[] => {
  const normalizedEndDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1));
  const startDate = addUtcMonths(normalizedEndDate, -(months - 1));
  const pointByDate = new Map(rawPoints.map((point) => [point.date, point]));

  return Array.from({ length: months }, (_, index) => {
    const date = getIsoMonth(addUtcMonths(startDate, index));
    const point = pointByDate.get(date);
    const sessions = point?.sessions ?? 0;
    const views = point?.views ?? 0;

    return {
      date,
      hasData: sessions > 0 || views > 0,
      sessions,
      views,
    };
  });
};

export const summarizeDailyChart = (dailyChart: DailyChartPoint[]): TrafficSummary => {
  const activeDays = dailyChart.filter((point) => point.hasData).length;

  return {
    activeDays,
    quietDays: dailyChart.length - activeDays,
    rangeEnd: dailyChart.at(-1)?.date ?? '',
    rangeSessions: dailyChart.reduce((total, point) => total + point.sessions, 0),
    rangeStart: dailyChart[0]?.date ?? '',
    rangeViews: dailyChart.reduce((total, point) => total + point.views, 0),
  };
};
