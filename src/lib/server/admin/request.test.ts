import { afterEach, describe, expect, it, vi } from 'vitest';

const env = vi.hoisted(() => vi.fn());
vi.mock('next/headers', () => ({ cookies: vi.fn(), headers: vi.fn() }));
vi.mock('@/lib/server/infrastructure/database', () => ({ getCloudflareEnv: env }));

import { isAdminWriteEnabledForCurrentRuntime } from './request';

afterEach(() => vi.unstubAllEnvs());
describe('runtime admin write guard', () => {
  it('awaits preview bindings instead of falling back to production process env', async () => {
    vi.stubEnv('APP_ENV', 'production');
    env.mockResolvedValue({ APP_ENV: 'development', ALLOW_ADMIN_WRITES: 'false' });
    await expect(isAdminWriteEnabledForCurrentRuntime()).resolves.toBe(false);
  });
});
