import type { RolePresetId, SummaryPresetId } from '@/lib/data/resume';
import { APPLICATION_SLUG_LENGTH } from '@/lib/utils/applicationSlug';

export {
  APPLICATION_SLUG_LENGTH,
  extractApplicationSlugFromPath,
  isReservedApplicationSlug,
  normalizeApplicationSlug,
  RESERVED_APPLICATION_SLUGS,
} from '@/lib/utils/applicationSlug';

export interface ApplicationLink {
  companyName: string;
  createdAt: string;
  expiresAt: string;
  id: number;
  label: string;
  projectIds: string[];
  role: RolePresetId | null;
  slug: string;
  summaryPreset: SummaryPresetId;
}

export interface ApplicationLinkRow {
  company_name: string;
  created_at: string;
  expires_at: string;
  id: number;
  label: string;
  project_ids: string;
  role: string | null;
  slug: string;
  summary_preset: string;
}

export interface ApplicationLinkStatsRow extends ApplicationLinkRow {
  avg_dwell_time: number | null;
  avg_scroll_depth: number | null;
  last_seen_at: string | null;
  sessions: number;
  views: number;
}

export interface ApplicationLinkStats extends ApplicationLink {
  avgDwellTime: number;
  avgScrollDepth: number;
  lastSeenAt: string | null;
  sessions: number;
  views: number;
}

export const APPLICATION_LINK_TTL_DAYS = 60;

const APPLICATION_SLUG_ALPHABET = '23456789abcdefghijkmnopqrstuvwxyz';

export const getDefaultExpiresAt = (date = new Date()): string => {
  const expiresAt = new Date(date);
  expiresAt.setUTCDate(expiresAt.getUTCDate() + APPLICATION_LINK_TTL_DAYS);

  return toSqlDateTime(expiresAt);
};

export const toSqlDateTime = (date: Date): string =>
  date.toISOString().replace('T', ' ').slice(0, 19);

export const generateApplicationSlug = (): string => {
  const values = crypto.getRandomValues(new Uint32Array(APPLICATION_SLUG_LENGTH));

  return Array.from(
    values,
    (value) => APPLICATION_SLUG_ALPHABET[value % APPLICATION_SLUG_ALPHABET.length],
  ).join('');
};

export const parseProjectIds = (value: string): string[] => {
  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
};

export const toApplicationLink = (row: ApplicationLinkRow): ApplicationLink => ({
  companyName: row.company_name,
  createdAt: row.created_at,
  expiresAt: row.expires_at,
  id: row.id,
  label: row.label,
  projectIds: parseProjectIds(row.project_ids),
  role: row.role === 'web' || row.role === 'mobile' || row.role === 'ai' ? row.role : null,
  slug: row.slug,
  summaryPreset:
    row.summary_preset === 'ops-data' ||
    row.summary_preset === 'web' ||
    row.summary_preset === 'rn' ||
    row.summary_preset === 'web-rn' ||
    row.summary_preset === 'ai'
      ? row.summary_preset
      : 'default',
});

export const toApplicationLinkStats = (row: ApplicationLinkStatsRow): ApplicationLinkStats => ({
  ...toApplicationLink(row),
  avgDwellTime: row.avg_dwell_time ?? 0,
  avgScrollDepth: row.avg_scroll_depth ?? 0,
  lastSeenAt: row.last_seen_at,
  sessions: row.sessions,
  views: row.views,
});
