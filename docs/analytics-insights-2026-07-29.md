# Analytics Insights & Portfolio Improvement Recommendations

> **Date:** 2026-07-29
> **Data source:** Cloudflare D1 `portfolio-db` (remote)
> **Period:** 2026-06-25 ~ 2026-07-27

---

## 1. Traffic Overview

| Metric | Value |
|--------|-------|
| Total sessions tracked | 73 |
| Sessions with page views | 53 |
| Application links created | 6 |
| Application links visited | 3 |

### Application Link Engagement

| Link | Company | Visits | Page Views | Avg Active (s) | Avg Article Progress |
|------|---------|--------|------------|-----------------|---------------------|
| `k4r2w` | 오늘의집 | 3 | 18 | 264 | 13% |
| `fbho` | 미리디 (미리캔버스) | 2 | 5 | 10 | 18% |
| `ic5x` | Kurly (컬리) | 1 | 1 | 7 | 0% |
| `anho` | 당근 | 0 | 0 | — | — |
| `bf3i` | 넥스트증권 | 0 | 0 | — | — |
| `b2o4` | 여기어때 | 0 | 0 | — | — |

> All four companies (오늘의집, 컬리, 당근, 여기어때) ultimately rejected the application. 넥스트증권 and 미리디 outcomes are unknown at the time of analysis.

---

## 2. User Behavior Deep Dive

### 2.1 오늘의집 (`k4r2w`) — Most Engagement

| Session | Behaviour |
|---------|-----------|
| A (7/8, ~2,192s active) | Home → agentic-workflow (61%) → aira (29%) → cover letter (435s re-read) |
| B (7/9, ~302s active) | agentic-workflow (74%) — revisited across two days |
| C (7/9, ~12s active) | Cover letter only, rapid drop-off |

**Key finding:** Viewers who reached agentic-workflow read it thoroughly. Aira was also explored but at shallower depth (29%).

### 2.2 미리디 (`fbho`) — Broad but Shallow

| Session | Behaviour |
|---------|-----------|
| A (7/24, Windows) | Cover letter (80s) → aira (5s / 16%) → camerafi-studio (6s / 47%) → today-weather (4s / 25%) |
| B (7/27, Mac) | Cover letter (12s) → exit |

**Key finding:** Viewer A scanned 3 projects but spent only 4–6 seconds each — content failed to hook. Viewer B barely glanced at the cover page.

### 2.3 Kurly (`ic5x`) — Immediate Drop-off

7 seconds total, no meaningful engagement. Either the cover letter or the landing page failed to create interest.

---

## 3. Per-Project Analytics

| Project | Views | Avg Progress | Avg Active Time |
|---------|-------|-------------|------------------|
| aira | 8 | 29% | 242s |
| today-weather | 5 | 25% | 6s |
| agentic-workflow | 3 | 66% | 106s |
| camerafi-studio | 1 | 47% | 6s |

### 3.1 aira (8 views, 29% avg progress)

- Highest view count but lowest completion rate by proportion.
- First achievement ("Streaming UI") may not resonate with web-focused interviewers.
- Retrospective section is 6 items long — too much for quick scanning.

### 3.2 agentic-workflow (3 views, 66% avg progress)

- **Highest completion rate.** Viewers who started it read most of it.
- Thin tech stack (`TypeScript, Vitest, Cloudflare`) doesn't showcase web FE skills.
- Strong in process/methodology but weak on concrete web product experience.

### 3.3 today-weather (5 views, ~6s avg active time)

- Viewers glance and move on. May lack visual hooks or strong opening statement.

### 3.4 camerafi-studio (1 view, 47%)

- Only one viewer; data is insufficient. But it's the most commercially relevant web SaaS project in the portfolio.

---

## 4. Technical Issues Found

### 4.1 Scroll Depth Always 0

`calculateScrollDepth` uses `document.documentElement.scrollTop`, but `html, body { height: 100% }` in `globals.css.ts` may cause the actual scroll container to differ. All 53 sessions have `scroll_depth: 0` despite non-zero `article_progress` values.

**Fix:** Use `document.scrollingElement` instead of `document.documentElement` for scroll measurements.

### 4.2 Active Time Was 0 Before 7/8

Sessions before July 8 consistently show `active_time: 0`. This likely corresponds to when the `visibilitychange` listener was introduced. Earlier analytics may have lost this metric.

### 4.3 No Scroll Depth Data = No "How Deep Did They Read" Signal

Without functional scroll depth tracking, `article_progress` is the only proxy for reading depth. But `article_progress` measures viewport position relative to the `<article>` element — it's a different metric than document-level scroll depth. Having both would give richer insight.

---

## 5. Actionable Recommendations

### 5.1 🔧 Fix Scroll Depth Tracking (Priority: Critical)

- Replace `document.documentElement` with `document.scrollingElement` in `AnalyticsTracker.tsx`.
- Verify fix by checking D1 data after deploying.

### 5.2 ✂️ Shorten Project Detail Pages (Priority: High)

**aira:**
- Move the most visually impressive or most role-relevant achievement to position #1.
- Trim retrospective from 6 items to 3–4 by merging similar themes.
- Add a compelling TL;DR at the top of the page.

**agentic-workflow:**
- Add more concrete web engineering context to the tech stack section.
- Consider adding a visual diagram or screenshot to hook attention faster.

### 5.3 🎯 Tune Project Selection by Role (Priority: Medium)

The `application_links` table supports `role` and `summary_preset` fields. Review the project assignments:
- For **web** roles, prioritize camerafi-studio and agentic-workflow over mobile-heavy projects.
- For **mobile** roles, keep aira and today-weather prominent.
- Ensure `featuredSkills` and `techStack` reflect role-appropriate keywords.

### 5.4 📱 Improve Cover Letter Page Retention (Priority: Medium)

Average cover letter page dwell time is 10–30 seconds (excluding the 878s outlier).
- Add a 1–2 sentence value proposition at the top.
- Provide clear navigation cues to project detail pages.
- Consider A/B testing different layouts.

### 5.5 📊 Add Accordion Interaction Tracking (Priority: Medium)

Track which accordion items (achievements, company cards, project items) interviewers expand/collapse. This reveals which content topics trigger curiosity.

### 5.6 🔍 Investigate Mobile Experience

Mobile visitors (Samsung Browser, Android) completed aira at 63% — higher than desktop. Ensure all project pages are mobile-optimized and visually compelling on small screens.

---

## 6. Raw Data Summary

### 6.1 All Application Links

```sql
SELECT al.slug, al.label, al.company_name, al.role,
       COALESCE(alv.visit_sessions, 0) AS visits,
       COALESCE(pv.page_views, 0) AS page_views
FROM application_links al
LEFT JOIN (SELECT application_link_id, COUNT(*) AS visit_sessions
           FROM application_link_visits GROUP BY application_link_id) alv
  ON alv.application_link_id = al.id
LEFT JOIN (SELECT alv2.application_link_id, COUNT(pv.id) AS page_views
           FROM application_link_visits alv2
           JOIN page_views pv ON pv.session_id = alv2.session_id
           GROUP BY alv2.application_link_id) pv
  ON pv.application_link_id = al.id;
```

### 6.2 Top Project Pages

```sql
SELECT path, COUNT(*) AS views,
       ROUND(AVG(active_time), 0) AS avg_active_sec,
       ROUND(AVG(article_progress), 0) AS avg_progress_pct,
       COUNT(DISTINCT session_id) AS unique_visitors
FROM page_views
WHERE path LIKE '/projects/%'
GROUP BY path
ORDER BY views DESC;
```
