interface AdminAccessDecision {
  isAuthorized: boolean;
  shouldClearAdminCookie: boolean;
  shouldSetAdminCookie: boolean;
  shouldSetOwnerDeviceCookie: boolean;
}

export interface AdminAccessInput {
  isAccessConfigured?: boolean;
  isAccessJwtValid?: boolean;
  isAdminCookieSet: boolean;
  isDev: boolean;
  userEmail: string | null;
}

export interface CloudflareAccessConfig {
  policyAud: string;
  teamDomain: string;
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
  const policyAud = getStringValue(runtimeEnv, CF_ACCESS_AUD_KEYS);

  if (!teamDomain || !policyAud) {
    return null;
  }

  return {
    policyAud,
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
    (process.env.NODE_ENV === 'production' ? 'production' : 'development');
  const allowAdminWrites =
    getStringValue(runtimeEnv, ALLOW_ADMIN_WRITES_KEYS)?.toLowerCase() === 'true';
  const isDeployRuntime = process.env.NODE_ENV === 'production';

  if (appEnv === 'develop') {
    return !isDeployRuntime && allowAdminWrites;
  }

  return true;
};

export const verifyCloudflareAccessJwt = async ({
  config,
  fetcher = fetch,
  now = new Date(),
  token,
}: VerifyCloudflareAccessJwtInput): Promise<boolean> => {
  if (!token) return false;

  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) return false;

  const header = decodeJsonPart(encodedHeader);
  const payload = decodeJsonPart(encodedPayload);
  const kid = typeof header?.kid === 'string' ? header.kid : null;

  if (!kid || header?.alg !== 'RS256' || !payload) return false;
  if (payload.iss !== config.teamDomain) return false;

  const audience = payload.aud;
  const audienceMatches = Array.isArray(audience)
    ? audience.includes(config.policyAud)
    : audience === config.policyAud;

  if (!audienceMatches) return false;

  const nowSeconds = Math.floor(now.getTime() / 1000);
  if (typeof payload.exp === 'number' && payload.exp < nowSeconds) return false;
  if (typeof payload.nbf === 'number' && payload.nbf > nowSeconds) return false;

  try {
    const certsResponse = await fetcher(`${config.teamDomain}/cdn-cgi/access/certs`);
    if (!certsResponse.ok) return false;

    const certs = (await certsResponse.json()) as { keys?: AccessJwk[] };
    const jwk = certs.keys?.find((key) => key.kid === kid);
    if (!jwk) return false;

    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { hash: 'SHA-256', name: 'RSASSA-PKCS1-v1_5' },
      false,
      ['verify'],
    );

    return crypto.subtle.verify(
      { name: 'RSASSA-PKCS1-v1_5' },
      key,
      base64UrlToArrayBuffer(encodedSignature),
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
    );
  } catch {
    return false;
  }
};

export const getAdminAccessDecision = ({
  isAccessConfigured = false,
  isAccessJwtValid = false,
  isAdminCookieSet,
  isDev,
  userEmail,
}: AdminAccessInput): AdminAccessDecision => {
  if (isDev) {
    return {
      isAuthorized: isAdminCookieSet || !!userEmail,
      shouldClearAdminCookie: false,
      shouldSetAdminCookie: !isAdminCookieSet && !!userEmail,
      shouldSetOwnerDeviceCookie: isAdminCookieSet || !!userEmail,
    };
  }

  if (!userEmail) {
    return {
      isAuthorized: false,
      shouldClearAdminCookie: isAdminCookieSet,
      shouldSetAdminCookie: false,
      shouldSetOwnerDeviceCookie: false,
    };
  }

  if (!isAccessConfigured || !isAccessJwtValid) {
    return {
      isAuthorized: false,
      shouldClearAdminCookie: isAdminCookieSet,
      shouldSetAdminCookie: false,
      shouldSetOwnerDeviceCookie: false,
    };
  }

  return {
    isAuthorized: true,
    shouldClearAdminCookie: false,
    shouldSetAdminCookie: !isAdminCookieSet,
    shouldSetOwnerDeviceCookie: true,
  };
};
