import { describe, expect, it } from 'vitest';

import {
  evaluateLayout,
  PAGE_CONTENT_HEIGHT_PX,
  pageCountViolation,
  pdfPageCount,
} from './printLayout.mjs';

describe('pdfPageCount', () => {
  it('counts page objects and ignores the page tree', () => {
    const body = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] >>',
    ].join('\n');

    expect(pdfPageCount(Buffer.from(body, 'latin1'))).toBe(2);
  });
});

describe('evaluateLayout', () => {
  const layout = (blocks, groups = []) => ({ blocks, groups, pageCount: 13 });
  // The budget is derived, so the message is asserted against the constant the
  // harness actually uses; pageGeometry.test.ts locks that constant to the app's.
  const budgetLabel = `${PAGE_CONTENT_HEIGHT_PX.toFixed(2)}px`;

  it('reports no violation for items within the budget', () => {
    const result = evaluateLayout(
      layout([
        { label: 'aira', height: 817.09 },
        { label: "Today's Weather", height: 908.77 },
      ]),
    );

    expect(result.violations).toEqual([]);
    expect(result.worstBlock).toEqual({ label: "Today's Weather", height: 908.77 });
  });

  it('names the offending project when a block exceeds the budget', () => {
    const result = evaluateLayout(
      layout([
        { label: 'aira', height: 817.09 },
        { label: "Today's Weather", height: 1023.8 },
      ]),
    );

    expect(result.violations).toEqual([
      `project block “Today's Weather” measured 1023.80px against the ${budgetLabel} printable height`,
    ]);
  });

  it('names the offending section group when a heading and its first block exceed the budget', () => {
    const result = evaluateLayout(layout([], [{ label: '경력 + 아이라 (aira)', height: 1018.4 }]));

    expect(result.violations).toEqual([
      `section group “경력 + 아이라 (aira)” measured 1018.40px against the ${budgetLabel} printable height`,
    ]);
  });
});

describe('pageCountViolation', () => {
  it('passes when the preview and the PDF agree', () => {
    expect(pageCountViolation(13, 13)).toBeNull();
  });

  it('describes the disagreement when the preview under-reports', () => {
    expect(pageCountViolation(13, 14)).toBe('preview reports 13 page(s) but the PDF has 14');
  });
});
