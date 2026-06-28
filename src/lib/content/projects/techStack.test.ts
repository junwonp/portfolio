import { describe, expect, it } from 'vitest';

import { getProjectTechStackGroups } from '@/lib/content/projects/techStack';

describe('getProjectTechStackGroups', () => {
  it('keeps unknown tech stack entries visible instead of dropping them', () => {
    const groups = getProjectTechStackGroups(['React', 'Unknown Runtime'], 'en');

    expect(groups).toEqual([
      {
        id: 'frameworks',
        title: 'Frameworks',
        skills: ['React'],
      },
      {
        id: 'uncategorized',
        title: 'Other',
        skills: ['Unknown Runtime'],
      },
    ]);
  });
});
