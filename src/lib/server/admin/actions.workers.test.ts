// @module-tag runtime
import { env } from 'cloudflare:workers';
import type { MockInstance } from 'vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  OWNER_DEVICE_COOKIE,
  OWNER_DEVICE_COOKIE_MAX_AGE,
} from '@/lib/server/admin/access';
import { ADMIN_SESSION_COOKIE } from '@/lib/server/admin/session';
import { ensureAnalyticsStorageSchema } from '@/lib/server/analytics/schema';
import { APPLICATION_LINK_TTL_DAYS } from '@/lib/server/application-links/model';
import { applyDeployedSchema } from '@/lib/server/infrastructure/testD1Schema';
import { APPLICATION_SLUG_LENGTH, isReservedApplicationSlug } from '@/lib/utils/applicationSlug';

const mocks = vi.hoisted(() => {
  // `redirect()` is a control-flow throw: a no-op mock would let the action run past it and mutate.
  const redirect = vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  });

  return {
    accessConfig: vi.fn(),
    cookies: vi.fn(),
    db: undefined as D1Database | undefined,
    headers: vi.fn(),
    isAdmin: vi.fn(),
    isWriteEnabled: vi.fn(),
    normalizeProjectIds: vi.fn(),
    redirect,
    revalidatePath: vi.fn(),
  };
});

vi.mock('next/headers', () => ({ cookies: mocks.cookies, headers: mocks.headers }));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('@/lib/server/admin/request', () => ({
  isAdminWriteEnabledForCurrentRuntime: mocks.isWriteEnabled,
  isCurrentRequestAdmin: mocks.isAdmin,
}));
vi.mock('@/lib/server/admin/access', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/server/admin/access')>();

  return { ...actual, getCloudflareAccessConfig: mocks.accessConfig };
});
// `getDb()` would read the real env and make the missing-database branches unreachable; defaulting to the real binding keeps writes on real SQLite.
vi.mock('@/lib/server/infrastructure/database', () => ({
  getCloudflareEnv: async () => ({ portfolio_db: mocks.db }),
  getDb: async () => mocks.db,
}));
// The catalog imports project `.mdx` files the workers project has no loader for; only the id normalizer is needed.
vi.mock('@/lib/portfolio/catalog', () => ({
  normalizeApplicationProjectIdentifiers: mocks.normalizeProjectIds,
}));

import { createApplicationLink, deleteApplicationLink, login, logout } from './actions';

const db = env.portfolio_db;

// The alphabet mirrors `generateApplicationSlug` so a generated slug is distinguishable from a stored one.
const GENERATED_SLUG_PATTERN = /^[23456789abcdefghijkmnopqrstuvwxyz]+$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface ApplicationLinkRow {
  companyName: string;
  deletedAt: string | null;
  expiresAt: string;
  label: string;
  projectIds: string;
  role: string | null;
  slug: string;
  summaryPreset: string;
}

const LINK_COLUMNS = `slug, label, company_name AS companyName, role, summary_preset AS summaryPreset,
              project_ids AS projectIds, expires_at AS expiresAt, deleted_at AS deletedAt`;

const readLink = (id: number) =>
  db
    .prepare(`SELECT ${LINK_COLUMNS} FROM application_links WHERE id = ?`)
    .bind(id)
    .first<ApplicationLinkRow>();

const readLinkBySlug = (slug: string) =>
  db
    .prepare(`SELECT ${LINK_COLUMNS} FROM application_links WHERE slug = ?`)
    .bind(slug)
    .first<ApplicationLinkRow>();

const countLinks = async (): Promise<number> => {
  const row = await db
    .prepare('SELECT count(*) AS count FROM application_links')
    .first<{ count: number }>();

  return row?.count ?? 0;
};

// The INSERT does not choose an id, so the newest row is the one the action just wrote.
const readLatestLink = () =>
  db
    .prepare(`SELECT ${LINK_COLUMNS} FROM application_links ORDER BY id DESC LIMIT 1`)
    .first<ApplicationLinkRow>();

const toEpochMillis = (sqlDateTime: string): number =>
  Date.parse(`${sqlDateTime.replace(' ', 'T')}Z`);

