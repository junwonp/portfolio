interface AdminAccessDecision {
  hasValidAccessJwt: boolean;
  hasValidAdminSession: boolean;
  isAuthorized: boolean;
  shouldClearAdminCookie: boolean;
  shouldSetAdminSessionCookie: boolean;
  shouldSetAdminCookie: boolean;
  shouldSetOwnerDeviceCookie: boolean;
}

export interface AdminAccessInput {
  accessEmail?: string | null;
  isAccessConfigured?: boolean;
  isAccessJwtValid?: boolean;
  isAdminCookieSet: boolean;
  isAdminSessionValid?: boolean;
  isDev: boolean;
  userEmail: string | null;
}

export interface CloudflareAccessConfig {
  policyAudiences: string[];
  teamDomain: string;
}

export interface CloudflareAccessClaims {
  aud: string | string[];
  email?: string;
  exp?: number;
  iss: string;
  nbf?: number;
  type?: string;
}

interface VerifyCloudflareAccessJwtInput {
  config: CloudflareAccessConfig;
  fetcher?: typeof fetch;
  now?: Date;
  token: string | null;
}

interface CloudflareAccessRuntimeEnv {
  ALLOW_ADMIN_WRITES?: unknown;
  APP_ENV?: unknown;
  CF_ACCESS_AUD?: unknown;
  CF_ACCESS_TEAM_DOMAIN?: unknown;
  POLICY_AUD?: unknown;
  TEAM_DOMAIN?: unknown;
}

type AccessJwk = JsonWebKey & {
  kid?: string;
};

export const ADMIN_COOKIE = 'is_admin';
export const OWNER_DEVICE_COOKIE = 'owner_device';

export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
export const OWNER_DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const CF_ACCESS_AUD_KEYS = ['CF_ACCESS_AUD', 'POLICY_AUD'] as const;
const CF_ACCESS_TEAM_DOMAIN_KEYS = ['CF_ACCESS_TEAM_DOMAIN', 'TEAM_DOMAIN'] as const;
const APP_ENV_KEYS = ['APP_ENV'] as const;
const ALLOW_ADMIN_WRITES_KEYS = ['ALLOW_ADMIN_WRITES'] as const;

const base64UrlToArrayBuffer = (value: string): ArrayBuffer => {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return buffer;
};

const decodeJsonPart = (value: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlToArrayBuffer(value))) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
};

