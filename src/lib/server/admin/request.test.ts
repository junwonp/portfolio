import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const env = vi.hoisted(() => vi.fn());
const cookieStore = vi.hoisted(() => vi.fn());
const headersList = vi.hoisted(() => vi.fn());
const accessConfig = vi.hoisted(() => vi.fn());
const accessDecision = vi.hoisted(() => vi.fn());
const verifyAccessJwt = vi.hoisted(() => vi.fn());
const verifyAdminSession = vi.hoisted(() => vi.fn());

vi.mock('next/headers', () => ({ cookies: cookieStore, headers: headersList }));
vi.mock('@/lib/server/infrastructure/database', () => ({ getCloudflareEnv: env }));
vi.mock('@/lib/server/admin/access', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/server/admin/access')>();

  return {
    ...actual,
    getAdminAccessDecision: accessDecision,
    getCloudflareAccessConfig: accessConfig,
    verifyCloudflareAccessJwt: verifyAccessJwt,
  };
});
vi.mock('@/lib/server/admin/session', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/server/admin/session')>();

  return {
    ...actual,
    verifyAdminSessionCookie: verifyAdminSession,
  };
});

import { ADMIN_COOKIE } from '@/lib/server/admin/access';
import { ADMIN_SESSION_COOKIE } from '@/lib/server/admin/session';
import {
  getCurrentAdminAccessDecision,
  isAdminWriteEnabledForCurrentRuntime,
  isCurrentRequestAdmin,
} from './request';

const ACCESS_EMAIL_HEADER = 'Cf-Access-Authenticated-User-Email';
const ACCESS_JWT_HEADER = 'Cf-Access-Jwt-Assertion';

const createCookieStore = (values: Record<string, string> = {}) => ({
  get: (name: string) => {
    const value = values[name];

    return value === undefined ? undefined : { name, value };
  },
});

const createHeadersList = (values: Record<string, string> = {}) => ({
  get: (name: string) => values[name] ?? null,
});

const stubAdminRequest = () => {
  vi.stubEnv('NODE_ENV', 'production');
  env.mockResolvedValue({ ADMIN_SESSION_SECRET: 'test-secret' });
  accessConfig.mockReturnValue(null);
  accessDecision.mockReturnValue({ isAuthorized: false });
  verifyAccessJwt.mockResolvedValue(null);
  verifyAdminSession.mockResolvedValue(null);
  cookieStore.mockResolvedValue(createCookieStore());
  headersList.mockResolvedValue(createHeadersList());
};

afterEach(() => vi.unstubAllEnvs());
describe('runtime admin write guard', () => {
  it('awaits preview bindings instead of falling back to production process env', async () => {
    vi.stubEnv('APP_ENV', 'production');
    env.mockResolvedValue({ APP_ENV: 'development', ALLOW_ADMIN_WRITES: 'false' });
    await expect(isAdminWriteEnabledForCurrentRuntime()).resolves.toBe(false);
  });

  it('allows writes when the bound runtime environment opts in for development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    env.mockResolvedValue({ ALLOW_ADMIN_WRITES: 'true', APP_ENV: 'development' });

    await expect(isAdminWriteEnabledForCurrentRuntime()).resolves.toBe(true);
  });
});

