/**
 * Inserts dummy analytics data for local development and UI testing.
 * Only runs when user_sessions table is empty (idempotent guard).
 * All dummy sessions have user_agent LIKE 'DummySeed%' for easy identification.
 */
export async function seedDummySessions(db: D1Database): Promise<void> {
  const existing = await db
    .prepare('SELECT COUNT(*) as count FROM user_sessions WHERE user_agent LIKE ?')
    .bind('DummySeed%')
    .first<{ count: number }>();

  if (existing && existing.count > 0) {
    return; // Already seeded
  }

  const now = new Date();

  // Session 1: Human, Chrome, Google KR -> home -> project1 -> project2 (with interactions)
  const s1Id = 'dummy-session-001';
  const s1Created = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
  await db
    .prepare(
      `INSERT OR IGNORE INTO user_sessions (id, ip_address, ip_country, user_agent, referrer, is_admin, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?)`,
    )
    .bind(s1Id, '211.123.45.67', 'KR', 'DummySeed/1.0 Chrome/126 (Macintosh)', 'https://www.google.com/', toSqlDateTime(s1Created))
    .run();

  // Page views for session 1
  const s1Pv1Time = new Date(s1Created.getTime() + 1 * 1000);
  await insertPageView(db, 'dummy-pv-001', s1Id, '/', null, 45, 80, 42, 'hero', '히어로 섹션', s1Pv1Time);
  const s1Pv2Time = new Date(s1Created.getTime() + 50 * 1000);
  await insertPageView(db, 'dummy-pv-002', s1Id, '/projects/admin-dashboard', '/', 120, 95, 110, 'tech-stack', '기술 스택', s1Pv2Time);
  const s1Pv3Time = new Date(s1Created.getTime() + 175 * 1000);
  await insertPageView(db, 'dummy-pv-003', s1Id, '/projects/aira', '/projects/admin-dashboard', 90, 60, 55, 'architecture', '아키텍처', s1Pv3Time);

  // Interactions for session 1
  await db
    .prepare(
      `INSERT INTO analytics_interactions (session_id, path, interaction_type, interaction_label, action, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(s1Id, '/projects/admin-dashboard', 'accordion_project', '실시간 대시보드', 'open', toSqlDateTime(new Date(s1Created.getTime() + 65 * 1000)))
    .run();

  // Session 2: Human, Safari, direct -> home -> project (with 2 interactions)
  const s2Id = 'dummy-session-002';
  const s2Created = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago
  await db
    .prepare(
      `INSERT OR IGNORE INTO user_sessions (id, ip_address, ip_country, user_agent, referrer, is_admin, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?)`,
    )
    .bind(s2Id, '98.76.54.32', 'US', 'DummySeed/2.0 Safari/17.5 (iPhone)', 'direct', toSqlDateTime(s2Created))
    .run();

  const s2Pv1Time = new Date(s2Created.getTime() + 1 * 1000);
  await insertPageView(db, 'dummy-pv-004', s2Id, '/', null, 30, 45, 28, null, null, s2Pv1Time);
  const s2Pv2Time = new Date(s2Created.getTime() + 35 * 1000);
  await insertPageView(db, 'dummy-pv-005', s2Id, '/projects/aira', '/', 200, 100, 185, 'retrospective', '회고', s2Pv2Time);

  await db
    .prepare(
      `INSERT INTO analytics_interactions (session_id, path, interaction_type, interaction_label, action, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(s2Id, '/projects/aira', 'accordion_company', 'AI 스타트업', 'open', toSqlDateTime(new Date(s2Created.getTime() + 50 * 1000)))
    .run();
  await db
    .prepare(
      `INSERT INTO analytics_interactions (session_id, path, interaction_type, interaction_label, action, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(s2Id, '/projects/aira', 'accordion_achievement', '푸시 알림 시스템', 'close', toSqlDateTime(new Date(s2Created.getTime() + 120 * 1000)))
    .run();

  // Session 3: Bot, empty UA, no referrer -> home (zero engagement)
  const s3Id = 'dummy-session-003';
  const s3Created = new Date(now.getTime() - 30 * 60 * 1000); // 30 min ago
  await db
    .prepare(
      `INSERT OR IGNORE INTO user_sessions (id, ip_address, ip_country, user_agent, referrer, is_admin, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?)`,
    )
    .bind(s3Id, '10.0.0.1', 'unknown', 'DummySeed/3.0', '', toSqlDateTime(s3Created))
    .run();

  const s3Pv1Time = new Date(s3Created.getTime() + 1 * 1000);
  await insertPageView(db, 'dummy-pv-006', s3Id, '/', null, 0, 0, 0, null, null, s3Pv1Time);
}

async function insertPageView(
  db: D1Database,
  clientPageViewId: string,
  sessionId: string,
  path: string,
  previousPath: string | null,
  dwellTime: number,
  scrollDepth: number,
  activeTime: number,
  maxVisibleSectionId: string | null,
  maxVisibleSectionLabel: string | null,
  createdAt: Date,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO page_views (
        client_page_view_id, session_id, path, previous_path,
        dwell_time, scroll_depth, active_time, article_progress,
        max_visible_section_id, max_visible_section_label,
        created_at, last_seen_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      clientPageViewId, sessionId, path, previousPath,
      dwellTime, scrollDepth, activeTime, scrollDepth > 0 ? Math.min(scrollDepth, 100) : 0,
      maxVisibleSectionId, maxVisibleSectionLabel,
      toSqlDateTime(createdAt), toSqlDateTime(new Date(createdAt.getTime() + dwellTime * 1000)),
    )
    .run();
}

function toSqlDateTime(date: Date): string {
  return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
}
