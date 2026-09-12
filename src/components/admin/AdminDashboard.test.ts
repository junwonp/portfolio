import { describe, expect, it, vi } from 'vitest';

const getAdminDashboardData = vi.hoisted(() => vi.fn().mockResolvedValue({ sessionFilters: {} }));
vi.mock('@/lib/portfolio/catalog', () => ({ applicationProjectCatalog: [] }));
vi.mock('@/lib/server/admin/dashboardData', () => ({ getAdminDashboardData }));
vi.mock('@/lib/server/admin/request', () => ({
  isAdminWriteEnabledForCurrentRuntime: async () => true,
}));
vi.mock('@/lib/server/infrastructure/database', () => ({ getDb: async () => ({}) }));
vi.mock('./DashboardClient', () => ({ DashboardClient: () => null }));

import { AdminDashboard } from './AdminDashboard';

describe('admin dashboard reads', () => {
  it('loads dashboard data for a GET request without seeding writes', async () => {
    await AdminDashboard({ searchParams: { seed: '1' } });

    expect(getAdminDashboardData).toHaveBeenCalledTimes(1);
  });
});
