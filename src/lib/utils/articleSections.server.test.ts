// Separate from articleSections.test.ts, which pins jsdom and so renders the SSR guard
// unreachable; the default node env has no `document`. The environment directive is
// deliberately not written out: Vitest scans the whole file for it and would switch us back to jsdom.
import { describe, expect, it } from 'vitest';

import { getArticleElement } from '@/lib/utils/articleSections';

describe('getArticleElement on the server', () => {
  it('returns null when document is undefined', () => {
    // Re-asserted so a defined `document` cannot make the assertion below vacuous.
    expect(typeof document).toBe('undefined');

    const element = getArticleElement();

    expect(element).toBeNull();
  });
});
