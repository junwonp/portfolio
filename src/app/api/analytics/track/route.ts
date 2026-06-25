import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { OWNER_DEVICE_COOKIE } from '@/lib/server/adminAccess';
import { type ApplicationLinkRow, normalizeApplicationSlug } from '@/lib/server/applicationLinks';
import { getDb } from '@/lib/server/db';

interface AnalyticsPayload {
  applicationSlug?: string;
  dwellTime: number;
  isInitial: boolean;
  path?: string;
  referrer: string;
  scrollDepth: number;
  sessionId: string;
  userAgent: string;
}

const MAX_DWELL_TIME_SECONDS = 60 * 60 * 24;
const MAX_REFERRER_LENGTH = 500;
const MAX_SESSION_ID_LENGTH = 128;
const MAX_URL_PATH_LENGTH = 2048;
const MAX_USER_AGENT_LENGTH = 500;

const getClampedInteger = (value: unknown, min: number, max: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return min;
  }
  return Math.min(Math.max(Math.round(value), min), max);
};

const getOptionalPath = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const path = value.trim();
  if (!path.startsWith('/') || path.length > MAX_URL_PATH_LENGTH) {
    return undefined;
  }
  return path;
};

const getOptionalSlug = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const slug = normalizeApplicationSlug(value);
  return slug || undefined;
};

const getRequiredString = (value: unknown, maxLength: number): string | null => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }
  return trimmed;
};

const getStringOrFallback = (value: unknown, fallback: string, maxLength: number): string => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }
  return trimmed.slice(0, maxLength);
};

const parseAnalyticsPayload = async (request: NextRequest): Promise<AnalyticsPayload | null> => {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return null;
  }

  if (typeof rawBody !== 'object' || rawBody === null) {
    return null;
  }

  const body = rawBody as Record<string, unknown>;
  const sessionId = getRequiredString(body.sessionId, MAX_SESSION_ID_LENGTH);

  if (!sessionId) {
    return null;
  }

  return {
    applicationSlug: getOptionalSlug(body.applicationSlug),
    dwellTime: getClampedInteger(body.dwellTime, 0, MAX_DWELL_TIME_SECONDS),
    isInitial: body.isInitial === true,
    path: getOptionalPath(body.path),
    referrer: getStringOrFallback(body.referrer, 'direct', MAX_REFERRER_LENGTH),
    scrollDepth: getClampedInteger(body.scrollDepth, 0, 100),
    sessionId,
    userAgent: getStringOrFallback(body.userAgent, 'unknown', MAX_USER_AGENT_LENGTH),
  };
};

export async function POST(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { success: false, error: 'Database binding is missing' },
      { status: 500 },
    );
  }

  const host = request.headers.get('host') || '';
  const cookieStore = await cookies();
  const isOwnerDevice = cookieStore.get(OWNER_DEVICE_COOKIE)?.value === 'true';
  const clientIp = request.headers.get('CF-Connecting-IP') || '';

  const ignoreIps = process.env.IGNORE_IPS || '';
  const isIgnoredIp =
    clientIp &&
    ignoreIps
      .split(',')
      .map((ip) => ip.trim())
      .includes(clientIp);

  const isConfirmedAdmin = isOwnerDevice || isIgnoredIp;

  if (host.includes('localhost') || host.includes('127.0.0.1') || isConfirmedAdmin) {
    return NextResponse.json({ success: true, bypassed: true });
  }

  try {
    const payload = await parseAnalyticsPayload(request);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid analytics payload' },
        { status: 400 },
      );
    }

    if (payload.isInitial) {
      const country = request.headers.get('cf-ipcountry') || 'unknown';
      await db
        .prepare(
          `INSERT OR IGNORE INTO user_sessions (id, ip_country, user_agent, referrer, is_admin)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(payload.sessionId, country, payload.userAgent, payload.referrer, 0)
        .run();
    }

    if (payload.applicationSlug) {
      const applicationLink = await db
        .prepare(
          `SELECT id
           FROM application_links
           WHERE slug = ? AND expires_at > datetime('now')
           LIMIT 1`,
        )
        .bind(payload.applicationSlug)
        .first<Pick<ApplicationLinkRow, 'id'>>();

      if (applicationLink) {
        await db
          .prepare(
            `INSERT OR IGNORE INTO application_link_visits (session_id, application_link_id)
             VALUES (?, ?)`,
          )
          .bind(payload.sessionId, applicationLink.id)
          .run();
      }
    }

    if (payload.path) {
      await db
        .prepare(
          `INSERT INTO page_views (session_id, path, dwell_time, scroll_depth)
           VALUES (?, ?, ?, ?)`,
        )
        .bind(payload.sessionId, payload.path, payload.dwellTime, payload.scrollDepth)
        .run();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to log analytics:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
