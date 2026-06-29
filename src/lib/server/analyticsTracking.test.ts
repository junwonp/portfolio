import { describe, expect, it } from 'vitest';

import type { AnalyticsPayload } from '@/lib/server/analyticsPayload';
import { recordAnalyticsPayload } from '@/lib/server/analyticsTracking';

class D1Mock {
  applicationLinks = new Map<string, { id: number }>();
  applicationLinkVisits: Array<{ application_link_id: number; session_id: string }> = [];
  pageViews: Array<{ dwell_time: number; path: string; scroll_depth: number; session_id: string }> =
    [];
  userSessions: Array<{
    id: string;
    ip_country: string;
    is_admin: number;
    referrer: string;
    user_agent: string;
  }> = [];

  prepare(sql: string) {
    return {
      bind: (...values: unknown[]) => ({
        first: async () => {
          if (sql.includes('FROM application_links')) {
            return this.applicationLinks.get(String(values[0])) ?? null;
          }

          return null;
        },
        run: async () => {
          if (sql.includes('INSERT OR IGNORE INTO user_sessions')) {
            this.userSessions.push({
              id: String(values[0]),
              ip_country: String(values[1]),
              user_agent: String(values[2]),
              referrer: String(values[3]),
              is_admin: Number(values[4]),
            });
          }

          if (sql.includes('INSERT OR IGNORE INTO application_link_visits')) {
            this.applicationLinkVisits.push({
              session_id: String(values[0]),
              application_link_id: Number(values[1]),
            });
          }

          if (sql.includes('INSERT INTO page_views')) {
            this.pageViews.push({
              session_id: String(values[0]),
              path: String(values[1]),
              dwell_time: Number(values[2]),
              scroll_depth: Number(values[3]),
            });
          }

          return {};
        },
      }),
    };
  }
}

describe('recordAnalyticsPayload', () => {
  it('records initial sessions, application link attribution, and page views', async () => {
    const db = new D1Mock();
    db.applicationLinks.set('abcd', { id: 7 });
    const payload: AnalyticsPayload = {
      applicationSlug: 'abcd',
      dwellTime: 42,
      isInitial: true,
      path: '/abcd',
      referrer: 'https://example.com',
      scrollDepth: 86,
      sessionId: 'session-1',
      userAgent: 'Vitest',
    };

    await recordAnalyticsPayload({
      country: 'KR',
      db: db as unknown as D1Database,
      payload,
    });

    expect(db.userSessions).toEqual([
      {
        id: 'session-1',
        ip_country: 'KR',
        is_admin: 0,
        referrer: 'https://example.com',
        user_agent: 'Vitest',
      },
    ]);
    expect(db.applicationLinkVisits).toEqual([
      { application_link_id: 7, session_id: 'session-1' },
    ]);
    expect(db.pageViews).toEqual([
      { dwell_time: 42, path: '/abcd', scroll_depth: 86, session_id: 'session-1' },
    ]);
  });

  it('does not attribute a session when the application slug is missing or expired', async () => {
    const db = new D1Mock();
    const payload: AnalyticsPayload = {
      applicationSlug: 'expired',
      dwellTime: 3,
      isInitial: false,
      path: '/expired',
      referrer: 'direct',
      scrollDepth: 10,
      sessionId: 'session-2',
      userAgent: 'Vitest',
    };

    await recordAnalyticsPayload({
      country: 'unknown',
      db: db as unknown as D1Database,
      payload,
    });

    expect(db.applicationLinkVisits).toEqual([]);
    expect(db.pageViews).toEqual([
      { dwell_time: 3, path: '/expired', scroll_depth: 10, session_id: 'session-2' },
    ]);
  });
});
