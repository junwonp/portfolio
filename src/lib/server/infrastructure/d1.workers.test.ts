import { env } from 'cloudflare:workers';
import { describe, expect, it } from 'vitest';
import type { AnalyticsPayloadBody } from '@/lib/server/analytics/payload';
import { recordAnalyticsPayload } from '@/lib/server/analytics/tracking';
import schemaSql from '../../../../schema.sql?raw';

const db = env.portfolio_db;

// D1 `exec()` rejects a batch whose lines are not complete statements, and
// `schema.sql` documents itself with `--` comments, so strip comments and split
// on `;` to assert every statement is independently valid. Comments carry no
// DDL, the tested schema is still the deployed file verbatim.
const toStatements = (sql: string): string[] =>
  sql
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join('\n')
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

const applySchema = async (): Promise<void> => {
  await db.batch(toStatements(schemaSql).map((statement) => db.prepare(statement)));
};

const CHROME_DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/120.0.0.0 Safari/537.36';

const record = (payload: AnalyticsPayloadBody) =>
  recordAnalyticsPayload({
    acceptLanguage: 'en-US,en;q=0.9',
    city: 'Seoul',
    colo: 'ICN',
    country: 'KR',
    db,
    payload,
    regionCode: '11',
    timezone: 'Asia/Seoul',
    userAgentHeader: CHROME_DESKTOP_UA,
  });

const MINIFLARE_INTERNAL_TABLE_PREFIX = '_cf_';

const EXPECTED_TABLES = [
  'analytics_interactions',
  'application_link_visits',
  'application_links',
  'page_views',
  'revalidations',
  'tags',
  'user_sessions',
  'web_vitals',
];

interface SessionRow {
  browser: string;
  city: string;
  deviceType: string;
  ipCountry: string;
  isBot: number;
  os: string;
}

interface PageViewRow {
  activeTime: number;
  articleProgress: number;
  dwellTime: number;
  maxVisibleSectionId: string | null;
  scrollDepth: number;
}

const readSession = (sessionId: string) =>
  db
    .prepare(
      `SELECT ip_country AS ipCountry, city, browser, os, device_type AS deviceType, is_bot AS isBot
       FROM user_sessions
       WHERE id = ?`,
    )
    .bind(sessionId)
    .first<SessionRow>();

const readPageView = (pageViewId: string) =>
  db
    .prepare(
      `SELECT dwell_time AS dwellTime, scroll_depth AS scrollDepth, active_time AS activeTime,
              article_progress AS articleProgress, max_visible_section_id AS maxVisibleSectionId
       FROM page_views
       WHERE client_page_view_id = ?`,
    )
    .bind(pageViewId)
    .first<PageViewRow>();

describe('real D1 storage', () => {
  it('applies the repository schema.sql and round-trips a row', async () => {
    await applySchema();

    const tables = await db
      .prepare(
        `SELECT name FROM sqlite_master
         WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
         ORDER BY name`,
      )
      .all<{ name: string }>();

    const tableNames = tables.results
      .map((row) => row.name)
      .filter((name) => !name.startsWith(MINIFLARE_INTERNAL_TABLE_PREFIX));

    expect(tableNames).toEqual(EXPECTED_TABLES);

    await db
      .prepare(
        'INSERT INTO application_links (slug, label, company_name, expires_at) VALUES (?, ?, ?, ?)',
      )
      .bind('acme-demo', 'Acme application', 'Acme Corp', '2099-01-01 00:00:00')
      .run();

    const row = await db
      .prepare(
        `SELECT slug, label, company_name AS companyName, expires_at AS expiresAt
         FROM application_links
         WHERE slug = ?`,
      )
      .bind('acme-demo')
      .first<{ companyName: string; expiresAt: string; label: string; slug: string }>();

    expect(row).toEqual({
      companyName: 'Acme Corp',
      expiresAt: '2099-01-01 00:00:00',
      label: 'Acme application',
      slug: 'acme-demo',
    });
  });

  it('persists a session and a page view through the production SQL', async () => {
    await applySchema();

    await record({
      activeTime: 12,
      articleProgress: 35,
      dwellTime: 42,
      eventType: 'page',
      isInitial: true,
      maxVisibleSectionId: 'overview',
      maxVisibleSectionLabel: 'Overview',
      pageViewId: 'page-view-1',
      path: '/projects/portfolio',
      referrer: 'direct',
      scrollDepth: 80,
      sessionId: 'session-1',
    });

    await expect(readSession('session-1')).resolves.toEqual({
      browser: 'Chrome',
      city: 'Seoul',
      deviceType: 'desktop',
      ipCountry: 'KR',
      isBot: 0,
      os: 'Windows',
    });

    await expect(readPageView('page-view-1')).resolves.toEqual({
      activeTime: 12,
      articleProgress: 35,
      dwellTime: 42,
      maxVisibleSectionId: 'overview',
      scrollDepth: 80,
    });
  });

  it('merges repeated page-view beacons with the upsert MAX semantics', async () => {
    await applySchema();

    const base = {
      eventType: 'page',
      isInitial: true,
      path: '/projects/portfolio',
      referrer: 'direct',
      sessionId: 'session-2',
    } as const;

    await record({
      ...base,
      activeTime: 30,
      articleProgress: 60,
      dwellTime: 90,
      maxVisibleSectionId: 'details',
      maxVisibleSectionLabel: 'Details',
      pageViewId: 'page-view-2',
      scrollDepth: 55,
    });

    await record({
      ...base,
      activeTime: 10,
      articleProgress: 20,
      dwellTime: 15,
      maxVisibleSectionId: 'overview',
      maxVisibleSectionLabel: 'Overview',
      pageViewId: 'page-view-2',
      scrollDepth: 90,
    });

    await expect(readPageView('page-view-2')).resolves.toEqual({
      activeTime: 30,
      articleProgress: 60,
      dwellTime: 90,
      maxVisibleSectionId: 'details',
      scrollDepth: 90,
    });
  });
});
