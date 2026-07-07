import type { AnalyticsPayloadBody } from '@/lib/server/analyticsPayload';
import { ensureAnalyticsStorageSchema } from '@/lib/server/analyticsSchema';
import type { ApplicationLinkRow } from '@/lib/server/applicationLinks';

interface RecordAnalyticsPayloadInput {
  country: string;
  ipAddress: string;
  db: D1Database;
  payload: AnalyticsPayloadBody;
}

const bindNullableText = (value: string | undefined): string | null => value ?? null;

export const recordAnalyticsPayload = async ({
  country,
  ipAddress,
  db,
  payload,
}: RecordAnalyticsPayloadInput): Promise<void> => {
  await ensureAnalyticsStorageSchema(db);

  await db
    .prepare(
      `INSERT OR IGNORE INTO user_sessions (id, ip_address, ip_country, user_agent, referrer, is_admin)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(payload.sessionId, ipAddress, country, payload.userAgent, payload.referrer, 0)
    .run();

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

  if (payload.eventType === 'web-vital') {
    await db
      .prepare(
        `INSERT INTO web_vitals (
          session_id,
          path,
          metric_id,
          metric_name,
          value,
          delta,
          rating,
          navigation_type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        payload.sessionId,
        payload.path ?? '/',
        payload.metricId,
        payload.metricName,
        payload.metricValue,
        payload.metricDelta,
        payload.metricRating,
        payload.navigationType,
      )
      .run();
    return;
  }

  if (payload.path) {
    await db
      .prepare(
        `INSERT INTO page_views (
          client_page_view_id,
          session_id,
          path,
          dwell_time,
          scroll_depth,
          active_time,
          article_progress,
          max_visible_section_id,
          max_visible_section_label,
          last_seen_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(client_page_view_id) DO UPDATE SET
          dwell_time = MAX(COALESCE(page_views.dwell_time, 0), excluded.dwell_time),
          scroll_depth = MAX(COALESCE(page_views.scroll_depth, 0), excluded.scroll_depth),
          active_time = MAX(COALESCE(page_views.active_time, 0), excluded.active_time),
          article_progress = MAX(COALESCE(page_views.article_progress, 0), excluded.article_progress),
          max_visible_section_id = CASE
            WHEN excluded.article_progress >= COALESCE(page_views.article_progress, 0)
            THEN COALESCE(excluded.max_visible_section_id, page_views.max_visible_section_id)
            ELSE page_views.max_visible_section_id
          END,
          max_visible_section_label = CASE
            WHEN excluded.article_progress >= COALESCE(page_views.article_progress, 0)
            THEN COALESCE(excluded.max_visible_section_label, page_views.max_visible_section_label)
            ELSE page_views.max_visible_section_label
          END,
          last_seen_at = CURRENT_TIMESTAMP`,
      )
      .bind(
        bindNullableText(payload.pageViewId),
        payload.sessionId,
        payload.path,
        payload.dwellTime,
        payload.scrollDepth,
        payload.activeTime,
        payload.articleProgress,
        bindNullableText(payload.maxVisibleSectionId),
        bindNullableText(payload.maxVisibleSectionLabel),
      )
      .run();
  }
};
