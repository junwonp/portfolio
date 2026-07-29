let analyticsStorageSchemaReady = false;

const isDuplicateColumnError = (error: unknown): boolean =>
  error instanceof Error && /duplicate column name/i.test(error.message);

const addColumnIfMissing = async (db: D1Database, sql: string): Promise<void> => {
  try {
    await db.prepare(sql).run();
  } catch (error) {
    if (!isDuplicateColumnError(error)) {
      throw error;
    }
  }
};

export const ensureAnalyticsStorageSchema = async (db: D1Database): Promise<void> => {
  if (analyticsStorageSchemaReady) {
    return;
  }

  await addColumnIfMissing(db, 'ALTER TABLE user_sessions ADD COLUMN ip_address TEXT');

  await addColumnIfMissing(db, 'ALTER TABLE page_views ADD COLUMN client_page_view_id TEXT');
  await addColumnIfMissing(db, 'ALTER TABLE page_views ADD COLUMN active_time INTEGER DEFAULT 0');
  await addColumnIfMissing(
    db,
    'ALTER TABLE page_views ADD COLUMN article_progress INTEGER DEFAULT 0',
  );
  await addColumnIfMissing(db, 'ALTER TABLE page_views ADD COLUMN max_visible_section_id TEXT');
  await addColumnIfMissing(db, 'ALTER TABLE page_views ADD COLUMN max_visible_section_label TEXT');
  await addColumnIfMissing(db, 'ALTER TABLE page_views ADD COLUMN last_seen_at TIMESTAMP');

  await db
    .prepare(
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_page_views_client_page_view_id
       ON page_views(client_page_view_id)`,
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS web_vitals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        path TEXT NOT NULL,
        metric_id TEXT NOT NULL,
        metric_name TEXT NOT NULL,
        value REAL NOT NULL,
        delta REAL NOT NULL,
        rating TEXT NOT NULL,
        navigation_type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE CASCADE
      )`,
    )
    .run();
  await db
    .prepare('CREATE INDEX IF NOT EXISTS idx_web_vitals_session ON web_vitals(session_id)')
    .run();
  await db
    .prepare('CREATE INDEX IF NOT EXISTS idx_web_vitals_created_at ON web_vitals(created_at)')
    .run();
  await db
    .prepare('CREATE INDEX IF NOT EXISTS idx_web_vitals_metric ON web_vitals(metric_name)')
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS analytics_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        path TEXT NOT NULL,
        interaction_type TEXT NOT NULL,
        interaction_label TEXT NOT NULL,
        action TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE CASCADE
      )`,
    )
    .run();
  await db
    .prepare(
      'CREATE INDEX IF NOT EXISTS idx_analytics_interactions_session ON analytics_interactions(session_id)',
    )
    .run();
  await db
    .prepare(
      'CREATE INDEX IF NOT EXISTS idx_analytics_interactions_created_at ON analytics_interactions(created_at)',
    )
    .run();

  analyticsStorageSchemaReady = true;
};
