import { describe, expect, it } from 'vitest';

import type { AnalyticsPayloadBody } from '@/lib/server/analyticsPayload';
import { recordAnalyticsPayload } from '@/lib/server/analyticsTracking';

class D1Mock {
  applicationLinks = new Map<string, { id: number }>();
  applicationLinkVisits: Array<{ application_link_id: number; session_id: string }> = [];
  pageViews: Array<{
    active_time: number;
    article_progress: number;
    client_page_view_id: string | null;
    dwell_time: number;
    max_visible_section_id: string | null;
    max_visible_section_label: string | null;
    path: string;
    scroll_depth: number;
    session_id: string;
  }> = [];
  userSessions: Array<{
    id: string;
    ip_country: string;
    is_admin: number;
    referrer: string;
    user_agent: string;
  }> = [];
  webVitals: Array<{
    delta: number;
    metric_id: string;
    metric_name: string;
    navigation_type: string;
    path: string;
    rating: string;
    session_id: string;
    value: number;
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
            if (this.userSessions.some((session) => session.id === String(values[0]))) {
              return {};
            }
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
            const nextPageView = {
              client_page_view_id: values[0] === null ? null : String(values[0]),
              session_id: String(values[1]),
              path: String(values[2]),
              dwell_time: Number(values[3]),
              scroll_depth: Number(values[4]),
              active_time: Number(values[5]),
              article_progress: Number(values[6]),
              max_visible_section_id: values[7] === null ? null : String(values[7]),
              max_visible_section_label: values[8] === null ? null : String(values[8]),
            };
            const existingIndex = this.pageViews.findIndex(
              (pageView) =>
                pageView.client_page_view_id &&
                pageView.client_page_view_id === nextPageView.client_page_view_id,
            );

            if (existingIndex === -1) {
              this.pageViews.push(nextPageView);
            } else {
              const current = this.pageViews[existingIndex];
              this.pageViews[existingIndex] = {
                ...current,
                active_time: Math.max(current.active_time, nextPageView.active_time),
                article_progress: Math.max(current.article_progress, nextPageView.article_progress),
                dwell_time: Math.max(current.dwell_time, nextPageView.dwell_time),
                max_visible_section_id: nextPageView.max_visible_section_id,
                max_visible_section_label: nextPageView.max_visible_section_label,
                scroll_depth: Math.max(current.scroll_depth, nextPageView.scroll_depth),
              };
            }
          }

          if (sql.includes('INSERT INTO web_vitals')) {
            this.webVitals.push({
              session_id: String(values[0]),
              path: String(values[1]),
              metric_id: String(values[2]),
              metric_name: String(values[3]),
              value: Number(values[4]),
              delta: Number(values[5]),
              rating: String(values[6]),
              navigation_type: String(values[7]),
            });
          }

          return {};
        },
      }),
      run: async () => ({}),
    };
  }
}

describe('recordAnalyticsPayload', () => {
  it('records initial sessions, application link attribution, and page views', async () => {
    const db = new D1Mock();
    db.applicationLinks.set('abcd', { id: 7 });
    const payload: AnalyticsPayloadBody = {
      applicationSlug: 'abcd',
      activeTime: 40,
      articleProgress: 70,
      dwellTime: 42,
      eventType: 'page',
      isInitial: true,
      maxVisibleSectionId: 'overview',
      maxVisibleSectionLabel: 'Overview',
      pageViewId: 'page-view-1',
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
    expect(db.applicationLinkVisits).toEqual([{ application_link_id: 7, session_id: 'session-1' }]);
    expect(db.pageViews).toEqual([
      {
        active_time: 40,
        article_progress: 70,
        client_page_view_id: 'page-view-1',
        dwell_time: 42,
        max_visible_section_id: 'overview',
        max_visible_section_label: 'Overview',
        path: '/abcd',
        scroll_depth: 86,
        session_id: 'session-1',
      },
    ]);
  });

  it('updates an existing page view instead of inserting duplicate flush rows', async () => {
    const db = new D1Mock();
    const basePayload: AnalyticsPayloadBody = {
      activeTime: 10,
      articleProgress: 25,
      dwellTime: 12,
      eventType: 'page',
      isInitial: true,
      maxVisibleSectionId: 'overview',
      maxVisibleSectionLabel: 'Overview',
      pageViewId: 'page-view-1',
      path: '/projects/aira',
      referrer: 'direct',
      scrollDepth: 30,
      sessionId: 'session-1',
      userAgent: 'Vitest',
    };

    await recordAnalyticsPayload({
      country: 'KR',
      db: db as unknown as D1Database,
      payload: basePayload,
    });
    await recordAnalyticsPayload({
      country: 'KR',
      db: db as unknown as D1Database,
      payload: {
        ...basePayload,
        activeTime: 45,
        articleProgress: 80,
        dwellTime: 50,
        maxVisibleSectionId: 'retrospective',
        maxVisibleSectionLabel: 'Retrospective',
        scrollDepth: 92,
      },
    });

    expect(db.pageViews).toHaveLength(1);
    expect(db.pageViews[0]).toMatchObject({
      active_time: 45,
      article_progress: 80,
      dwell_time: 50,
      max_visible_section_id: 'retrospective',
      max_visible_section_label: 'Retrospective',
      scroll_depth: 92,
    });
  });

  it('records web vital metrics using the same visitor session', async () => {
    const db = new D1Mock();
    const payload: AnalyticsPayloadBody = {
      eventType: 'web-vital',
      metricDelta: 250.2,
      metricId: 'vital-1',
      metricName: 'LCP',
      metricRating: 'needs-improvement',
      metricValue: 2450.8,
      navigationType: 'navigate',
      path: '/projects/aira',
      referrer: 'direct',
      sessionId: 'session-1',
      userAgent: 'Vitest',
    };

    await recordAnalyticsPayload({
      country: 'KR',
      db: db as unknown as D1Database,
      payload,
    });

    expect(db.userSessions).toHaveLength(1);
    expect(db.webVitals).toEqual([
      {
        delta: 250.2,
        metric_id: 'vital-1',
        metric_name: 'LCP',
        navigation_type: 'navigate',
        path: '/projects/aira',
        rating: 'needs-improvement',
        session_id: 'session-1',
        value: 2450.8,
      },
    ]);
  });

  it('does not attribute a session when the application slug is missing or expired', async () => {
    const db = new D1Mock();
    const payload: AnalyticsPayloadBody = {
      applicationSlug: 'expired',
      activeTime: 3,
      articleProgress: 0,
      dwellTime: 3,
      eventType: 'page',
      isInitial: false,
      maxVisibleSectionId: undefined,
      maxVisibleSectionLabel: undefined,
      pageViewId: undefined,
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
      {
        active_time: 3,
        article_progress: 0,
        client_page_view_id: null,
        dwell_time: 3,
        max_visible_section_id: null,
        max_visible_section_label: null,
        path: '/expired',
        scroll_depth: 10,
        session_id: 'session-2',
      },
    ]);
  });
});
