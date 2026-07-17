import { redirect } from 'next/navigation';

import { getCurrentAdminAccessDecision } from '@/lib/server/admin/request';

import { AdminDashboard } from './_components/AdminDashboard';
import { AdminLogin } from './_components/AdminLogin';

export default async function AdminPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const isDev = process.env.NODE_ENV !== 'production';
  const accessDecision = await getCurrentAdminAccessDecision();

  if (accessDecision.shouldSetAdminSessionCookie) {
    redirect('/a/session?returnTo=/a');
  }

  if (!accessDecision.isAuthorized) {
    return <AdminLogin isLocal={isDev} />;
  }

  return <AdminDashboard searchParams={searchParams} />;
}