const getStringValue = (
  env: CloudflareAccessRuntimeEnv,
  keys: readonly (keyof CloudflareAccessRuntimeEnv)[],
): string | null => {
  for (const key of keys) {
    const value = env[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
};

export const getCloudflareAccessConfig = (
  env: object | undefined,
): CloudflareAccessConfig | null => {
  const runtimeEnv = {
    ...process.env,
    ...(env ?? {}),
  } as CloudflareAccessRuntimeEnv;
  const teamDomain = getStringValue(runtimeEnv, CF_ACCESS_TEAM_DOMAIN_KEYS);
  const policyAudiences = getStringValue(runtimeEnv, CF_ACCESS_AUD_KEYS)
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (!teamDomain || !policyAudiences?.length) {
    return null;
  }

  return {
    policyAudiences,
    teamDomain: teamDomain.replace(/\/$/, ''),
  };
};

export const isAdminWriteEnabled = (env: object | undefined): boolean => {
  const runtimeEnv = {
    ...process.env,
    ...(env ?? {}),
  } as CloudflareAccessRuntimeEnv;
  const appEnv =
    getStringValue(runtimeEnv, APP_ENV_KEYS)?.toLowerCase() ??
    (process.env.NODE_ENV === 'production' ? 'production' : 'local');
  const allowAdminWrites =
    getStringValue(runtimeEnv, ALLOW_ADMIN_WRITES_KEYS)?.toLowerCase() === 'true';
  const isDeployRuntime = process.env.NODE_ENV === 'production';

  if (appEnv === 'development') {
    return !isDeployRuntime && allowAdminWrites;
  }

  return true;
};

export const verifyCloudflareAccessJwt = async ({
  config,
  fetcher = fetch,
  now = new Date(),
  token,
}: VerifyCloudflareAccessJwtInput): Promise<CloudflareAccessClaims | null> => {
  if (!token) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

  const header = decodeJsonPart(encodedHeader);
  const payload = decodeJsonPart(encodedPayload);
  const kid = typeof header?.kid === 'string' ? header.kid : null;

  if (!kid || header?.alg !== 'RS256' || !payload) return null;
  if (payload.iss !== config.teamDomain) return null;

  const audience = payload.aud;
  const policySet = new Set(config.policyAudiences);
  const audienceMatches = Array.isArray(audience)
    ? audience.some((value) => typeof value === 'string' && policySet.has(value))
    : typeof audience === 'string' && policySet.has(audience);

  if (!audienceMatches) return null;

  const nowSeconds = Math.floor(now.getTime() / 1000);
  if (typeof payload.exp === 'number' && payload.exp < nowSeconds) return null;
  if (typeof payload.nbf === 'number' && payload.nbf > nowSeconds) return null;

  try {
    const certsResponse = await fetcher(`${config.teamDomain}/cdn-cgi/access/certs`);
    if (!certsResponse.ok) return null;

    const certs = (await certsResponse.json()) as { keys?: AccessJwk[] };
    const jwk = certs.keys?.find((key) => key.kid === kid);
    if (!jwk) return null;

    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { hash: 'SHA-256', name: 'RSASSA-PKCS1-v1_5' },
      false,
      ['verify'],
    );

    const isValidSignature = await crypto.subtle.verify(
      { name: 'RSASSA-PKCS1-v1_5' },
      key,
      base64UrlToArrayBuffer(encodedSignature),
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
    );

    if (!isValidSignature) {
      return null;
    }

    return {
      aud: audience as string | string[],
      email: typeof payload.email === 'string' ? payload.email : undefined,
      exp: typeof payload.exp === 'number' ? payload.exp : undefined,
      iss: payload.iss as string,
      nbf: typeof payload.nbf === 'number' ? payload.nbf : undefined,
      type: typeof payload.type === 'string' ? payload.type : undefined,
    };
  } catch {
    return null;
  }
};

export const getAdminAccessDecision = ({
  accessEmail = null,
  isAccessConfigured = false,
  isAccessJwtValid = false,
  isAdminCookieSet,
  isAdminSessionValid = false,
  isDev,
  userEmail,
}: AdminAccessInput): AdminAccessDecision => {
  const normalizedAccessEmail =
    typeof accessEmail === 'string' && accessEmail.trim() ? accessEmail.trim() : null;
  const hasValidAccessJwt = isAccessConfigured && isAccessJwtValid && !!normalizedAccessEmail;
  const hasValidAdminSession = isAdminSessionValid;

  if (isDev) {
    return {
      hasValidAccessJwt,
      hasValidAdminSession,
      isAuthorized: isAdminCookieSet || !!userEmail || hasValidAdminSession || hasValidAccessJwt,
      shouldClearAdminCookie: false,
      shouldSetAdminCookie: !isAdminCookieSet && (!!userEmail || hasValidAccessJwt),
      shouldSetAdminSessionCookie: hasValidAccessJwt && !hasValidAdminSession,
      shouldSetOwnerDeviceCookie: isAdminCookieSet || !!userEmail || hasValidAdminSession || hasValidAccessJwt,
    };
  }

  if (hasValidAdminSession) {
    return {
      hasValidAccessJwt,
      hasValidAdminSession,
      isAuthorized: true,
      shouldClearAdminCookie: isAdminCookieSet,
      shouldSetAdminCookie: false,
      shouldSetAdminSessionCookie: false,
      shouldSetOwnerDeviceCookie: false,
    };
  }

  if (!hasValidAccessJwt) {
    return {
      hasValidAccessJwt,
      hasValidAdminSession,
      isAuthorized: false,
      shouldClearAdminCookie: isAdminCookieSet,
      shouldSetAdminCookie: false,
      shouldSetAdminSessionCookie: false,
      shouldSetOwnerDeviceCookie: false,
    };
  }

  return {
    hasValidAccessJwt,
    hasValidAdminSession,
    isAuthorized: true,
    shouldClearAdminCookie: isAdminCookieSet,
    shouldSetAdminCookie: false,
    shouldSetAdminSessionCookie: !hasValidAdminSession,
    shouldSetOwnerDeviceCookie: true,
  };
};
