-- schema.sql
-- Cloudflare D1 Database schema for Visitor Analytics

CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  ip_country TEXT,
  user_agent TEXT,
  referrer TEXT,
  is_admin INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_page_view_id TEXT UNIQUE,
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  dwell_time INTEGER DEFAULT 0, -- Dwell time in seconds
  scroll_depth INTEGER DEFAULT 0, -- Max scroll percentage (0-100)
  active_time INTEGER DEFAULT 0, -- Visible-tab active time in seconds
  article_progress INTEGER DEFAULT 0, -- Max project article progress (0-100)
  max_visible_section_id TEXT,
  max_visible_section_label TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_page_views_client_page_view_id
ON page_views(client_page_view_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);

CREATE TABLE IF NOT EXISTS web_vitals (
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
);

CREATE INDEX IF NOT EXISTS idx_web_vitals_session ON web_vitals(session_id);
CREATE INDEX IF NOT EXISTS idx_web_vitals_created_at ON web_vitals(created_at);
CREATE INDEX IF NOT EXISTS idx_web_vitals_metric ON web_vitals(metric_name);

CREATE TABLE IF NOT EXISTS application_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  company_name TEXT NOT NULL,
  role TEXT,
  summary_preset TEXT NOT NULL DEFAULT 'default',
  project_ids TEXT NOT NULL DEFAULT '[]',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_link_visits (
  session_id TEXT PRIMARY KEY,
  application_link_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (application_link_id) REFERENCES application_links(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_application_links_slug ON application_links(slug);
CREATE INDEX IF NOT EXISTS idx_application_links_expires_at ON application_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_application_link_visits_link ON application_link_visits(application_link_id);

CREATE TABLE IF NOT EXISTS content_overrides (
  id TEXT PRIMARY KEY,
  area TEXT NOT NULL,
  locale TEXT NOT NULL,
  target_key TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(area, locale, target_key, status)
);

CREATE INDEX IF NOT EXISTS idx_content_overrides_lookup
ON content_overrides(area, locale, target_key, status);

CREATE TABLE IF NOT EXISTS tags (
  tag TEXT NOT NULL,
  path TEXT NOT NULL,
  UNIQUE(tag, path) ON CONFLICT REPLACE
);

CREATE TABLE IF NOT EXISTS revalidations (
  tag TEXT NOT NULL,
  revalidatedAt INTEGER NOT NULL,
  UNIQUE(tag) ON CONFLICT REPLACE
);
