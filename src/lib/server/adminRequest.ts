import { cookies, headers } from 'next/headers';

import {
  ADMIN_COOKIE,
  getAdminAccessDecision,
  getCloudflareAccessConfig,
  isAdminWriteEnabled,
  verifyCloudflareAccessJwt,
} from '@/lib/server/adminAccess';
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
  const accessConfig = getCloudflareAccessConfig(getCloudflareEnv());
  const accessJwt = headersList.get('Cf-Access-Jwt-Assertion');
  let isAccessJwtValid = false;

  if (accessConfig) {
    try {
      isAccessJwtValid = await verifyCloudflareAccessJwt({
        config: accessConfig,
        token: accessJwt,
      });
    } catch {
      isAccessJwtValid = false;
    }
  }

  return getAdminAccessDecision({
    isAccessConfigured: accessConfig !== null,
    isAccessJwtValid,
    isAdminCookieSet,
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

export async function canCurrentRequestWriteAdminContent() {
  if (!isAdminWriteEnabledForCurrentRuntime()) {
    return false;
  }

  return isCurrentRequestAdmin();
}
