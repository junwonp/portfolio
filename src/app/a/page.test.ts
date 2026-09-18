import { isValidElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
  accessDecision: vi.fn(),
  adminDashboard: vi.fn(() => null),
  adminLogin: vi.fn(() => null),
}));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('@/lib/server/admin/request', () => ({
  getCurrentAdminAccessDecision: mocks.accessDecision,
}));
vi.mock('@/components/admin/AdminDashboard', () => ({ AdminDashboard: mocks.adminDashboard }));
vi.mock('@/components/admin/AdminLogin', () => ({ AdminLogin: mocks.adminLogin }));

import AdminPage from './page';

const renderAdminPage = async (
  searchParams: Record<string, string | string[] | undefined> = {},
) => {
  const element = await AdminPage({ searchParams: Promise.resolve(searchParams) });

  if (!isValidElement<Record<string, unknown>>(element)) {
    throw new Error('expected the admin route to render a login or dashboard element');
  }

  return element;
};

beforeEach(() => {
  mocks.accessDecision.mockResolvedValue({
    isAuthorized: false,
    shouldSetAdminSessionCookie: false,
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('AdminPage session handoff', () => {
  it('redirects through the session route before rendering anything when requested', async () => {
    mocks.accessDecision.mockResolvedValue({
      isAuthorized: false,
      shouldSetAdminSessionCookie: true,
    });

    await expect(renderAdminPage()).rejects.toThrow('NEXT_REDIRECT:/a/session?returnTo=/a');

    expect(mocks.redirect).toHaveBeenCalledWith('/a/session?returnTo=/a');
    expect(mocks.adminLogin).not.toHaveBeenCalled();
    expect(mocks.adminDashboard).not.toHaveBeenCalled();
  });
});

describe('AdminPage authorization', () => {
  it('renders the login screen with the local flag inside a non-production environment', async () => {
    const element = await renderAdminPage();

    expect(element.type).toBe(mocks.adminLogin);
    expect(element.props).toEqual({ isLocal: true });
    expect(mocks.adminDashboard).not.toHaveBeenCalled();
  });

  it('drops the local flag in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const element = await renderAdminPage();

    expect(element.props).toEqual({ isLocal: false });
  });

  it('renders the dashboard with the resolved search params when authorized', async () => {
    mocks.accessDecision.mockResolvedValue({
      isAuthorized: true,
      shouldSetAdminSessionCookie: false,
    });
    const searchParams = { range: '7d', tab: 'sessions' };

    const element = await renderAdminPage(searchParams);

    expect(element.type).toBe(mocks.adminDashboard);
    expect(element.props.searchParams).toBe(searchParams);
    expect(mocks.adminLogin).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});
