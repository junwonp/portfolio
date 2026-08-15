import {
  buildDailyChartRange,
  buildMonthlyChartRange,
  type DailyChartPoint,
  getTrafficRangeConfig,
  summarizeDailyChart,
  type TrafficRangeConfig,
  type TrafficSummary,
} from '@/lib/server/analytics/metrics';
import { ensureAnalyticsStorageSchema } from '@/lib/server/analytics/schema';
import {
  type ApplicationLinkStats,
  type ApplicationLinkStatsRow,
  toApplicationLinkStats,
} from '@/lib/server/application-links/model';

export type AdminDashboardSearchParams = {
  [key: string]: string | string[] | undefined;
};

export interface ApplicationProjectOption {
  id: string;
  title: string;
}

export interface ApplicationFilterOption {
  companyName: string;
  id: number;
  label: string;
  slug: string;
}

export interface SessionRow {
  createdAt: string;
  id: string;
  ipAddress: string;
  ipCountry: string;
  pageViewsCount: number;
  referrer: string;
  userAgent: string;
  classification: 'bot' | 'suspected' | 'human';
  applicationLinkSlug: string | null;
  applicationLinkLabel: string | null;
}

export interface RecentInteraction {
  id: number;
  sessionId: string;
  path: string;
  interactionType: string;
  interactionLabel: string;
  action: 'open' | 'close';
  createdAt: string;
}

export interface SessionDetail {
  interactions: RecentInteraction[];
  pageViews: {
    activeTime: number;
    articleProgress: number;
    createdAt: string;
    dwellTime: number;
    path: string;
    previousPath: string | null;
    scrollDepth: number;
    sectionLabel: string | null;
  }[];
}

export interface GetSessionsParams {
  classification?: 'bot' | 'suspected' | 'human';
  timeRange?: '7d' | '30d' | 'all';
  linkId?: number;
  limit: number;
  offset: number;
}

export interface AdminDashboardData {
  applicationFilterOptions: ApplicationFilterOption[];
  applicationLinks: ApplicationLinkStats[];
  applicationProjectOptions: ApplicationProjectOption[];
  dailyChart: DailyChartPoint[];
  initialTab: 'analytics' | 'links';
  selectedApplicationLinkId: string;
  stats: {
    avgActiveTime: number;
    avgArticleProgress: number;
    avgDwellTime: number;
    avgScrollDepth: number;
    totalPageViews: number;
    totalSessions: number;
  };
  topCountries: { country: string; count: number }[];
  topPages: {
    avgActive: number;
    avgArticleProgress: number;
    avgDwell: number;
    avgScroll: number;
    path: string;
    views: number;
  }[];
  topReferrers: { count: number; referrer: string }[];
  trafficRange: TrafficRangeConfig;
  trafficSummary: TrafficSummary;
  webVitals: {
    avgValue: number;
    good: number;
    metricName: string;
    needsImprovement: number;
    poor: number;
    samples: number;
  }[];
  sessions: SessionRow[];
  totalSessionCount: number;
  sessionDetails: Record<string, SessionDetail>;
  sessionFilters: GetSessionsParams;
  writesDisabledReason: string | null;
  writesEnabled: boolean;
}

interface GetAdminDashboardDataInput {
  applicationProjectOptions: ApplicationProjectOption[];
  db: D1Database | undefined;
  searchParams: AdminDashboardSearchParams;
  today?: Date;
  writesEnabled: boolean;
}

interface AdminDashboardQueryContext {
  db: D1Database;
  hasApplicationFilter: boolean;
  rangeEnd: string;
  rangeStart: string;
  selectedApplicationLinkId: number | null;
  trafficRange: TrafficRangeConfig;
  today: Date;
}

const APPLICATION_LINK_LIST_LIMIT = 50;
const ADMIN_DASHBOARD_TABLES = [
  'application_links',
  'application_link_visits',
  'page_views',
  'user_sessions',
  'web_vitals',
] as const;
const MISSING_SCHEMA_WRITES_DISABLED_REASON =
  'D1 analytics schema가 아직 준비되지 않아 링크 생성과 삭제가 비활성화됩니다.';
