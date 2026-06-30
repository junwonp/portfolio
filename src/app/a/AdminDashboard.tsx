import { applicationProjectCatalog } from '@/lib/content/projects';
import type { AdminDashboardSearchParams } from '@/lib/server/adminDashboardData';
import { getAdminDashboardData } from '@/lib/server/adminDashboardData';
import { isAdminWriteEnabledForCurrentRuntime } from '@/lib/server/adminRequest';
import { getDb } from '@/lib/server/db';

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

  return <DashboardClient {...dashboardData} />;
}
