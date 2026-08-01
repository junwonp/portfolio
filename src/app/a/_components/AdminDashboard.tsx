import { applicationProjectCatalog } from '@/lib/portfolio/catalog';
import type { AdminDashboardSearchParams } from '@/lib/server/admin/dashboardData';
import { getAdminDashboardData } from '@/lib/server/admin/dashboardData';
import { isAdminWriteEnabledForCurrentRuntime } from '@/lib/server/admin/request';
import { getDb } from '@/lib/server/infrastructure/database';
import { seedDummySessions } from '@/lib/server/admin/seedDummyData';

import { DashboardClient } from './DashboardClient';

export async function AdminDashboard({
  searchParams,
}: {
  searchParams: AdminDashboardSearchParams;
}) {
  const writesEnabled = isAdminWriteEnabledForCurrentRuntime();
  const db = getDb();

  if (!db && process.env.NODE_ENV !== 'development') {
    return (
      <div style={{ color: 'var(--color-error)', padding: '2rem', textAlign: 'center' }}>
        <p>Database is not bound. If local, run Next.js with Cloudflare bindings.</p>
      </div>
    );
  }

  const applicationProjectOptions = applicationProjectCatalog.map((project) => ({
    id: project.id,
    title: project.content.ko.title,
  }));
  const dashboardData = await getAdminDashboardData({
    applicationProjectOptions,
    db,
    searchParams,
    writesEnabled,
  });

  // Seed dummy data when ?seed=1 is present (after schema is ensured)
  const shouldSeed = searchParams.seed === '1';
  if (shouldSeed && db && writesEnabled) {
    await seedDummySessions(db).catch(() => {
      // Silently ignore seed errors
    });
  }

  return (
    <DashboardClient
      {...dashboardData}
      classification={dashboardData.sessionFilters.classification}
      timeRange={dashboardData.sessionFilters.timeRange}
    />
  );
}
