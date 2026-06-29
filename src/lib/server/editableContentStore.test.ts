import { describe, expect, it } from 'vitest';

import {
  getProjectDetailContentOverride,
  getProjectDetailOverrides,
  getProjectTechStackOverride,
  getPublishedHomeOverride,
} from '@/lib/server/editableContentStore';

function createDbMock({
  allRows = [],
  firstRow = null,
}: {
  allRows?: Array<{ payload: string; target_key: string }>;
  firstRow?: { payload: string } | null;
}) {
  return {
    prepare: () => ({
      bind: () => ({
        all: async () => ({ results: allRows }),
        first: async () => firstRow,
        run: async () => ({}),
      }),
    }),
  } as unknown as D1Database;
}

describe('editableContentStore read helpers', () => {
  it('ignores malformed home override rows', async () => {
    const db = createDbMock({
      allRows: [
        {
          payload: JSON.stringify({ extra: true, tagline: 'Updated' }),
          target_key: 'introduction',
        },
      ],
    });

    await expect(getPublishedHomeOverride(db, 'ko')).resolves.toBeNull();
  });

  it('ignores malformed project detail rows', async () => {
    const db = createDbMock({
      allRows: [
        {
          payload: JSON.stringify({ extra: true, markdown: 'Updated section' }),
          target_key: 'agentic-workflow::overview',
        },
      ],
    });

    await expect(
      getProjectDetailOverrides(db, 'agentic-workflow', 'ko'),
    ).resolves.toEqual([]);
  });

  it('ignores malformed project tech stack rows', async () => {
    const db = createDbMock({
      firstRow: {
        payload: JSON.stringify({ list: ['React', 42] }),
      },
    });

    await expect(
      getProjectTechStackOverride(db, 'agentic-workflow', 'ko'),
    ).resolves.toBeNull();
  });

  it('reads project metadata, tech stack, and block overrides together', async () => {
    const db = createDbMock({
      allRows: [
        {
          payload: JSON.stringify({ title: 'Updated title' }),
          target_key: 'agentic-workflow::metadata',
        },
        {
          payload: JSON.stringify({ list: ['React', 'TypeScript'] }),
          target_key: 'agentic-workflow::techStack',
        },
        {
          payload: JSON.stringify({
            blocks: [{ id: 'overview', type: 'markdown', markdown: 'Updated' }],
          }),
          target_key: 'agentic-workflow::blocks',
        },
        {
          payload: JSON.stringify({ blocks: [] }),
          target_key: 'other-project::blocks',
        },
      ],
    });

    await expect(getProjectDetailContentOverride(db, 'agentic-workflow', 'ko')).resolves.toEqual({
      blocks: [{ id: 'overview', type: 'markdown', markdown: 'Updated' }],
      metadata: { title: 'Updated title' },
      techStack: ['React', 'TypeScript'],
    });
  });
});
