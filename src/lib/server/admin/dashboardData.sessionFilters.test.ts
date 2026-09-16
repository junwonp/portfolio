import { describe, expect, it } from 'vitest';

import { getAdminDashboardData } from '@/lib/server/admin/dashboardData';

interface InteractionAggregateRow {
  count: number;
  interactionType: string;
  label: string;
}

const INTERACTION_AGGREGATE_MARKER = 'GROUP BY analytics_interactions.interaction_type';

function createSqlRecordingDb(interactionRows: InteractionAggregateRow[] = []) {
  const sqls: string[] = [];
  const db = {
    prepare(sql: string) {
      sqls.push(sql);
      const results = sql.includes(INTERACTION_AGGREGATE_MARKER) ? interactionRows : [];
      const result = {
        all: async () => ({ results }),
        bind: () => result,
        first: async () => null,
        run: async () => ({}),
      };
      return result;
    },
  } as unknown as D1Database;

  return { db, sqls };
}

const SESSION_LIST_MARKER = 's.device_type as deviceType';

function getSessionListQuery(sqls: string[]): string | undefined {
  return sqls.find(
    (sql) => sql.includes(SESSION_LIST_MARKER) && sql.includes('ORDER BY s.created_at DESC'),
  );
}

describe('getAdminDashboardData session filters', () => {
  it('applies a 7-day window when timeRange=7d', async () => {
    const { db, sqls } = createSqlRecordingDb();

    await getAdminDashboardData({
      applicationProjectOptions: [],
      db,
      searchParams: { timeRange: '7d' },
      writesEnabled: false,
    });

    const sessionQueries = sqls.filter((sql) => sql.includes('FROM user_sessions s'));
    expect(sessionQueries.length).toBeGreaterThan(0);
    expect(sessionQueries.every((sql) => sql.includes("datetime('now', '-7 days')"))).toBe(true);
  });

  it('applies a 30-day window when timeRange=30d', async () => {
    const { db, sqls } = createSqlRecordingDb();

    await getAdminDashboardData({
      applicationProjectOptions: [],
      db,
      searchParams: { timeRange: '30d' },
      writesEnabled: false,
    });

    const sessionQueries = sqls.filter((sql) => sql.includes('FROM user_sessions s'));
    expect(sessionQueries.every((sql) => sql.includes("datetime('now', '-30 days')"))).toBe(true);
  });

  it('does not add a window when timeRange=all', async () => {
    const { db, sqls } = createSqlRecordingDb();

    await getAdminDashboardData({
      applicationProjectOptions: [],
      db,
      searchParams: { timeRange: 'all' },
      writesEnabled: false,
    });

    const sessionQueries = sqls.filter((sql) => sql.includes('FROM user_sessions s'));
    expect(sessionQueries.every((sql) => !sql.includes("datetime('now', '-"))).toBe(true);
  });

  it('paginates the plain session list with LIMIT', async () => {
    const { db, sqls } = createSqlRecordingDb();

    await getAdminDashboardData({
      applicationProjectOptions: [],
      db,
      searchParams: {},
      writesEnabled: false,
    });

    expect(getSessionListQuery(sqls)).toContain('LIMIT ?');
  });

  it('does not select the raw visitor IP in the session list', async () => {
    const { db, sqls } = createSqlRecordingDb();

    await getAdminDashboardData({
      applicationProjectOptions: [],
      db,
      searchParams: {},
      writesEnabled: false,
    });

    const listQuery = getSessionListQuery(sqls);
    expect(listQuery).toBeDefined();
    expect(listQuery).not.toContain('ip_address');
  });

  it('does not select the raw user agent in the session list', async () => {
    const { db, sqls } = createSqlRecordingDb();

    await getAdminDashboardData({
      applicationProjectOptions: [],
      db,
      searchParams: {},
      writesEnabled: false,
    });

    const listQuery = getSessionListQuery(sqls);
    expect(listQuery).toBeDefined();
    expect(listQuery).not.toContain('user_agent');
  });

  it('drops the SQL LIMIT when filtering by classification', async () => {
    const { db, sqls } = createSqlRecordingDb();

    await getAdminDashboardData({
      applicationProjectOptions: [],
      db,
      searchParams: { classification: 'human' },
      writesEnabled: false,
    });

    const listQuery = getSessionListQuery(sqls);
    expect(listQuery).toBeDefined();
    expect(listQuery).not.toContain('LIMIT ?');
  });

  it('selects accept_language in the session list and its GROUP BY', async () => {
    const { db, sqls } = createSqlRecordingDb();

    await getAdminDashboardData({
      applicationProjectOptions: [],
      db,
      searchParams: {},
      writesEnabled: false,
    });

    const listQuery = getSessionListQuery(sqls);
    expect(listQuery).toBeDefined();
    expect(listQuery).toContain('s.accept_language as acceptLanguage');
    expect(listQuery).toContain('s.accept_language, s.browser');
  });
});

describe('getAdminDashboardData interaction insights', () => {
  it('issues one bounded-interaction aggregate query with admin sessions excluded', async () => {
    const { db, sqls } = createSqlRecordingDb();

    await getAdminDashboardData({
      applicationProjectOptions: [],
      db,
      searchParams: {},
      writesEnabled: false,
    });

    const aggregateQueries = sqls.filter((sql) => sql.includes(INTERACTION_AGGREGATE_MARKER));
    expect(aggregateQueries).toHaveLength(1);
    expect(aggregateQueries[0]).toContain('JOIN user_sessions s');
    expect(aggregateQueries[0]).toContain('s.is_admin = 0');
    expect(aggregateQueries[0]).toContain('BETWEEN ? AND ?');
    expect(aggregateQueries[0]).not.toContain('LIMIT');
  });

  it('splits grouped interaction rows into the matching panels', async () => {
    const { db } = createSqlRecordingDb([
      { count: 9, interactionType: 'outbound_link', label: 'github' },
      { count: 5, interactionType: 'theme_toggle', label: 'dark' },
      { count: 4, interactionType: 'theme_toggle', label: 'light' },
      { count: 3, interactionType: 'outbound_link', label: 'linkedin' },
      { count: 2, interactionType: 'locale_switch', label: 'ko' },
      { count: 1, interactionType: 'accordion_project', label: 'ignored' },
      { count: 1, interactionType: 'accordion_company', label: 'ignored' },
    ]);

    const data = await getAdminDashboardData({
      applicationProjectOptions: [],
      db,
      searchParams: {},
      writesEnabled: false,
    });

    expect(data.outboundLinks).toEqual([
      { count: 9, label: 'github' },
      { count: 3, label: 'linkedin' },
    ]);
    expect(data.themeToggles).toEqual([
      { count: 5, label: 'dark' },
      { count: 4, label: 'light' },
    ]);
    expect(data.localeSwitches).toEqual([{ count: 2, label: 'ko' }]);
  });

  it('caps each interaction panel at ten entries', async () => {
    const { db } = createSqlRecordingDb(
      Array.from({ length: 12 }, (_, index) => ({
        count: 12 - index,
        interactionType: 'outbound_link',
        label: `destination-${index}`,
      })),
    );

    const data = await getAdminDashboardData({
      applicationProjectOptions: [],
      db,
      searchParams: {},
      writesEnabled: false,
    });

    expect(data.outboundLinks).toHaveLength(10);
    expect(data.outboundLinks[0]).toEqual({ count: 12, label: 'destination-0' });
    expect(data.outboundLinks.at(-1)).toEqual({ count: 3, label: 'destination-9' });
  });
});