const seedLink = (id: number, slug: string, deletedAt: string | null = null) =>
  db
    .prepare(
      `INSERT INTO application_links
         (id, slug, label, company_name, role, summary_preset, project_ids, expires_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      slug,
      'Seeded label',
      'Seeded Corp',
      'web',
      'web',
      '[]',
      '2099-01-01 00:00:00',
      deletedAt,
    )
    .run();

const setFormValue = (formData: FormData, key: string, value: string | readonly string[]): void => {
  if (typeof value === 'string') {
    formData.set(key, value);
    return;
  }

  for (const item of value) {
    formData.append(key, item);
  }
};

const createFormData = (values: Record<string, string | readonly string[]>): FormData => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    setFormValue(formData, key, value);
  }

  return formData;
};

const createCookieStore = () => ({ delete: vi.fn(), get: vi.fn(), set: vi.fn() });

const createHeadersList = (values: Record<string, string> = {}) => ({
  get: vi.fn((name: string) => values[name] ?? null),
});

let cookieStore: ReturnType<typeof createCookieStore>;
let consoleError: MockInstance<typeof console.error>;

beforeAll(async () => {
  await applyDeployedSchema(db);
  // `deleted_at` ships via the analytics schema guard, not schema.sql; run that migration so the soft-delete exercises the real column.
  await ensureAnalyticsStorageSchema(db);
});

beforeEach(() => {
  mocks.db = env.portfolio_db;
  mocks.isAdmin.mockResolvedValue(true);
  mocks.isWriteEnabled.mockResolvedValue(true);
  mocks.normalizeProjectIds.mockImplementation((identifiers: readonly string[]) => [
    ...new Set(identifiers),
  ]);
  mocks.accessConfig.mockReturnValue(null);
  mocks.headers.mockResolvedValue(createHeadersList({ host: 'junwon.dev' }));
  cookieStore = createCookieStore();
  mocks.cookies.mockResolvedValue(cookieStore);
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleError.mockRestore();
  vi.unstubAllEnvs();
});

describe('login', () => {
  it('sets the admin and owner-device cookies before redirecting to the dashboard', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    await expect(login()).rejects.toThrow('NEXT_REDIRECT:/a');

    expect(cookieStore.set).toHaveBeenCalledWith(ADMIN_COOKIE, 'true', {
      httpOnly: true,
      maxAge: ADMIN_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'strict',
      secure: false,
    });
    expect(cookieStore.set).toHaveBeenCalledWith(OWNER_DEVICE_COOKIE, 'true', {
      httpOnly: true,
      maxAge: OWNER_DEVICE_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      secure: false,
    });
    expect(mocks.redirect).toHaveBeenCalledWith('/a');
  });

  it('reports an unauthorized login instead of setting cookies in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    await expect(login()).resolves.toEqual({ unauthorized: true });

    expect(mocks.cookies).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});

describe('logout', () => {
  it('clears every admin cookie and returns to the dashboard when Access is not configured', async () => {
    await expect(logout()).rejects.toThrow('NEXT_REDIRECT:/a');

    expect(cookieStore.delete.mock.calls).toEqual([
      [ADMIN_SESSION_COOKIE],
      [ADMIN_COOKIE],
      [OWNER_DEVICE_COOKIE],
    ]);
    expect(mocks.redirect).toHaveBeenCalledWith('/a');
  });

  it('redirects to the Cloudflare Access logout URL with an https return origin', async () => {
    mocks.accessConfig.mockReturnValue({
      policyAudiences: ['test-aud'],
      teamDomain: 'https://team.cloudflareaccess.com',
    });

    const expectedReturnTo = encodeURIComponent('https://junwon.dev/a');

    await expect(logout()).rejects.toThrow(
      `NEXT_REDIRECT:https://team.cloudflareaccess.com/cdn-cgi/access/logout?returnTo=${expectedReturnTo}`,
    );

    expect(cookieStore.delete).toHaveBeenCalledTimes(3);
  });

  it('builds a plain-http return origin for a localhost host', async () => {
    mocks.accessConfig.mockReturnValue({
      policyAudiences: ['test-aud'],
      teamDomain: 'https://team.cloudflareaccess.com',
    });
    mocks.headers.mockResolvedValue(createHeadersList({ host: 'localhost:3000' }));

    const expectedReturnTo = encodeURIComponent('http://localhost:3000/a');

    await expect(logout()).rejects.toThrow(
      `NEXT_REDIRECT:https://team.cloudflareaccess.com/cdn-cgi/access/logout?returnTo=${expectedReturnTo}`,
    );
  });

  it('falls back to junwon.dev when the request has no host header', async () => {
    mocks.accessConfig.mockReturnValue({
      policyAudiences: ['test-aud'],
      teamDomain: 'https://team.cloudflareaccess.com',
    });
    mocks.headers.mockResolvedValue(createHeadersList());

    const expectedReturnTo = encodeURIComponent('https://junwon.dev/a');

    await expect(logout()).rejects.toThrow(
      `NEXT_REDIRECT:https://team.cloudflareaccess.com/cdn-cgi/access/logout?returnTo=${expectedReturnTo}`,
    );
  });

  it('sends an unauthorized logout back to the dashboard without clearing cookies', async () => {
    mocks.isAdmin.mockResolvedValue(false);

    await expect(logout()).rejects.toThrow('NEXT_REDIRECT:/a');

    expect(mocks.cookies).not.toHaveBeenCalled();
    expect(cookieStore.delete).not.toHaveBeenCalled();
  });
});

