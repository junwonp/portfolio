import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { OWNER_DEVICE_COOKIE } from '@/lib/server/admin/access';
import { parseAnalyticsPayloadBody } from '@/lib/server/analytics/payload';
import {
  AnalyticsBodyTooLargeError,
  readAnalyticsBody,
  shouldCollectAnalytics,
} from '@/lib/server/analytics/request';
import { recordAnalyticsPayload } from '@/lib/server/analytics/tracking';
import { getCloudflareEnv, getDb } from '@/lib/server/infrastructure/database';

const MAX_ACCEPT_LANGUAGE_LENGTH = 35;

type AnalyticsRequestCf = Partial<
  Pick<IncomingRequestCfProperties, 'city' | 'colo' | 'country' | 'regionCode' | 'timezone'>
>;

// The NextRequest reaching a Route Handler exposes the Worker's `cf` object as
// a runtime getter outside the public type; read it defensively so tests and
// local dev without an edge context do not throw.
const readRequestCf = (request: NextRequest): AnalyticsRequestCf => {
  const cf: unknown = Reflect.get(request, 'cf');
  if (typeof cf !== 'object' || cf === null) {
    return {};
  }
  return cf as AnalyticsRequestCf;
};

const getCfText = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed || undefined;
};

const parseAcceptLanguage = (header: string | null): string => {
  const [firstTag] = header?.split(',') ?? [];
  const normalized = firstTag?.trim().toLowerCase() ?? '';
  return normalized ? normalized.slice(0, MAX_ACCEPT_LANGUAGE_LENGTH) : 'unknown';
};

export async function POST(request: NextRequest) {
  const env = await getCloudflareEnv();
  if (!shouldCollectAnalytics(env?.APP_ENV, request.url)) {
    return NextResponse.json({ success: true, bypassed: true });
  }
  const db = await getDb();
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

  if (request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1') {
    return NextResponse.json({ success: true, bypassed: true });
  }

  try {
    if (!env?.ANALYTICS_RATE_LIMITER || !clientIp) {
      return NextResponse.json({ success: false, error: 'Analytics unavailable' }, { status: 503 });
    }
    const { success } = await env.ANALYTICS_RATE_LIMITER.limit({
      key: `portfolio:analytics:${clientIp}`,
    });
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } },
      );
    }
    let rawBody: unknown;
    try {
      rawBody = await readAnalyticsBody(request);
    } catch (error) {
      if (error instanceof AnalyticsBodyTooLargeError) {
        return NextResponse.json({ success: false, error: error.message }, { status: 413 });
      }
      rawBody = null;
    }

    const payload = parseAnalyticsPayloadBody(rawBody);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid analytics payload' },
        { status: 400 },
      );
    }

    const cf = readRequestCf(request);
    const country =
      getCfText(cf.country) ?? getCfText(request.headers.get('cf-ipcountry')) ?? 'unknown';

    await recordAnalyticsPayload({
      acceptLanguage: parseAcceptLanguage(request.headers.get('accept-language')),
      city: getCfText(cf.city) ?? 'unknown',
      colo: getCfText(cf.colo) ?? 'unknown',
      country,
      db,
      payload,
      regionCode: getCfText(cf.regionCode) ?? 'unknown',
      timezone: getCfText(cf.timezone) ?? 'unknown',
      userAgentHeader: request.headers.get('user-agent') ?? '',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to log analytics:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