describe('getCurrentAdminAccessDecision', () => {
  beforeEach(stubAdminRequest);

  it('skips Access JWT verification when Access is not configured', async () => {
    await expect(getCurrentAdminAccessDecision()).resolves.toEqual({ isAuthorized: false });

    expect(verifyAccessJwt).not.toHaveBeenCalled();
    expect(verifyAdminSession).toHaveBeenCalledWith({
      cookie: undefined,
      secret: 'test-secret',
    });
    expect(accessDecision).toHaveBeenCalledWith({
      accessEmail: null,
      isAccessConfigured: false,
      isAccessJwtValid: false,
      isAdminCookieSet: false,
      isAdminSessionValid: false,
      isDev: false,
      userEmail: null,
    });
  });

  it('passes verified Access claims and the request email through to the decision', async () => {
    const config = {
      policyAudiences: ['test-aud'],
      teamDomain: 'https://team.cloudflareaccess.com',
    };
    accessConfig.mockReturnValue(config);
    verifyAccessJwt.mockResolvedValue({
      aud: 'test-aud',
      email: 'owner@example.com',
      iss: 'https://team.cloudflareaccess.com',
    });
    headersList.mockResolvedValue(
      createHeadersList({
        [ACCESS_EMAIL_HEADER]: 'owner@example.com',
        [ACCESS_JWT_HEADER]: 'valid-token',
      }),
    );

    await getCurrentAdminAccessDecision();

    expect(verifyAccessJwt).toHaveBeenCalledWith({ config, token: 'valid-token' });
    expect(accessDecision).toHaveBeenCalledWith({
      accessEmail: 'owner@example.com',
      isAccessConfigured: true,
      isAccessJwtValid: true,
      isAdminCookieSet: false,
      isAdminSessionValid: false,
      isDev: false,
      userEmail: 'owner@example.com',
    });
  });

  it('swallows Access JWT verification failures and forwards null claims', async () => {
    accessConfig.mockReturnValue({
      policyAudiences: ['test-aud'],
      teamDomain: 'https://team.cloudflareaccess.com',
    });
    verifyAccessJwt.mockRejectedValue(new Error('Access JWT verification is unavailable'));
    headersList.mockResolvedValue(createHeadersList({ [ACCESS_JWT_HEADER]: 'broken-token' }));

    await expect(getCurrentAdminAccessDecision()).resolves.toEqual({ isAuthorized: false });

    expect(verifyAccessJwt).toHaveBeenCalledWith({
      config: {
        policyAudiences: ['test-aud'],
        teamDomain: 'https://team.cloudflareaccess.com',
      },
      token: 'broken-token',
    });
    expect(accessDecision).toHaveBeenCalledWith({
      accessEmail: null,
      isAccessConfigured: true,
      isAccessJwtValid: false,
      isAdminCookieSet: false,
      isAdminSessionValid: false,
      isDev: false,
      userEmail: null,
    });
  });

  it('reports the admin cookie as set only when it holds true', async () => {
    cookieStore.mockResolvedValue(createCookieStore({ [ADMIN_COOKIE]: 'true' }));

    await getCurrentAdminAccessDecision();

    expect(accessDecision).toHaveBeenCalledWith(
      expect.objectContaining({ isAdminCookieSet: true }),
    );
  });

  it('does not treat a non-true admin cookie as set', async () => {
    cookieStore.mockResolvedValue(createCookieStore({ [ADMIN_COOKIE]: 'false' }));

    await getCurrentAdminAccessDecision();

    expect(accessDecision).toHaveBeenCalledWith(
      expect.objectContaining({ isAdminCookieSet: false }),
    );
  });

  it('reports a verified admin session cookie to the decision', async () => {
    cookieStore.mockResolvedValue(
      createCookieStore({ [ADMIN_SESSION_COOKIE]: 'v1.payload.signature' }),
    );
    verifyAdminSession.mockResolvedValue({ email: 'owner@example.com' });

    await getCurrentAdminAccessDecision();

    expect(verifyAdminSession).toHaveBeenCalledWith({
      cookie: 'v1.payload.signature',
      secret: 'test-secret',
    });
    expect(accessDecision).toHaveBeenCalledWith(
      expect.objectContaining({ isAdminSessionValid: true }),
    );
  });

  it('reports an invalid admin session cookie as unverified', async () => {
    cookieStore.mockResolvedValue(
      createCookieStore({ [ADMIN_SESSION_COOKIE]: 'v1.payload.tampered' }),
    );
    verifyAdminSession.mockResolvedValue(null);

    await getCurrentAdminAccessDecision();

    expect(accessDecision).toHaveBeenCalledWith(
      expect.objectContaining({ isAdminSessionValid: false }),
    );
  });

  it('marks non-production runtimes as development', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    await getCurrentAdminAccessDecision();

    expect(accessDecision).toHaveBeenCalledWith(expect.objectContaining({ isDev: true }));
  });

  it('reads the Cloudflare Access email header into the decision input', async () => {
    headersList.mockResolvedValue(
      createHeadersList({ [ACCESS_EMAIL_HEADER]: 'owner@example.com' }),
    );

    await getCurrentAdminAccessDecision();

    expect(accessDecision).toHaveBeenCalledWith(
      expect.objectContaining({ userEmail: 'owner@example.com' }),
    );
  });
});

describe('isCurrentRequestAdmin', () => {
  beforeEach(stubAdminRequest);

  it('returns true when the current access decision is authorized', async () => {
    accessDecision.mockReturnValue({ isAuthorized: true });

    await expect(isCurrentRequestAdmin()).resolves.toBe(true);
  });

  it('returns false when the current access decision denies access', async () => {
    accessDecision.mockReturnValue({ isAuthorized: false });

    await expect(isCurrentRequestAdmin()).resolves.toBe(false);
  });
});
