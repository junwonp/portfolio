import { describe, expect, it } from 'vitest';

import { getAdminDashboardData } from '@/lib/server/adminDashboardData';

class MissingSchemaDbMock {
  prepare() {
    return {
      bind: () => ({
        all: async () => {
          throw new Error('D1_ERROR: no such table: application_links: SQLITE_ERROR');
        },
      }),
      run: async () => {
        throw new Error('D1_ERROR: no such table: page_views: SQLITE_ERROR');
      },
      all: async () => {
        throw new Error('D1_ERROR: no such table: application_links: SQLITE_ERROR');
      },
    };
  }
}

const projectOptions = [{ id: 'today-weather', title: 'Today Weather' }];
const today = new Date('2026-06-29T00:00:00.000Z');

describe('getAdminDashboardData', () => {
  it('returns an empty dashboard when the analytics schema is not provisioned locally', async () => {
    const data = await getAdminDashboardData({
      applicationProjectOptions: projectOptions,
      db: new MissingSchemaDbMock() as unknown as D1Database,
      searchParams: {},
      today,
      writesEnabled: true,
    });

    expect(data).toMatchObject({
      applicationFilterOptions: [],
      applicationLinks: [],
      applicationProjectOptions: projectOptions,
      initialTab: 'analytics',
      selectedApplicationLinkId: '',
      stats: {
        avgActiveTime: 0,
        avgArticleProgress: 0,
        avgDwellTime: 0,
        avgScrollDepth: 0,
        totalPageViews: 0,
        totalSessions: 0,
      },
      topCountries: [],
      topPages: [],
      topReferrers: [],
      trafficRange: {
        bucket: 'day',
        days: 30,
        label: '최근 30일',
        value: '30d',
      },
      trafficSummary: {
        activeDays: 0,
        quietDays: 30,
        rangeEnd: '2026-06-29',
        rangeSessions: 0,
        rangeStart: '2026-05-31',
        rangeViews: 0,
      },
      webVitals: [],
      writesDisabledReason:
        'D1 analytics schema가 아직 준비되지 않아 링크 생성과 삭제가 비활성화됩니다.',
      writesEnabled: false,
    });
    expect(data.dailyChart).toHaveLength(30);
  });
});
