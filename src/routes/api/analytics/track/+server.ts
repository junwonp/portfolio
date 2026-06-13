import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform, cookies }) => {
  if (!platform?.env?.portfolio_db) {
    return json({ success: false, error: 'Database binding is missing' }, { status: 500 });
  }

  const host = request.headers.get('host') || '';
  const isAdmin = cookies.get('is_admin') === 'true';
  const userEmail = request.headers.get('Cf-Access-Authenticated-User-Email');
  const clientIp = request.headers.get('CF-Connecting-IP') || '';

  // 환경변수 IGNORE_IPS에 등록된 본인 IP 필터링
  const ignoreIps = platform.env.IGNORE_IPS || '';
  const isIgnoredIp =
    clientIp &&
    ignoreIps
      .split(',')
      .map((ip) => ip.trim())
      .includes(clientIp);

  // 관리자 세션, Cloudflare Access 헤더 또는 IP 제외 조건에 해당하는지 판별
  const isConfirmedAdmin = isAdmin || !!userEmail || isIgnoredIp;

  // 로컬 개발 환경 및 관리자 세션은 적재를 건너뜀 (단, 스크립트 에러 방지를 위해 200 OK 응답)
  if (host.includes('localhost') || host.includes('127.0.0.1') || isConfirmedAdmin) {
    return json({ success: true, bypassed: true });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const body = (await request.json()) as {
      sessionId?: string;
      path?: string;
      referrer?: string;
      userAgent?: string;
      dwellTime?: number;
      scrollDepth?: number;
      isInitial?: boolean;
    };
    const { sessionId, path, referrer, userAgent, dwellTime, scrollDepth, isInitial } = body;

    if (!sessionId) {
      return json({ success: false, error: 'Missing session ID' }, { status: 400 });
    }

    const db = platform.env.portfolio_db;

    // 1. 최초 세션 등록 요청 시 세션 메타데이터 삽입
    if (isInitial) {
      const country = request.headers.get('cf-ipcountry') || 'unknown';
      await db
        .prepare(
          `INSERT OR IGNORE INTO user_sessions (id, ip_country, user_agent, referrer, is_admin)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(sessionId, country, userAgent || 'unknown', referrer || 'direct', 0)
        .run();
    }

    // 2. 페이지뷰가 들어온 경우 적재
    if (path) {
      await db
        .prepare(
          `INSERT INTO page_views (session_id, path, dwell_time, scroll_depth)
           VALUES (?, ?, ?, ?)`,
        )
        .bind(sessionId, path, dwellTime || 0, scrollDepth || 0)
        .run();
    }

    return json({ success: true });
  } catch (err) {
    console.error('Failed to log analytics:', err);
    return json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
};
