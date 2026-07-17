import { describe, expect, it } from 'vitest';

import {
  shouldForceProjectContentOpen,
  shouldRenderProjectDetails,
} from '@/components/portfolio/home/projectItemDisplay';

describe('project item display policy', () => {
  it('keeps detailed summary rows out of compact career project cards with a detail page', () => {
    expect(shouldRenderProjectDetails('compact', ['긴 상세 설명'], true)).toBe(false);
  });

  it('keeps summary rows visible for compact career project cards without a detail page', () => {
    expect(shouldRenderProjectDetails('compact', ['홈에서 유지할 요약'], false)).toBe(true);
  });

  it('renders detailed summary rows in the default full mode when content exists', () => {
    expect(shouldRenderProjectDetails(undefined, ['상세 설명'], true)).toBe(true);
    expect(shouldRenderProjectDetails('full', ['상세 설명'], true)).toBe(true);
  });

  it('does not render detailed summary rows when the project has no detail content', () => {
    expect(shouldRenderProjectDetails('full', [], false)).toBe(false);
  });

  it('opens compact career project content immediately so the detail link is visible', () => {
    expect(shouldForceProjectContentOpen('compact')).toBe(true);
    expect(shouldForceProjectContentOpen('full')).toBe(false);
    expect(shouldForceProjectContentOpen(undefined)).toBe(false);
  });
});