const MISSING_DB_WRITES_DISABLED_REASON =
  'Cloudflare D1 binding을 찾지 못해 링크 생성과 삭제가 비활성화됩니다.';
const RUNTIME_WRITES_DISABLED_REASON =
  'develop 환경에서는 production D1/R2 공유를 막기 위해 링크 생성과 삭제가 비활성화됩니다.';

export const isMissingAdminDashboardSchemaError = (error: unknown): boolean =>
  error instanceof Error &&
  ADMIN_DASHBOARD_TABLES.some((table) => error.message.includes(`no such table: ${table}`));

const getFirstSearchParam = (
  searchParams: AdminDashboardSearchParams,
  key: string,
): string | undefined => {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const getInitialTab = (searchParams: AdminDashboardSearchParams): 'analytics' | 'links' =>
  searchParams.tab === 'links' ? 'links' : 'analytics';

const createEmptyAdminDashboardData = ({
  applicationProjectOptions,
  searchParams,
  today = new Date(),
  writesDisabledReason,
  writesEnabled,
}: Omit<GetAdminDashboardDataInput, 'db'> & {
  writesDisabledReason: string | null;
}): AdminDashboardData => {
  const trafficRange = getTrafficRangeConfig(getFirstSearchParam(searchParams, 'range') ?? null);
  const dailyChart =
    trafficRange.bucket === 'month'
      ? buildMonthlyChartRange([], today, 12)
      : buildDailyChartRange([], today, trafficRange.days);

  return {
    applicationFilterOptions: [],
    applicationLinks: [],
    applicationProjectOptions,
    dailyChart,
    initialTab: getInitialTab(searchParams),
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
    trafficRange,
    trafficSummary: summarizeDailyChart(dailyChart),
    webVitals: [],
    sessions: [],
    totalSessionCount: 0,
    sessionDetails: {},
    sessionFilters: { limit: 50, offset: 0 },
    writesDisabledReason,
    writesEnabled,
  };
};

const getApplicationFilterOptions = async (db: D1Database): Promise<ApplicationFilterOption[]> => {
  const result = await db
    .prepare(
      `SELECT id, slug, label, company_name
       FROM application_links
       WHERE expires_at > datetime('now') AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .bind(APPLICATION_LINK_LIST_LIMIT)
    .all<{ company_name: string; id: number; label: string; slug: string }>();

  return result.results.map((link) => ({
    companyName: link.company_name,
    id: link.id,
    label: link.label,
    slug: link.slug,
  }));
};

const getSelectedApplicationLinkId = (
  applicationFilterOptions: ApplicationFilterOption[],
  searchParams: AdminDashboardSearchParams,
): number | null => {
  const linkIdParam = getFirstSearchParam(searchParams, 'linkId');
  const requestedApplicationLinkId = parseInt(linkIdParam ?? '', 10);

  if (!Number.isFinite(requestedApplicationLinkId)) {
    return null;
  }

  return (
    applicationFilterOptions.find((link) => link.id === requestedApplicationLinkId)?.id ?? null
  );
};

const getStats = async ({
  db,
  hasApplicationFilter,
  selectedApplicationLinkId,
}: AdminDashboardQueryContext): Promise<AdminDashboardData['stats']> => {
  const statsQuery = hasApplicationFilter
    ? await db
        .prepare(
          `SELECT
            COUNT(DISTINCT visits.session_id) as totalSessions,
            COUNT(page_views.id) as totalPageViews,
            ROUND(AVG(page_views.dwell_time), 1) as avgDwellTime,
            ROUND(AVG(page_views.scroll_depth), 1) as avgScrollDepth,
            ROUND(AVG(COALESCE(page_views.active_time, page_views.dwell_time, 0)), 1) as avgActiveTime,
            ROUND(AVG(COALESCE(page_views.article_progress, 0)), 1) as avgArticleProgress
           FROM application_link_visits visits
           JOIN user_sessions ON user_sessions.id = visits.session_id
           LEFT JOIN page_views ON page_views.session_id = visits.session_id
           WHERE visits.application_link_id = ? AND user_sessions.is_admin = 0`,
        )
        .bind(selectedApplicationLinkId)
        .first<AdminDashboardData['stats']>()
    : await db
        .prepare(
          `SELECT
            COUNT(DISTINCT user_sessions.id) as totalSessions,
            COUNT(page_views.id) as totalPageViews,
            ROUND(AVG(page_views.dwell_time), 1) as avgDwellTime,
            ROUND(AVG(page_views.scroll_depth), 1) as avgScrollDepth,
            ROUND(AVG(COALESCE(page_views.active_time, page_views.dwell_time, 0)), 1) as avgActiveTime,
            ROUND(AVG(COALESCE(page_views.article_progress, 0)), 1) as avgArticleProgress
           FROM user_sessions
           LEFT JOIN page_views ON page_views.session_id = user_sessions.id
           WHERE user_sessions.is_admin = 0`,
        )
        .first<AdminDashboardData['stats']>();

  return {
    avgActiveTime: statsQuery?.avgActiveTime || 0,
    avgArticleProgress: statsQuery?.avgArticleProgress || 0,
    avgDwellTime: statsQuery?.avgDwellTime || 0,
    avgScrollDepth: statsQuery?.avgScrollDepth || 0,
    totalPageViews: statsQuery?.totalPageViews || 0,
    totalSessions: statsQuery?.totalSessions || 0,
  };
};

const getDailyChart = async ({
  db,
  hasApplicationFilter,
  rangeEnd,
  rangeStart,
  selectedApplicationLinkId,
  today,
  trafficRange,
}: AdminDashboardQueryContext): Promise<DailyChartPoint[]> => {
  const chartBucketExpression =
    trafficRange.bucket === 'month'
      ? "strftime('%Y-%m', page_views.created_at)"
      : "strftime('%Y-%m-%d', page_views.created_at)";
  const result = hasApplicationFilter
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
           ORDER BY date ASC`,
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
           ORDER BY date ASC`,
        )
        .bind(rangeStart, rangeEnd)
        .all<{ date: string; sessions: number; views: number }>();

  return trafficRange.bucket === 'month'
    ? buildMonthlyChartRange(result.results, today, 12)
    : buildDailyChartRange(result.results, today, trafficRange.days);
};

const getTopPages = async ({
  db,
  hasApplicationFilter,
  selectedApplicationLinkId,
}: AdminDashboardQueryContext): Promise<AdminDashboardData['topPages']> => {
  const result = hasApplicationFilter
    ? await db
        .prepare(
          `SELECT
            page_views.path,
            COUNT(*) as views,
            ROUND(AVG(page_views.dwell_time), 1) as avgDwell,
            ROUND(AVG(page_views.scroll_depth), 1) as avgScroll,
            ROUND(AVG(COALESCE(page_views.active_time, page_views.dwell_time, 0)), 1) as avgActive,
            ROUND(AVG(COALESCE(page_views.article_progress, 0)), 1) as avgArticleProgress
           FROM page_views
           JOIN application_link_visits visits ON visits.session_id = page_views.session_id
           JOIN user_sessions ON user_sessions.id = page_views.session_id
           WHERE visits.application_link_id = ? AND user_sessions.is_admin = 0
           GROUP BY page_views.path
           ORDER BY views DESC
          LIMIT 10`,
        )
        .bind(selectedApplicationLinkId)
        .all<{
          avgActive: number;
          avgArticleProgress: number;
          avgDwell: number;
          avgScroll: number;
          path: string;
          views: number;
        }>()
    : await db
        .prepare(
          `SELECT
            page_views.path,
            COUNT(*) as views,
            ROUND(AVG(page_views.dwell_time), 1) as avgDwell,
            ROUND(AVG(page_views.scroll_depth), 1) as avgScroll,
            ROUND(AVG(COALESCE(page_views.active_time, page_views.dwell_time, 0)), 1) as avgActive,
            ROUND(AVG(COALESCE(page_views.article_progress, 0)), 1) as avgArticleProgress
           FROM page_views
           JOIN user_sessions ON user_sessions.id = page_views.session_id
           WHERE user_sessions.is_admin = 0
           GROUP BY page_views.path
          ORDER BY views DESC
          LIMIT 10`,
        )
        .all<{
          avgActive: number;
          avgArticleProgress: number;
          avgDwell: number;
          avgScroll: number;
          path: string;
          views: number;
        }>();

  return result.results;
};

const getWebVitals = async ({
  db,
  hasApplicationFilter,
  rangeEnd,
  rangeStart,
  selectedApplicationLinkId,
}: AdminDashboardQueryContext): Promise<AdminDashboardData['webVitals']> => {
  const result = hasApplicationFilter
    ? await db
        .prepare(
          `SELECT
            web_vitals.metric_name as metricName,
            COUNT(*) as samples,
            ROUND(AVG(web_vitals.value), 1) as avgValue,
            SUM(CASE WHEN web_vitals.rating = 'good' THEN 1 ELSE 0 END) as good,
            SUM(CASE WHEN web_vitals.rating = 'needs-improvement' THEN 1 ELSE 0 END) as needsImprovement,
            SUM(CASE WHEN web_vitals.rating = 'poor' THEN 1 ELSE 0 END) as poor
           FROM web_vitals
           JOIN user_sessions ON user_sessions.id = web_vitals.session_id
           JOIN application_link_visits visits ON visits.session_id = web_vitals.session_id
           WHERE strftime('%Y-%m-%d', web_vitals.created_at) BETWEEN ? AND ?
            AND visits.application_link_id = ?
            AND user_sessions.is_admin = 0
           GROUP BY web_vitals.metric_name
           ORDER BY samples DESC
           LIMIT 6`,
        )
        .bind(rangeStart, rangeEnd, selectedApplicationLinkId)
        .all<AdminDashboardData['webVitals'][number]>()
    : await db
        .prepare(
          `SELECT
            web_vitals.metric_name as metricName,
            COUNT(*) as samples,
            ROUND(AVG(web_vitals.value), 1) as avgValue,
            SUM(CASE WHEN web_vitals.rating = 'good' THEN 1 ELSE 0 END) as good,
            SUM(CASE WHEN web_vitals.rating = 'needs-improvement' THEN 1 ELSE 0 END) as needsImprovement,
            SUM(CASE WHEN web_vitals.rating = 'poor' THEN 1 ELSE 0 END) as poor
           FROM web_vitals
           JOIN user_sessions ON user_sessions.id = web_vitals.session_id
           WHERE strftime('%Y-%m-%d', web_vitals.created_at) BETWEEN ? AND ?
            AND user_sessions.is_admin = 0
           GROUP BY web_vitals.metric_name
           ORDER BY samples DESC
           LIMIT 6`,
        )
        .bind(rangeStart, rangeEnd)
        .all<AdminDashboardData['webVitals'][number]>();

  return result.results;
};

const getTopReferrers = async ({
  db,
  hasApplicationFilter,
  selectedApplicationLinkId,
}: AdminDashboardQueryContext): Promise<AdminDashboardData['topReferrers']> => {
  const result = hasApplicationFilter
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
           LIMIT 5`,
        )
        .bind(selectedApplicationLinkId)
        .all<{ count: number; referrer: string }>()
    : await db
        .prepare(
          `SELECT
            referrer,
            COUNT(*) as count
           FROM user_sessions
           WHERE is_admin = 0
           GROUP BY referrer
           ORDER BY count DESC
           LIMIT 5`,
        )
        .all<{ count: number; referrer: string }>();

  return result.results;
};

const getTopCountries = async ({
  db,
  hasApplicationFilter,
  selectedApplicationLinkId,
}: AdminDashboardQueryContext): Promise<AdminDashboardData['topCountries']> => {
  const result = hasApplicationFilter
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
           LIMIT 5`,
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
           LIMIT 5`,
        )
        .all<{ country: string; count: number }>();

  return result.results;
};

