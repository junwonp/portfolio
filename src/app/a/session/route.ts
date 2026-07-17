import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  getCloudflareAccessConfig,
  OWNER_DEVICE_COOKIE,
  OWNER_DEVICE_COOKIE_MAX_AGE,
  verifyCloudflareAccessJwt,
} from '@/lib/server/admin/access';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionCookie,
  getAdminSessionCookieOptions,
  getAdminSessionSecret,
  getSafeAdminSessionReturnTo,
} from '@/lib/server/admin/session';
import { getCloudflareEnv } from '@/lib/server/infrastructure/database';

export async function GET(request: NextRequest) {
  const cloudflareEnv = getCloudflareEnv();
  const accessConfig = getCloudflareAccessConfig(cloudflareEnv);
  const adminSessionSecret = getAdminSessionSecret(cloudflareEnv);

  if (!accessConfig || !adminSessionSecret) {
    return NextResponse.json({ error: 'Admin session is not configured' }, { status: 500 });
  }

  const accessClaims = await verifyCloudflareAccessJwt({
    config: accessConfig,
    token: request.headers.get('Cf-Access-Jwt-Assertion'),
  });

  const accessEmail = accessClaims?.email?.trim();

  if (!accessEmail) {
    return NextResponse.json({ error: 'Admin access is required' }, { status: 401 });
  }

  const returnTo = getSafeAdminSessionReturnTo(request.nextUrl.searchParams.get('returnTo'));
  const response = NextResponse.redirect(new URL(returnTo, request.url));
  const isSecure = request.nextUrl.protocol === 'https:';

  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    await createAdminSessionCookie({
      email: accessEmail,
      secret: adminSessionSecret,
    }),
    getAdminSessionCookieOptions(isSecure),
  );
  response.cookies.set(OWNER_DEVICE_COOKIE, 'true', {
    httpOnly: true,
    maxAge: OWNER_DEVICE_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: isSecure,
  });

  return response;
}
