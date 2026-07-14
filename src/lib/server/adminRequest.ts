import { cookies, headers } from 'next/headers';

import {
  ADMIN_COOKIE,
  type CloudflareAccessClaims,
  getAdminAccessDecision,
  getCloudflareAccessConfig,
  isAdminWriteEnabled,
  verifyCloudflareAccessJwt,
} from '@/lib/server/adminAccess';
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionSecret,
  verifyAdminSessionCookie,
} from '@/lib/server/adminSession';
import { getCloudflareEnv } from '@/lib/server/db';

async function getCurrentRequestAdminContext() {
  const [cookieStore, headersList] = await Promise.all([cookies(), headers()]);

  return { cookieStore, headersList };
}

export async function getCurrentAdminAccessDecision() {
  const { cookieStore, headersList } = await getCurrentRequestAdminContext();
  const isAdminCookieSet = cookieStore.get(ADMIN_COOKIE)?.value === 'true';
  const userEmail = headersList.get('Cf-Access-Authenticated-User-Email');
  const isDev = process.env.NODE_ENV !== 'production';
  const cloudflareEnv = getCloudflareEnv();
  const accessConfig = getCloudflareAccessConfig(cloudflareEnv);
  const accessJwt = headersList.get('Cf-Access-Jwt-Assertion');
  const adminSessionSecret = getAdminSessionSecret(cloudflareEnv);
  const adminSessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const adminSession = await verifyAdminSessionCookie({
    cookie: adminSessionCookie,
    secret: adminSessionSecret,
  });
  let accessClaims: CloudflareAccessClaims | null = null;

  if (accessConfig) {
    try {
      accessClaims = await verifyCloudflareAccessJwt({
        config: accessConfig,
        token: accessJwt,
      });
    } catch {
      accessClaims = null;
    }
  }

  return getAdminAccessDecision({
    accessEmail: accessClaims?.email ?? null,
    isAccessConfigured: accessConfig !== null,
    isAccessJwtValid: accessClaims !== null,
    isAdminCookieSet,
    isAdminSessionValid: adminSession !== null,
    isDev,
    userEmail,
  });
}

export async function isCurrentRequestAdmin() {
  const decision = await getCurrentAdminAccessDecision();
  return decision.isAuthorized;
}

export function isAdminWriteEnabledForCurrentRuntime() {
  return isAdminWriteEnabled(getCloudflareEnv());
}
