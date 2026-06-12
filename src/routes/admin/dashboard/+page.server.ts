/* eslint-disable @typescript-eslint/only-throw-error */
import { redirect } from '@sveltejs/kit';

import { dev } from '$app/environment';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, platform, request }) => {
  let isAdmin = cookies.get('is_admin') === 'true';
  const userEmail = request.headers.get('Cf-Access-Authenticated-User-Email');

  // 쿠키 세션이 유실되었어도 Cloudflare Access 로그인 증명 헤더가 실려있다면 자동 복구
  if (!isAdmin && userEmail) {
    cookies.set('is_admin', 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    isAdmin = true;
  }

  if (!isAdmin) {
    throw redirect(303, '/admin');
  }

  if (!platform?.env?.portfolio_db) {
    return {
      error: 'Database is not bound',
      stats: { totalSessions: 0, totalPageViews: 0, avgDwellTime: 0, avgScrollDepth: 0 },
      dailyChart: [],
      topPages: [],
      topReferrers: [],
      topCountries: [],
    };
  }

  const db = platform.env.portfolio_db;

  try {
    // 1. 기본 전체 통계 조회
    const statsQuery = await db
      .prepare(
        `SELECT 
          (SELECT COUNT(*) FROM user_sessions WHERE is_admin = 0) as totalSessions,
          (SELECT COUNT(*) FROM page_views) as totalPageViews,
          (SELECT ROUND(AVG(dwell_time), 1) FROM page_views) as avgDwellTime,
          (SELECT ROUND(AVG(scroll_depth), 1) FROM page_views) as avgScrollDepth`,
      )
      .first<{
        totalSessions: number;
        totalPageViews: number;
        avgDwellTime: number;
        avgScrollDepth: number;
      }>();

    const stats = {
      totalSessions: statsQuery?.totalSessions || 0,
      totalPageViews: statsQuery?.totalPageViews || 0,
      avgDwellTime: statsQuery?.avgDwellTime || 0,
      avgScrollDepth: statsQuery?.avgScrollDepth || 0,
    };

    // 2. 최근 14일간의 일별 트래픽 (세션 수, 페이지 뷰 수)
    // strftime('%Y-%m-%d', created_at) 형식을 통해 일자 그룹핑
    const dailyChartResult = await db
      .prepare(
        `SELECT 
          strftime('%Y-%m-%d', created_at) as date,
          COUNT(DISTINCT session_id) as sessions,
          COUNT(*) as views
         FROM page_views
         GROUP BY date
         ORDER BY date ASC
         LIMIT 14`,
      )
      .all<{ date: string; sessions: number; views: number }>();

    const dailyChart = dailyChartResult.results;

    // 3. 인기 페이지 Top 10
    const topPagesResult = await db
      .prepare(
        `SELECT 
          path,
          COUNT(*) as views,
          ROUND(AVG(dwell_time), 1) as avgDwell,
          ROUND(AVG(scroll_depth), 1) as avgScroll
         FROM page_views
         GROUP BY path
         ORDER BY views DESC
         LIMIT 10`,
      )
      .all<{ path: string; views: number; avgDwell: number; avgScroll: number }>();

    const topPages = topPagesResult.results;

    // 4. 유입 레퍼러 Top 5
    const topReferrersResult = await db
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
      .all<{ referrer: string; count: number }>();

    const topReferrers = topReferrersResult.results;

    // 5. 국가별 유입 Top 5
    const topCountriesResult = await db
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

    const topCountries = topCountriesResult.results;

    return {
      stats,
      dailyChart,
      topPages,
      topReferrers,
      topCountries,
    };
  } catch (err) {
    console.error('Failed to load dashboard metrics:', err);
    return {
      error: 'Failed to fetch metrics from database',
      stats: { totalSessions: 0, totalPageViews: 0, avgDwellTime: 0, avgScrollDepth: 0 },
      dailyChart: [],
      topPages: [],
      topReferrers: [],
      topCountries: [],
    };
  }
};

export const actions: Actions = {
  logout: ({ cookies }) => {
    cookies.delete('is_admin', { path: '/' });
    if (dev) {
      throw redirect(303, '/admin');
    } else {
      // Cloudflare Access 인증 해제를 위해 전용 엔드포인트로 리다이렉트
      throw redirect(303, '/cdn-cgi/access/logout');
    }
  },
};
