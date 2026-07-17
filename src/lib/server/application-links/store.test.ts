import { describe, expect, it } from 'vitest';

import { normalizeApplicationProjectIds } from '@/lib/server/application-links/model';
import { getActiveApplicationLinkBySlug } from '@/lib/server/application-links/store';

class ApplicationLinkDbMock {
  constructor(
    private readonly options: {
      missingTable?: boolean;
      row?: {
        company_name: string;
        created_at: string;
        expires_at: string;
        id: number;
        label: string;
        project_ids: string;
        role: string | null;
        slug: string;
        summary_preset: string;
      } | null;
    },
  ) {}

  prepare() {
    return {
      bind: () => ({
        first: async () => {
          if (this.options.missingTable) {
            throw new Error('D1_ERROR: no such table: application_links: SQLITE_ERROR');
          }

          return this.options.row ?? null;
        },
      }),
    };
  }
}

describe('getActiveApplicationLinkBySlug', () => {
  it('normalizes submitted project identifiers before persistence', () => {
    expect(
      normalizeApplicationProjectIds([
        'today-weather',
        'day-planner',
        'today_weather',
        'unknown-project',
        'aira',
      ]),
    ).toEqual(['today_weather', 'day_planner', 'aira']);
  });

  it('returns null when the application links table is not provisioned locally', async () => {
    const db = new ApplicationLinkDbMock({ missingTable: true });

    await expect(
      getActiveApplicationLinkBySlug(db as unknown as D1Database, 'abcd'),
    ).resolves.toBeNull();
  });

  it('maps active application link rows to domain objects', async () => {
    const db = new ApplicationLinkDbMock({
      row: {
        company_name: 'Example',
        created_at: '2026-06-28 00:00:00',
        expires_at: '2026-07-28 00:00:00',
        id: 1,
        label: 'Frontend',
        project_ids: '["today_weather"]',
        role: 'web',
        slug: 'abcd',
        summary_preset: 'web',
      },
    });

    await expect(
      getActiveApplicationLinkBySlug(db as unknown as D1Database, 'abcd'),
    ).resolves.toMatchObject({
      companyName: 'Example',
      id: 1,
      projectIds: ['today_weather'],
      role: 'web',
      slug: 'abcd',
      summaryPreset: 'web',
    });
  });

  it('normalizes stored project slugs to canonical project ids', async () => {
    const db = new ApplicationLinkDbMock({
      row: {
        company_name: 'Example',
        created_at: '2026-06-28 00:00:00',
        expires_at: '2026-07-28 00:00:00',
        id: 1,
        label: 'Frontend',
        project_ids: '["today-weather","day-planner","unknown-project","today_weather"]',
        role: 'web',
        slug: 'abcd',
        summary_preset: 'web',
      },
    });

    await expect(
      getActiveApplicationLinkBySlug(db as unknown as D1Database, 'abcd'),
    ).resolves.toMatchObject({
      projectIds: ['today_weather', 'day_planner'],
    });
  });
});
