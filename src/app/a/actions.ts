'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  OWNER_DEVICE_COOKIE,
  OWNER_DEVICE_COOKIE_MAX_AGE,
} from '@/lib/server/adminAccess';
import { isAdminWriteEnabledForCurrentRuntime, isCurrentRequestAdmin } from '@/lib/server/adminRequest';
import { ADMIN_SESSION_COOKIE } from '@/lib/server/adminSession';

export async function login() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (!isDev) {
    return { unauthorized: true };
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE, 'true', {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  cookieStore.set(OWNER_DEVICE_COOKIE, 'true', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: OWNER_DEVICE_COOKIE_MAX_AGE,
  });

  redirect('/a');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  cookieStore.delete(ADMIN_COOKIE);
  cookieStore.delete(OWNER_DEVICE_COOKIE);
  redirect('/a');
}

export async function deleteApplicationLink(formData: FormData) {
  if (!(await isCurrentRequestAdmin())) {
    throw new Error('Admin access is required');
  }
  if (!isAdminWriteEnabledForCurrentRuntime()) {
    throw new Error('Admin writes are disabled in this environment');
  }

  const linkIdStr = formData.get('linkId');
  const id = Number(linkIdStr);
  if (!Number.isInteger(id) || id < 1) return;

  const { getDb } = await import('@/lib/server/db');
  const db = getDb();
  if (!db) return;
  await db.batch([
    db.prepare('DELETE FROM application_link_visits WHERE application_link_id = ?').bind(id),
    db.prepare('DELETE FROM application_links WHERE id = ?').bind(id),
  ]);

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/a');
}

export async function createApplicationLink(formData: FormData): Promise<void> {
  if (!(await isCurrentRequestAdmin())) {
    throw new Error('Admin access is required');
  }
  if (!isAdminWriteEnabledForCurrentRuntime()) {
    throw new Error('Admin writes are disabled in this environment');
  }

  const { getDb } = await import('@/lib/server/db');
  const db = getDb();
  if (!db) {
    console.error('Database missing');
    return;
  }

  const {
    normalizeApplicationSlug,
    generateApplicationSlug,
    isReservedApplicationSlug,
    toSqlDateTime,
  } = await import('@/lib/server/applicationLinks');

  const getExpiresAt = (ttlDays: number): string => {
    const expiresAt = new Date();
    expiresAt.setUTCDate(expiresAt.getUTCDate() + ttlDays);
    return toSqlDateTime(expiresAt);
  };

  const companyName = ((formData.get('companyName') as string) || '').slice(0, 120);
  const customSlug = normalizeApplicationSlug((formData.get('slug') as string) || '');
  const label = ((formData.get('label') as string) || '').slice(0, 160) || companyName;
  const positioningStr = (formData.get('positioning') as string) || 'web';
  const ttlDays = Number(formData.get('ttlDays') || '60');
  const projectIds = formData.getAll('projectIds').filter(Boolean) as string[];

  let role: string | null = 'web';
  let summaryPreset = 'web';

  switch (positioningStr) {
    case 'mobile':
      role = 'mobile';
      summaryPreset = 'rn';
      break;
    case 'ai':
      role = 'ai';
      summaryPreset = 'ai';
      break;
    case 'ops-data':
      role = 'web';
      summaryPreset = 'ops-data';
      break;
    case 'web-rn':
      role = 'web';
      summaryPreset = 'web-rn';
      break;
    case 'default':
      role = null;
      summaryPreset = 'default';
      break;
    case 'web':
    default:
      role = 'web';
      summaryPreset = 'web';
      break;
  }

  const safeTtlDays = Number.isFinite(ttlDays)
    ? Math.min(Math.max(Math.round(ttlDays), 1), 90)
    : 60;
  const expiresAt = getExpiresAt(safeTtlDays);

  let slug = customSlug;
  if (!slug || isReservedApplicationSlug(slug)) {
    for (let attempt = 0; attempt < 12; attempt++) {
      const s = generateApplicationSlug();
      if (isReservedApplicationSlug(s)) continue;
      const existing = await db
        .prepare('SELECT id FROM application_links WHERE slug = ? LIMIT 1')
        .bind(s)
        .first();
      if (!existing) {
        slug = s;
        break;
      }
    }
  }

  try {
    await db
      .prepare(
        `INSERT INTO application_links (slug, label, company_name, role, summary_preset, project_ids, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(slug, label, companyName, role, summaryPreset, JSON.stringify(projectIds), expiresAt)
      .run();
  } catch (err) {
    console.error('Failed to create link', err);
    return;
  }

  redirect('/a');
}
