import { describe, expect, it } from 'vitest';

import {
  calculateArticleProgress,
  calculateScrollDepth,
  selectFarthestVisibleSection,
} from '@/lib/components/analyticsEngagement';

describe('analytics engagement helpers', () => {
  it('calculates document scroll depth as a clamped percentage', () => {
    expect(calculateScrollDepth({ clientHeight: 1000, scrollHeight: 3000, scrollTop: 1000 })).toBe(
      50,
    );
    expect(calculateScrollDepth({ clientHeight: 1000, scrollHeight: 1000, scrollTop: 400 })).toBe(
      0,
    );
    expect(calculateScrollDepth({ clientHeight: 1000, scrollHeight: 3000, scrollTop: 3000 })).toBe(
      100,
    );
  });

  it('calculates article progress from viewport bottom through the article', () => {
    expect(
      calculateArticleProgress({
        articleHeight: 2000,
        articleTop: 500,
        viewportBottom: 1500,
      }),
    ).toBe(50);
    expect(
      calculateArticleProgress({
        articleHeight: 2000,
        articleTop: 500,
        viewportBottom: 200,
      }),
    ).toBe(0);
    expect(
      calculateArticleProgress({
        articleHeight: 2000,
        articleTop: 500,
        viewportBottom: 2800,
      }),
    ).toBe(100);
  });

  it('keeps the farthest visible section reached so far', () => {
    const sections = [
      { id: 'overview', label: 'Overview', top: 500 },
      { id: 'architecture', label: 'Architecture', top: 1400 },
      { id: 'retrospective', label: 'Retrospective', top: 2600 },
    ];

    const first = selectFarthestVisibleSection({
      current: undefined,
      sections,
      viewportBottom: 1500,
    });
    const second = selectFarthestVisibleSection({
      current: first,
      sections,
      viewportBottom: 900,
    });
    const third = selectFarthestVisibleSection({
      current: second,
      sections,
      viewportBottom: 3000,
    });

    expect(first).toEqual({ id: 'architecture', index: 1, label: 'Architecture' });
    expect(second).toEqual(first);
    expect(third).toEqual({ id: 'retrospective', index: 2, label: 'Retrospective' });
  });
});
