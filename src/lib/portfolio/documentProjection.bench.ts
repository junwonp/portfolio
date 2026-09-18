import { bench, describe } from 'vitest';

import { buildPortfolioDocument } from '@/lib/portfolio/documentProjection';

// The A4 /portfolio route projects resume data plus the MDX catalog on every uncached render, the document's real per-request hot path.
describe('buildPortfolioDocument', () => {
  bench('ko', () => {
    buildPortfolioDocument('ko');
  });

  bench('en', () => {
    buildPortfolioDocument('en');
  });
});
