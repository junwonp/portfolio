import { describe, expect, it } from 'vitest';

import { getAdminDashboardData } from '@/lib/server/admin/dashboardData';

function createSqlRecordingDb() {
  const sqls: string[] = [];
  const db = {
    prepare(sql: string) {
      sqls.push(sql);
      const result = {
        all: async () => ({ results: [] }),
        bind: () => result,
        first: async () => null,
        run: async () => ({}),
      };
      return result;
    },
  } as unknown as D1Database;

  return { db, sqls };
}

const SESSION_LIST_MARKER = 'COALESCE(s.ip_address, ';

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
});
