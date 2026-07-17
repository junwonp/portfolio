import type { ApplicationLink, ApplicationLinkRow } from '@/lib/server/application-links/model';
import { toApplicationLink } from '@/lib/server/application-links/model';

const isMissingApplicationLinksTableError = (error: unknown): boolean =>
  error instanceof Error && error.message.includes('no such table: application_links');

export const getActiveApplicationLinkBySlug = async (
  db: D1Database,
  slug: string,
): Promise<ApplicationLink | null> => {
  try {
    const row = await db
      .prepare(
        `SELECT id, slug, label, company_name as company_name, role, summary_preset as summary_preset, project_ids as project_ids, expires_at, created_at
         FROM application_links
         WHERE slug = ? AND expires_at > datetime('now')
         LIMIT 1`,
      )
      .bind(slug)
      .first<ApplicationLinkRow>();

    return row ? toApplicationLink(row) : null;
  } catch (error) {
    if (isMissingApplicationLinksTableError(error)) {
      return null;
    }

    throw error;
  }
};