describe('deleteApplicationLink', () => {
  it('rejects an unauthorized caller before checking whether writes are enabled', async () => {
    mocks.isAdmin.mockResolvedValue(false);
    mocks.isWriteEnabled.mockResolvedValue(false);
    await seedLink(101, 'delete-unauthorized');

    const formData = createFormData({ linkId: '101' });

    await expect(deleteApplicationLink(formData)).rejects.toThrow('Admin access is required');

    expect(mocks.isWriteEnabled).not.toHaveBeenCalled();
    await expect(readLink(101)).resolves.toMatchObject({ deletedAt: null });
  });

  it('rejects an authorized caller when admin writes are disabled for the runtime', async () => {
    mocks.isWriteEnabled.mockResolvedValue(false);
    await seedLink(102, 'delete-writes-disabled');

    const formData = createFormData({ linkId: '102' });

    await expect(deleteApplicationLink(formData)).rejects.toThrow(
      'Admin writes are disabled in this environment',
    );

    await expect(readLink(102)).resolves.toMatchObject({ deletedAt: null });
  });

  it('ignores a linkId that is not a positive integer', async () => {
    await seedLink(103, 'delete-invalid-id');

    for (const linkId of ['abc', '0', '-4', '1.5']) {
      const formData = createFormData({ linkId });

      await expect(deleteApplicationLink(formData)).resolves.toBeUndefined();
    }

    await expect(deleteApplicationLink(createFormData({}))).resolves.toBeUndefined();

    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    await expect(readLink(103)).resolves.toMatchObject({ deletedAt: null });
  });

  it('soft-deletes the row and revalidates the admin page', async () => {
    await seedLink(104, 'delete-happy');

    await expect(deleteApplicationLink(createFormData({ linkId: '104' }))).resolves.toBeUndefined();

    const row = await readLink(104);
    expect(row?.deletedAt).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/a');
  });

  it('leaves an already soft-deleted row untouched', async () => {
    await seedLink(105, 'delete-idempotent', '2020-01-01 00:00:00');

    await expect(deleteApplicationLink(createFormData({ linkId: '105' }))).resolves.toBeUndefined();

    await expect(readLink(105)).resolves.toMatchObject({ deletedAt: '2020-01-01 00:00:00' });
  });

  it('returns without touching the database when the binding is missing', async () => {
    mocks.db = undefined;

    await expect(deleteApplicationLink(createFormData({ linkId: '106' }))).resolves.toBeUndefined();

    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});

describe('createApplicationLink', () => {
  it('rejects an unauthorized caller before checking whether writes are enabled', async () => {
    mocks.isAdmin.mockResolvedValue(false);
    mocks.isWriteEnabled.mockResolvedValue(false);
    const countBefore = await countLinks();

    const formData = createFormData({ companyName: 'Acme Corp' });

    await expect(createApplicationLink(formData)).rejects.toThrow('Admin access is required');

    expect(mocks.isWriteEnabled).not.toHaveBeenCalled();
    await expect(countLinks()).resolves.toBe(countBefore);
  });

  it('rejects an authorized caller when admin writes are disabled for the runtime', async () => {
    mocks.isWriteEnabled.mockResolvedValue(false);
    const countBefore = await countLinks();

    const formData = createFormData({ companyName: 'Acme Corp' });

    await expect(createApplicationLink(formData)).rejects.toThrow(
      'Admin writes are disabled in this environment',
    );

    await expect(countLinks()).resolves.toBe(countBefore);
  });

  it('logs and returns when the database binding is missing', async () => {
    mocks.db = undefined;

    await expect(
      createApplicationLink(createFormData({ companyName: 'Acme Corp' })),
    ).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalledWith('Database missing');
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it('inserts a custom-slug link with its label, role, preset and project ids', async () => {
    const before = Date.now();
    const formData = createFormData({
      companyName: 'Acme Corp',
      label: 'Acme application',
      positioning: 'mobile',
      projectIds: ['portfolio', 'aira', 'portfolio'],
      slug: ' Acme-Demo ',
      ttlDays: '30',
    });

    const after = Date.now();

    await expect(createApplicationLink(formData)).rejects.toThrow('NEXT_REDIRECT:/a?tab=links');

    const row = await readLinkBySlug('acme-demo');
    expect(row).toMatchObject({
      companyName: 'Acme Corp',
      deletedAt: null,
      label: 'Acme application',
      projectIds: '["portfolio","aira"]',
      role: 'mobile',
      slug: 'acme-demo',
      summaryPreset: 'rn',
    });

    const expiresAt = toEpochMillis(row?.expiresAt ?? '');
    expect(expiresAt).toBeGreaterThanOrEqual(before + 30 * MS_PER_DAY - 1000);
    expect(expiresAt).toBeLessThanOrEqual(after + 30 * MS_PER_DAY);
  });

  it('falls back to the company name as the label and truncates both fields', async () => {
    const formData = createFormData({
      companyName: 'C'.repeat(200),
      label: '',
      ttlDays: '1',
    });

    await expect(createApplicationLink(formData)).rejects.toThrow('NEXT_REDIRECT:/a?tab=links');

    const row = await readLatestLink();
    expect(row?.companyName).toBe('C'.repeat(120));
    expect(row?.label).toBe('C'.repeat(120));
  });

  it('truncates an over-long explicit label to 160 characters', async () => {
    const formData = createFormData({
      companyName: 'Acme Corp',
      label: 'L'.repeat(200),
      slug: 'long-label',
      ttlDays: '1',
    });

    await expect(createApplicationLink(formData)).rejects.toThrow('NEXT_REDIRECT:/a?tab=links');

    const row = await readLinkBySlug('long-label');
    expect(row?.label).toBe('L'.repeat(160));
    expect(row?.companyName).toBe('Acme Corp');
  });

  it('stores an empty company name when the form supplies neither field', async () => {
    const formData = createFormData({ slug: 'no-company', ttlDays: '1' });

    await expect(createApplicationLink(formData)).rejects.toThrow('NEXT_REDIRECT:/a?tab=links');

    await expect(readLinkBySlug('no-company')).resolves.toMatchObject({
      companyName: '',
      label: '',
    });
  });

  it('generates a clash-free slug when the custom slug is reserved', async () => {
    const formData = createFormData({
      companyName: 'Acme Corp',
      positioning: 'default',
      slug: 'admin',
      ttlDays: '1',
    });

    await expect(createApplicationLink(formData)).rejects.toThrow('NEXT_REDIRECT:/a?tab=links');

    const row = await readLatestLink();
    expect(row?.slug).toHaveLength(APPLICATION_SLUG_LENGTH);
    expect(row?.slug).toMatch(GENERATED_SLUG_PATTERN);
    expect(isReservedApplicationSlug(row?.slug ?? '')).toBe(false);
  });

  it('generates a slug when none is supplied', async () => {
    const formData = createFormData({ companyName: 'Acme Corp', ttlDays: '1' });

    await expect(createApplicationLink(formData)).rejects.toThrow('NEXT_REDIRECT:/a?tab=links');

    const row = await readLatestLink();
    expect(row?.slug).toHaveLength(APPLICATION_SLUG_LENGTH);
    expect(row?.slug).toMatch(GENERATED_SLUG_PATTERN);
  });

  it('maps every positioning preset to its role and summary preset', async () => {
    const cases = [
      { expectedPreset: 'rn', expectedRole: 'mobile', positioning: 'mobile' },
      { expectedPreset: 'ai', expectedRole: 'ai', positioning: 'ai' },
      { expectedPreset: 'ops-data', expectedRole: 'web', positioning: 'ops-data' },
      { expectedPreset: 'web-rn', expectedRole: 'web', positioning: 'web-rn' },
      { expectedPreset: 'default', expectedRole: null, positioning: 'default' },
      { expectedPreset: 'web', expectedRole: 'web', positioning: 'web' },
    ];

    for (const [index, presetCase] of cases.entries()) {
      const formData = createFormData({
        companyName: `Preset ${presetCase.positioning}`,
        positioning: presetCase.positioning,
        slug: `preset-${index}`,
        ttlDays: '1',
      });

      await expect(createApplicationLink(formData)).rejects.toThrow('NEXT_REDIRECT:/a?tab=links');

      const row = await readLinkBySlug(`preset-${index}`);
      expect(row).toMatchObject({
        role: presetCase.expectedRole,
        summaryPreset: presetCase.expectedPreset,
      });
    }
  });

  it('drops empty project ids and stores the survivors as JSON', async () => {
    const formData = createFormData({
      companyName: 'Acme Corp',
      projectIds: ['', 'portfolio', ''],
      slug: 'project-ids',
      ttlDays: '1',
    });

    await expect(createApplicationLink(formData)).rejects.toThrow('NEXT_REDIRECT:/a?tab=links');

    await expect(readLinkBySlug('project-ids')).resolves.toMatchObject({
      projectIds: '["portfolio"]',
    });
  });

  it('clamps the TTL to 1-90 days and falls back to 60 for a non-numeric value', async () => {
    const cases = [
      { expectedDays: 1, ttlDays: '0' },
      { expectedDays: 90, ttlDays: '500' },
      { expectedDays: 60, ttlDays: 'abc' },
      { expectedDays: APPLICATION_LINK_TTL_DAYS, ttlDays: '' },
    ];

    for (const [index, ttlCase] of cases.entries()) {
      const before = Date.now();
      const formData = createFormData({
        companyName: `TTL ${ttlCase.expectedDays}`,
        slug: `ttl-${index}`,
        ttlDays: ttlCase.ttlDays,
      });

      await expect(createApplicationLink(formData)).rejects.toThrow('NEXT_REDIRECT:/a?tab=links');

      const after = Date.now();
      const row = await readLinkBySlug(`ttl-${index}`);
      const expiresAt = toEpochMillis(row?.expiresAt ?? '');

      expect(expiresAt).toBeGreaterThanOrEqual(before + ttlCase.expectedDays * MS_PER_DAY - 1000);
      expect(expiresAt).toBeLessThanOrEqual(after + ttlCase.expectedDays * MS_PER_DAY);
    }
  });

  it('logs and returns without redirecting when the slug already exists', async () => {
    await seedLink(9001, 'taken-slug');

    const formData = createFormData({
      companyName: 'Acme Corp',
      slug: 'taken-slug',
      ttlDays: '1',
    });

    await expect(createApplicationLink(formData)).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalledWith('Failed to create link', expect.any(Error));
    expect(mocks.redirect).not.toHaveBeenCalled();
    await expect(readLink(9001)).resolves.toMatchObject({ companyName: 'Seeded Corp' });
  });
});
