import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { OWNER_DEVICE_COOKIE } from '@/lib/server/adminAccess';
import { parseAnalyticsPayloadBody } from '@/lib/server/analyticsPayload';
import { recordAnalyticsPayload } from '@/lib/server/analyticsTracking';
import { getDb } from '@/lib/server/db';

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
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
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
