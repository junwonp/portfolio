import { getCurrentAdminAccessDecision } from '@/lib/server/adminRequest';

import { AdminDashboard } from './AdminDashboard';
import { AdminLogin } from './AdminLogin';

export default async function AdminPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const isDev = process.env.NODE_ENV !== 'production';
  const accessDecision = await getCurrentAdminAccessDecision();

  if (!accessDecision.isAuthorized) {
    return <AdminLogin isLocal={isDev} />;
  }

  return <AdminDashboard searchParams={searchParams} />;
}
