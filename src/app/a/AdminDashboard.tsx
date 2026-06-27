import { projectCatalog } from '@/lib/content/projects';
import { isAdminWriteEnabledForCurrentRuntime } from '@/lib/server/adminRequest';
import { buildDailyChartRange, buildMonthlyChartRange, getTrafficRangeConfig, summarizeDailyChart } from '@/lib/server/analyticsMetrics';
import { ApplicationLinkStatsRow, toApplicationLinkStats } from '@/lib/server/applicationLinks';
import { getDb } from '@/lib/server/db';

import { DashboardClient } from './DashboardClient';

export async function AdminDashboard({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const writesEnabled = isAdminWriteEnabledForCurrentRuntime();
  const db = getDb();
  if (!db) {
    if (process.env.NODE_ENV === "development") {
      return (
        <DashboardClient
          stats={{ avgDwellTime: 0, avgScrollDepth: 0, totalPageViews: 0, totalSessions: 0 }}
          applicationFilterOptions={[]}
          applicationLinks={[]}
          applicationProjectOptions={[]}
          selectedApplicationLinkId=""
          dailyChart={[]}
          trafficRange={{ bucket: "day", days: 7, label: "최근 7일", value: "7d" }}
          trafficSummary={{ activeDays: 0, quietDays: 0, rangeEnd: "", rangeSessions: 0, rangeStart: "", rangeViews: 0 }}
          topPages={[]}
          topReferrers={[]}
          topCountries={[]}
          initialTab="analytics"
          writesEnabled={writesEnabled}
        />
      );
    }
    return (
      <div style={{ color: 'var(--color-error)', padding: '2rem', textAlign: 'center' }}>
        <p>Database is not bound. If local, run Next.js with Cloudflare bindings.</p>
      </div>
    );
  }

  const APPLICATION_LINK_LIST_LIMIT = 50;

  const applicationProjectOptions = projectCatalog
    .filter((project) => project.section !== 'standalone')
    .map((project) => ({
      id: project.id,
      title: project.content.ko.title,
    }));

  const rangeParam = Array.isArray(searchParams.range) ? searchParams.range[0] : searchParams.range;
  const linkIdParam = Array.isArray(searchParams.linkId) ? searchParams.linkId[0] : searchParams.linkId;

  const trafficRange = getTrafficRangeConfig(rangeParam ?? null);
  const requestedApplicationLinkId = parseInt(linkIdParam ?? '', 10);

  const applicationFilterOptionsResult = await db
    .prepare(
      `SELECT id, slug, label, company_name
       FROM application_links
       WHERE expires_at > datetime('now')
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .bind(APPLICATION_LINK_LIST_LIMIT)
    .all<{ company_name: string; id: number; label: string; slug: string }>();

  const applicationFilterOptions = applicationFilterOptionsResult.results.map((link) => ({
    companyName: link.company_name,
    id: link.id,
    label: link.label,
    slug: link.slug,
  }));

  const selectedApplicationLinkId = Number.isFinite(requestedApplicationLinkId)
    ? (applicationFilterOptions.find((link) => link.id === requestedApplicationLinkId)?.id ?? null)
    : null;

  const hasApplicationFilter = selectedApplicationLinkId !== null;

  const statsQuery = hasApplicationFilter
    ? await db
        .prepare(
          `SELECT
            COUNT(DISTINCT visits.session_id) as totalSessions,
            COUNT(page_views.id) as totalPageViews,
            ROUND(AVG(page_views.dwell_time), 1) as avgDwellTime,
            ROUND(AVG(page_views.scroll_depth), 1) as avgScrollDepth
           FROM application_link_visits visits
           JOIN user_sessions ON user_sessions.id = visits.session_id
           LEFT JOIN page_views ON page_views.session_id = visits.session_id
           WHERE visits.application_link_id = ? AND user_sessions.is_admin = 0`
        )
        .bind(selectedApplicationLinkId)
        .first<{ totalSessions: number; totalPageViews: number; avgDwellTime: number; avgScrollDepth: number }>()
    : await db
        .prepare(
          `SELECT
            COUNT(DISTINCT user_sessions.id) as totalSessions,
            COUNT(page_views.id) as totalPageViews,
            ROUND(AVG(page_views.dwell_time), 1) as avgDwellTime,
            ROUND(AVG(page_views.scroll_depth), 1) as avgScrollDepth
           FROM user_sessions
           LEFT JOIN page_views ON page_views.session_id = user_sessions.id
           WHERE user_sessions.is_admin = 0`
        )
        .first<{ totalSessions: number; totalPageViews: number; avgDwellTime: number; avgScrollDepth: number }>();

  const stats = {
    totalSessions: statsQuery?.totalSessions || 0,
    totalPageViews: statsQuery?.totalPageViews || 0,
    avgDwellTime: statsQuery?.avgDwellTime || 0,
    avgScrollDepth: statsQuery?.avgScrollDepth || 0,
  };

  const today = new Date();
  const dailyChartRange = buildDailyChartRange([], today, trafficRange.days);
  const rangeStart = dailyChartRange[0]?.date ?? '';
  const rangeEnd = dailyChartRange.at(-1)?.date ?? '';
  const chartBucketExpression =
    trafficRange.bucket === 'month'
      ? "strftime('%Y-%m', page_views.created_at)"
      : "strftime('%Y-%m-%d', page_views.created_at)";

  const dailyChartResult = hasApplicationFilter
    ? await db
        .prepare(
          `SELECT
            ${chartBucketExpression} as date,
            COUNT(DISTINCT page_views.session_id) as sessions,
            COUNT(*) as views
           FROM page_views
           JOIN application_link_visits visits ON visits.session_id = page_views.session_id
           JOIN user_sessions ON user_sessions.id = page_views.session_id
           WHERE strftime('%Y-%m-%d', page_views.created_at) BETWEEN ? AND ?
            AND visits.application_link_id = ?
            AND user_sessions.is_admin = 0
           GROUP BY date
           ORDER BY date ASC`
        )
        .bind(rangeStart, rangeEnd, selectedApplicationLinkId)
        .all<{ date: string; sessions: number; views: number }>()
    : await db
        .prepare(
          `SELECT
            ${chartBucketExpression} as date,
            COUNT(DISTINCT page_views.session_id) as sessions,
            COUNT(*) as views
           FROM page_views
           JOIN user_sessions ON user_sessions.id = page_views.session_id
           WHERE strftime('%Y-%m-%d', page_views.created_at) BETWEEN ? AND ?
            AND user_sessions.is_admin = 0
           GROUP BY date
           ORDER BY date ASC`
        )
        .bind(rangeStart, rangeEnd)
        .all<{ date: string; sessions: number; views: number }>();

  const dailyChart =
    trafficRange.bucket === 'month'
      ? buildMonthlyChartRange(dailyChartResult.results, today, 12)
      : buildDailyChartRange(dailyChartResult.results, today, trafficRange.days);
  const trafficSummary = summarizeDailyChart(dailyChart);

  const topPagesResult = hasApplicationFilter
    ? await db
        .prepare(
          `SELECT
            page_views.path,
            COUNT(*) as views,
            ROUND(AVG(page_views.dwell_time), 1) as avgDwell,
            ROUND(AVG(page_views.scroll_depth), 1) as avgScroll
           FROM page_views
           JOIN application_link_visits visits ON visits.session_id = page_views.session_id
           JOIN user_sessions ON user_sessions.id = page_views.session_id
           WHERE visits.application_link_id = ? AND user_sessions.is_admin = 0
           GROUP BY page_views.path
           ORDER BY views DESC
           LIMIT 10`
        )
        .bind(selectedApplicationLinkId)
        .all<{ path: string; views: number; avgDwell: number; avgScroll: number }>()
    : await db
        .prepare(
          `SELECT
            page_views.path,
            COUNT(*) as views,
            ROUND(AVG(page_views.dwell_time), 1) as avgDwell,
            ROUND(AVG(page_views.scroll_depth), 1) as avgScroll
           FROM page_views
           JOIN user_sessions ON user_sessions.id = page_views.session_id
           WHERE user_sessions.is_admin = 0
           GROUP BY page_views.path
           ORDER BY views DESC
           LIMIT 10`
        )
        .all<{ path: string; views: number; avgDwell: number; avgScroll: number }>();

  const topPages = topPagesResult.results;

  const topReferrersResult = hasApplicationFilter
    ? await db
        .prepare(
          `SELECT
            user_sessions.referrer,
            COUNT(*) as count
           FROM user_sessions
           JOIN application_link_visits visits ON visits.session_id = user_sessions.id
           WHERE user_sessions.is_admin = 0 AND visits.application_link_id = ?
           GROUP BY user_sessions.referrer
           ORDER BY count DESC
           LIMIT 5`
        )
        .bind(selectedApplicationLinkId)
        .all<{ referrer: string; count: number }>()
    : await db
        .prepare(
          `SELECT
            referrer,
            COUNT(*) as count
           FROM user_sessions
           WHERE is_admin = 0
           GROUP BY referrer
           ORDER BY count DESC
           LIMIT 5`
        )
        .all<{ referrer: string; count: number }>();

  const topReferrers = topReferrersResult.results;

  const topCountriesResult = hasApplicationFilter
    ? await db
        .prepare(
          `SELECT
            user_sessions.ip_country as country,
            COUNT(*) as count
           FROM user_sessions
           JOIN application_link_visits visits ON visits.session_id = user_sessions.id
           WHERE user_sessions.is_admin = 0 AND visits.application_link_id = ?
           GROUP BY country
           ORDER BY count DESC
           LIMIT 5`
        )
        .bind(selectedApplicationLinkId)
        .all<{ country: string; count: number }>()
    : await db
        .prepare(
          `SELECT
            ip_country as country,
            COUNT(*) as count
           FROM user_sessions
           WHERE is_admin = 0
           GROUP BY country
           ORDER BY count DESC
           LIMIT 5`
        )
        .all<{ country: string; count: number }>();

  const topCountries = topCountriesResult.results;

  const applicationLinksResult = await db
    .prepare(
      `SELECT
        links.id,
        links.slug,
        links.label,
        links.company_name,
        links.role,
        links.summary_preset,
        links.project_ids,
        links.expires_at,
        links.created_at,
        COUNT(DISTINCT visits.session_id) as sessions,
        COUNT(page_views.id) as views,
        ROUND(AVG(page_views.dwell_time), 1) as avg_dwell_time,
        ROUND(AVG(page_views.scroll_depth), 1) as avg_scroll_depth,
        MAX(page_views.created_at) as last_seen_at
       FROM application_links links
       LEFT JOIN application_link_visits visits ON visits.application_link_id = links.id
       LEFT JOIN page_views ON page_views.session_id = visits.session_id
       WHERE links.expires_at > datetime('now')
       GROUP BY links.id
       ORDER BY links.created_at DESC
       LIMIT ?`
    )
    .bind(APPLICATION_LINK_LIST_LIMIT)
    .all<ApplicationLinkStatsRow>();

  const applicationLinks = applicationLinksResult.results.map(toApplicationLinkStats);

  const initialTab = (searchParams.tab === 'links') ? 'links' : 'analytics';

  return (
    <DashboardClient
      stats={stats}
      applicationFilterOptions={applicationFilterOptions}
      applicationLinks={applicationLinks}
      applicationProjectOptions={applicationProjectOptions}
      selectedApplicationLinkId={selectedApplicationLinkId?.toString() ?? ''}
      dailyChart={dailyChart}
      trafficRange={trafficRange}
      trafficSummary={trafficSummary}
      topPages={topPages}
      topReferrers={topReferrers}
      topCountries={topCountries}
      initialTab={initialTab}
      writesEnabled={writesEnabled}
    />
  );
}
