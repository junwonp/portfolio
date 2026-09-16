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

    await recordAnalyticsPayload({
      country: request.headers.get('cf-ipcountry') || 'unknown',
      db,
      payload,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to log analytics:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
