import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  accessConfig: vi.fn(),
  createSessionCookie: vi.fn(),
  env: vi.fn(),
  sessionSecret: vi.fn(),
  verifyAccessJwt: vi.fn(),
}));

vi.mock('@/lib/server/infrastructure/database', () => ({ getCloudflareEnv: mocks.env }));
vi.mock('@/lib/server/admin/access', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/server/admin/access')>();

  return {
    ...actual,
    getCloudflareAccessConfig: mocks.accessConfig,
    verifyCloudflareAccessJwt: mocks.verifyAccessJwt,
  };
});
vi.mock('@/lib/server/admin/session', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/server/admin/session')>();

  return {
    ...actual,
    createAdminSessionCookie: mocks.createSessionCookie,
    getAdminSessionSecret: mocks.sessionSecret,
  };
});

import { OWNER_DEVICE_COOKIE, OWNER_DEVICE_COOKIE_MAX_AGE } from '@/lib/server/admin/access';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from '@/lib/server/admin/session';
import { GET } from './route';

const ACCESS_CONFIG = {
  policyAudiences: ['test-aud'],
  teamDomain: 'https://team.cloudflareaccess.com',
};

const createRequest = (url: string, token: string | null = 'access-token') => {
  const headers = new Headers();
  if (token !== null) {
    headers.set('Cf-Access-Jwt-Assertion', token);
  }

  return new NextRequest(url, { headers });
};

beforeEach(() => {
  mocks.env.mockResolvedValue({ ADMIN_SESSION_SECRET: 'test-secret' });
  mocks.accessConfig.mockReturnValue(ACCESS_CONFIG);
  mocks.sessionSecret.mockReturnValue('test-secret');
  mocks.verifyAccessJwt.mockResolvedValue({
    aud: 'test-aud',
    email: 'owner@example.com',
    iss: 'https://team.cloudflareaccess.com',
  });
  mocks.createSessionCookie.mockResolvedValue('v1.payload.signature');
});

describe('admin session route', () => {
  it('answers 500 when Cloudflare Access is not configured', async () => {
    mocks.accessConfig.mockReturnValue(null);

    const response = await GET(createRequest('https://junwon.dev/a/session'));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Admin session is not configured' });
    expect(mocks.verifyAccessJwt).not.toHaveBeenCalled();
    expect(mocks.createSessionCookie).not.toHaveBeenCalled();
  });

  it('answers 500 when the admin session secret is missing', async () => {
    mocks.sessionSecret.mockReturnValue(null);

    const response = await GET(createRequest('https://junwon.dev/a/session'));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Admin session is not configured' });
    expect(mocks.verifyAccessJwt).not.toHaveBeenCalled();
  });

  it('answers 401 when the Access JWT is absent or invalid', async () => {
    mocks.verifyAccessJwt.mockResolvedValue(null);

    const response = await GET(createRequest('https://junwon.dev/a/session', null));

    expect(mocks.verifyAccessJwt).toHaveBeenCalledWith({ config: ACCESS_CONFIG, token: null });
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Admin access is required' });
    expect(mocks.createSessionCookie).not.toHaveBeenCalled();
  });

  it('answers 401 when the verified Access claims carry only whitespace as the email', async () => {
    mocks.verifyAccessJwt.mockResolvedValue({
      aud: 'test-aud',
      email: '   ',
      iss: 'https://team.cloudflareaccess.com',
    });

    const response = await GET(createRequest('https://junwon.dev/a/session'));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Admin access is required' });
  });

  it('sets the session and owner-device cookies and redirects to the requested /a target', async () => {
    const response = await GET(
      createRequest('https://junwon.dev/a/session?returnTo=%2Fa%2Fanalytics%3Frange%3D7d'),
    );

    expect(mocks.verifyAccessJwt).toHaveBeenCalledWith({
      config: ACCESS_CONFIG,
      token: 'access-token',
    });
    expect(mocks.createSessionCookie).toHaveBeenCalledWith({
      email: 'owner@example.com',
      secret: 'test-secret',
    });
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://junwon.dev/a/analytics?range=7d');
    expect(response.cookies.get(ADMIN_SESSION_COOKIE)).toMatchObject({
      httpOnly: true,
      maxAge: ADMIN_SESSION_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      secure: true,
      value: 'v1.payload.signature',
    });
    expect(response.cookies.get(OWNER_DEVICE_COOKIE)).toMatchObject({
      httpOnly: true,
      maxAge: OWNER_DEVICE_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      secure: true,
      value: 'true',
    });
  });

  it('redirects to the dashboard when no returnTo is requested', async () => {
    const response = await GET(createRequest('https://junwon.dev/a/session'));

    expect(response.headers.get('location')).toBe('https://junwon.dev/a');
  });

  it('redirects to the dashboard when the returnTo target leaves the admin surface', async () => {
    const response = await GET(
      createRequest(
        `https://junwon.dev/a/session?returnTo=${encodeURIComponent('https://evil.example/phish')}`,
      ),
    );

    expect(response.headers.get('location')).toBe('https://junwon.dev/a');
    expect(response.cookies.get(ADMIN_SESSION_COOKIE)?.value).toBe('v1.payload.signature');
  });

  it('marks the cookies insecure for a plain-http request', async () => {
    const response = await GET(createRequest('http://localhost:3000/a/session'));

    expect(response.headers.get('location')).toBe('http://localhost:3000/a');
    expect(response.cookies.get(ADMIN_SESSION_COOKIE)?.secure).toBe(false);
    expect(response.cookies.get(OWNER_DEVICE_COOKIE)?.secure).toBe(false);
  });
});
