import { describe, expect, it, vi } from 'vitest';

const seed = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
vi.mock('@/lib/portfolio/catalog', () => ({ applicationProjectCatalog: [] }));
vi.mock('@/lib/server/admin/dashboardData', () => ({
  getAdminDashboardData: async () => ({ sessionFilters: {} }),
}));
vi.mock('@/lib/server/admin/request', () => ({
  isAdminWriteEnabledForCurrentRuntime: async () => true,
}));
vi.mock('@/lib/server/admin/seedDummyData', () => ({ seedDummySessions: seed }));
vi.mock('@/lib/server/infrastructure/database', () => ({ getDb: async () => ({}) }));
vi.mock('./DashboardClient', () => ({ DashboardClient: () => null }));

import { AdminDashboard } from './AdminDashboard';

describe('admin dashboard reads', () => {
  it('never seeds production data through a GET query', async () => {
    await AdminDashboard({ searchParams: { seed: '1' } });
    expect(seed).not.toHaveBeenCalled();
  });
});
