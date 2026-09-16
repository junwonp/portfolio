import { describe, expect, it } from 'vitest';

import {
  PAGE_CONTENT_HEIGHT_PX as HARNESS_CONTENT_HEIGHT_PX,
  PAGE_HEIGHT_PX as HARNESS_HEIGHT_PX,
} from '../../../scripts/lib/printLayout.mjs';

import {
  DOC_CONTENT_WIDTH_PX,
  PAGE_CONTENT_HEIGHT_PX,
  PAGE_HEIGHT_PX,
  PAGE_PADDING_BOTTOM_PX,
  PAGE_PADDING_TOP_PX,
  PAGE_RULE,
  PAGE_SIDE_PADDING,
  PAGE_WIDTH,
} from './pageGeometry';

describe('document geometry', () => {
  it('preserves the existing horizontal metrics and print margins', () => {
    expect(PAGE_WIDTH).toBe('8.27in');
    expect(DOC_CONTENT_WIDTH_PX).toBe(8.27 * 96 - 2 * 0.62 * 96);
    expect(PAGE_SIDE_PADDING).toBe('0.62in');
    expect(PAGE_PADDING_TOP_PX).toBe(57.6);
    expect(PAGE_PADDING_BOTTOM_PX).toBe(48);
    expect(PAGE_RULE).toBe('@page { size: 210mm 297mm; margin: 0.6in 0.62in 0.5in }');
  });

  it('uses exact A4 height snapped to the screen LayoutUnit grid', () => {
    expect(PAGE_HEIGHT_PX).toBe(1122.515625);
    expect(PAGE_CONTENT_HEIGHT_PX).toBe(1017);
  });

  it('gives the print-layout harness the same budget the document lays out against', () => {
    // scripts/lib/printLayout.mjs derives these from its own A4 constants; a
    // drift would make the standing gate reject a block the app paginates.
    expect(HARNESS_HEIGHT_PX).toBe(PAGE_HEIGHT_PX);
    expect(HARNESS_CONTENT_HEIGHT_PX).toBe(PAGE_CONTENT_HEIGHT_PX);
  });
});
