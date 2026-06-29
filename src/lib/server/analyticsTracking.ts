import type { AnalyticsPayload } from '@/lib/server/analyticsPayload';
import type { ApplicationLinkRow } from '@/lib/server/applicationLinks';

interface RecordAnalyticsPayloadInput {
  country: string;
  db: D1Database;
  payload: AnalyticsPayload;
}

export const recordAnalyticsPayload = async ({
  country,
  db,
  payload,
}: RecordAnalyticsPayloadInput): Promise<void> => {
  if (payload.isInitial) {
    await db
      .prepare(
        `INSERT OR IGNORE INTO user_sessions (id, ip_country, user_agent, referrer, is_admin)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(payload.sessionId, country, payload.userAgent, payload.referrer, 0)
      .run();
  }

  if (payload.applicationSlug) {
    const applicationLink = await db
      .prepare(
        `SELECT id
         FROM application_links
         WHERE slug = ? AND expires_at > datetime('now')
         LIMIT 1`,
      )
      .bind(payload.applicationSlug)
      .first<Pick<ApplicationLinkRow, 'id'>>();

    if (applicationLink) {
      await db
        .prepare(
          `INSERT OR IGNORE INTO application_link_visits (session_id, application_link_id)
           VALUES (?, ?)`,
        )
        .bind(payload.sessionId, applicationLink.id)
        .run();
    }
  }

  if (payload.path) {
    await db
      .prepare(
        `INSERT INTO page_views (session_id, path, dwell_time, scroll_depth)
         VALUES (?, ?, ?, ?)`,
      )
      .bind(payload.sessionId, payload.path, payload.dwellTime, payload.scrollDepth)
      .run();
  }
};