const getApplicationLinks = async (db: D1Database): Promise<ApplicationLinkStats[]> => {
  const result = await db
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
        ROUND(AVG(COALESCE(page_views.active_time, page_views.dwell_time, 0)), 1) as avg_active_time,
        ROUND(AVG(COALESCE(page_views.article_progress, 0)), 1) as avg_article_progress,
        MAX(page_views.created_at) as last_seen_at,
        COALESCE(interactions.interaction_count, 0) as interaction_count,
        interactions.interaction_labels
       FROM application_links links
       LEFT JOIN application_link_visits visits ON visits.application_link_id = links.id
       LEFT JOIN page_views ON page_views.session_id = visits.session_id
       LEFT JOIN (
         SELECT
           alv.application_link_id,
           COUNT(ai.id) as interaction_count,
           GROUP_CONCAT(DISTINCT ai.interaction_label) as interaction_labels
         FROM application_link_visits alv
         JOIN analytics_interactions ai ON ai.session_id = alv.session_id
         GROUP BY alv.application_link_id
       ) interactions ON interactions.application_link_id = links.id
       WHERE links.expires_at > datetime('now') AND links.deleted_at IS NULL
       GROUP BY links.id
       ORDER BY links.created_at DESC
       LIMIT ?`,
    )
    .bind(APPLICATION_LINK_LIST_LIMIT)
    .all<ApplicationLinkStatsRow>();

  return result.results.map(toApplicationLinkStats);
};

const classifySession = (
  ua: string,
  totalDwell: number,
  totalScroll: number,
  views: number,
): 'bot' | 'suspected' | 'human' => {
  const lowercaseUa = ua.toLowerCase();

  const botKeywords = [
    'bot',
    'spider',
    'crawler',
    'python-requests',
    'go-http-client',
    'curl',
    'wget',
    'http-client',
    'zgrab',
    'censys',
    'masscan',
    'headlesschrome',
    'http_request',
    'axios',
    'node-fetch',
    'fetch',
    'java/',
    'scrip',
  ];

  if (!ua || ua === 'unknown' || ua.trim() === '') {
    return 'bot';
  }

  if (botKeywords.some((keyword) => lowercaseUa.includes(keyword))) {
    return 'bot';
  }

  if (views === 1 && totalDwell === 0 && totalScroll === 0) {
    return 'suspected';
  }

  return 'human';
};

const getSessions = async (
  db: D1Database,
  params: GetSessionsParams,
): Promise<{ sessions: SessionRow[]; total: number }> => {
  const conditions: string[] = ['s.is_admin = 0'];
  const binds: unknown[] = [];

  // Time range filter
  if (params.timeRange && params.timeRange !== 'all') {
    const days = params.timeRange === '7d' ? 7 : 30;
    conditions.push(`s.created_at >= datetime('now', '-${days} days')`);
  }

  // Application link filter
  let linkJoin = '';
  if (params.linkId) {
    linkJoin = 'JOIN application_link_visits alv ON alv.session_id = s.id';
    conditions.push('alv.application_link_id = ?');
    binds.push(params.linkId);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Run the listing and the total count together — the two queries are
  // independent, so awaiting them in parallel avoids a second round trip
  const listStmt = db.prepare(`SELECT
        s.id,
        COALESCE(s.ip_address, 'unknown') as ipAddress,
        s.ip_country as ipCountry,
        s.user_agent as userAgent,
        s.referrer,
        s.created_at as createdAt,
        COUNT(p.id) as pageViewsCount,
        SUM(COALESCE(p.dwell_time, 0)) as totalDwellTime,
        SUM(COALESCE(p.scroll_depth, 0)) as totalScrollDepth,
        al.slug as applicationLinkSlug,
        al.label as applicationLinkLabel
       FROM user_sessions s
       LEFT JOIN page_views p ON p.session_id = s.id
       LEFT JOIN application_link_visits alv_link ON alv_link.session_id = s.id
       LEFT JOIN application_links al ON al.id = alv_link.application_link_id AND al.deleted_at IS NULL
       ${linkJoin}
       ${whereClause}
       GROUP BY s.id, s.ip_address, s.ip_country, s.user_agent, s.referrer, s.created_at
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`).bind(...binds, params.limit, params.offset);
  const countStmt = db.prepare(`SELECT COUNT(*) as total
       FROM user_sessions s
       ${linkJoin}
       ${whereClause}`).bind(...binds);

  const [result, countResult] = await Promise.all([
    listStmt.all<{
      createdAt: string;
      id: string;
      ipAddress: string;
      ipCountry: string;
      pageViewsCount: number;
      referrer: string;
      userAgent: string;
      totalDwellTime: number;
      totalScrollDepth: number;
      applicationLinkSlug: string | null;
      applicationLinkLabel: string | null;
    }>(),
    countStmt.first<{ total: number }>(),
  ]);

  const sessions = result.results.map((row) => {
    const classification = classifySession(
      row.userAgent,
      row.totalDwellTime,
      row.totalScrollDepth,
      row.pageViewsCount,
    );

    // Filter by classification in JS
    return {
      id: row.id,
      ipAddress: row.ipAddress,
      ipCountry: row.ipCountry,
      userAgent: row.userAgent,
      referrer: row.referrer,
      createdAt: row.createdAt,
      pageViewsCount: row.pageViewsCount,
      applicationLinkSlug: row.applicationLinkSlug,
      applicationLinkLabel: row.applicationLinkLabel,
      classification,
    };
  });

  // Apply classification filter in JS (since classification is computed, not stored)
  const filtered = params.classification
    ? sessions.filter((s) => s.classification === params.classification)
    : sessions;

  // Recompute total after classification filter
  let total = countResult?.total ?? filtered.length;
  if (params.classification) {
    // Fetch all without limit to count by classification
    const allResult = await db
      .prepare(
        `SELECT
          s.user_agent as userAgent,
          COUNT(p.id) as pageViewsCount,
          SUM(COALESCE(p.dwell_time, 0)) as totalDwellTime,
          SUM(COALESCE(p.scroll_depth, 0)) as totalScrollDepth
         FROM user_sessions s
         LEFT JOIN page_views p ON p.session_id = s.id
         ${linkJoin}
         ${whereClause}
         GROUP BY s.id`,
      )
      .bind(...binds)
      .all<{
        userAgent: string;
        pageViewsCount: number;
        totalDwellTime: number;
        totalScrollDepth: number;
      }>();

    total = allResult.results.filter(
      (row) =>
        classifySession(row.userAgent, row.totalDwellTime, row.totalScrollDepth, row.pageViewsCount) ===
        params.classification,
    ).length;
  }

  return { sessions: filtered, total };
};

const getSessionDetails = async (
  db: D1Database,
  sessions: SessionRow[],
): Promise<Record<string, SessionDetail>> => {
  if (sessions.length === 0) return {};

  const sessionIds = sessions.map((s) => s.id);
  const placeholders = sessionIds.map(() => '?').join(',');
  const detailMap: Record<string, SessionDetail> = {};

  for (const id of sessionIds) {
    detailMap[id] = { pageViews: [], interactions: [] };
  }

  // Fetch page views for sessions
  const pageViewResult = await db
    .prepare(
      `SELECT
        session_id as sessionId,
        path,
        dwell_time as dwellTime,
        scroll_depth as scrollDepth,
        article_progress as articleProgress,
        COALESCE(active_time, dwell_time, 0) as activeTime,
        max_visible_section_label as sectionLabel,
        previous_path as previousPath,
        created_at as createdAt
       FROM page_views
       WHERE session_id IN (${placeholders})
       ORDER BY created_at ASC`,
    )
    .bind(...sessionIds)
    .all<{
      sessionId: string;
      path: string;
      dwellTime: number;
      scrollDepth: number;
      articleProgress: number;
      activeTime: number;
      sectionLabel: string | null;
      previousPath: string | null;
      createdAt: string;
    }>();

  for (const row of pageViewResult.results) {
    detailMap[row.sessionId]?.pageViews.push(row);
  }

  // Fetch interactions for sessions directly
  const interactionResult = await db
    .prepare(
      `SELECT
        id,
        session_id as sessionId,
        path,
        interaction_type as interactionType,
        interaction_label as interactionLabel,
        action,
        created_at as createdAt
       FROM analytics_interactions
       WHERE session_id IN (${placeholders})
       ORDER BY created_at ASC`,
    )
    .bind(...sessionIds)
    .all<{
      id: number;
      sessionId: string;
      path: string;
      interactionType: string;
      interactionLabel: string;
      action: 'open' | 'close';
      createdAt: string;
    }>();

  for (const row of interactionResult.results) {
    detailMap[row.sessionId]?.interactions.push(row);
  }

  return detailMap;
};

export const getAdminDashboardData = async ({
  applicationProjectOptions,
  db,
  searchParams,
  today = new Date(),
  writesEnabled,
}: GetAdminDashboardDataInput): Promise<AdminDashboardData> => {
  const getEmptyData = (writesDisabledReason: string) =>
    createEmptyAdminDashboardData({
      applicationProjectOptions,
      searchParams,
      today,
      writesDisabledReason,
      writesEnabled: false,
    });

  if (!db) {
    return getEmptyData(MISSING_DB_WRITES_DISABLED_REASON);
  }

  try {
    await ensureAnalyticsStorageSchema(db);
    const applicationFilterOptions = await getApplicationFilterOptions(db);
    const selectedApplicationLinkId = getSelectedApplicationLinkId(
      applicationFilterOptions,
      searchParams,
    );
    const hasApplicationFilter = selectedApplicationLinkId !== null;
    const trafficRange = getTrafficRangeConfig(getFirstSearchParam(searchParams, 'range') ?? null);
    const rangeReference = buildDailyChartRange([], today, trafficRange.days);
    const context: AdminDashboardQueryContext = {
      db,
      hasApplicationFilter,
      rangeEnd: rangeReference.at(-1)?.date ?? '',
      rangeStart: rangeReference[0]?.date ?? '',
      selectedApplicationLinkId,
      today,
      trafficRange,
    };
    // Parse session filter params from URL
    const sessionFilters: GetSessionsParams = {
      classification: (getFirstSearchParam(searchParams, 'classification') as GetSessionsParams['classification']) ?? undefined,
      timeRange: (getFirstSearchParam(searchParams, 'timeRange') as GetSessionsParams['timeRange']) ?? undefined,
      limit: 50,
      offset: 0,
    };

    const [stats, dailyChart, topPages, topReferrers, topCountries, applicationLinks, webVitals, sessionsResult] =
      await Promise.all([
        getStats(context),
        getDailyChart(context),
        getTopPages(context),
        getTopReferrers(context),
        getTopCountries(context),
        getApplicationLinks(db),
        getWebVitals(context),
        getSessions(db, sessionFilters),
      ]);

    const sessionDetails = await getSessionDetails(db, sessionsResult.sessions);

    return {
      applicationFilterOptions,
      applicationLinks,
      applicationProjectOptions,
      dailyChart,
      initialTab: getInitialTab(searchParams),
      selectedApplicationLinkId: selectedApplicationLinkId?.toString() ?? '',
      stats,
      topCountries,
      topPages,
      topReferrers,
      trafficRange,
      trafficSummary: summarizeDailyChart(dailyChart),
      webVitals,
      sessions: sessionsResult.sessions,
      totalSessionCount: sessionsResult.total,
      sessionDetails,
      sessionFilters,
      writesDisabledReason: writesEnabled ? null : RUNTIME_WRITES_DISABLED_REASON,
      writesEnabled,
    };
  } catch (error) {
    if (isMissingAdminDashboardSchemaError(error)) {
      return getEmptyData(MISSING_SCHEMA_WRITES_DISABLED_REASON);
    }

    throw error;
  }
};
