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
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  dwell_time INTEGER DEFAULT 0, -- Dwell time in seconds
  scroll_depth INTEGER DEFAULT 0, -- Max scroll percentage (0-100)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);
