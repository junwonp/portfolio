const PX_PER_INCH = 96;
const MM_PER_INCH = 25.4;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_TOP_IN = 0.6;
const MARGIN_SIDE_IN = 0.62;
const MARGIN_BOTTOM_IN = 0.5;

// Preserve the existing figure sizing and line wraps while deriving all widths from A4.
const SHEET_WIDTH_IN = Math.round((A4_WIDTH_MM / MM_PER_INCH) * 100) / 100;
export const PAGE_WIDTH = `${SHEET_WIDTH_IN}in`;
export const PAGE_SIDE_PADDING = `${MARGIN_SIDE_IN}in`;
const toCssPx = (inches: number): number => Math.round(inches * PX_PER_INCH * 100) / 100;
export const PAGE_PADDING_TOP_PX = toCssPx(MARGIN_TOP_IN);
export const PAGE_PADDING_BOTTOM_PX = toCssPx(MARGIN_BOTTOM_IN);
export const DOC_CONTENT_WIDTH_PX = SHEET_WIDTH_IN * PX_PER_INCH - 2 * MARGIN_SIDE_IN * PX_PER_INCH;
export const PAGE_GAP_PX = 24;
export const PAGE_HEIGHT_PX = Math.floor((A4_HEIGHT_MM / MM_PER_INCH) * PX_PER_INCH * 64) / 64;

// Chromium rounds the physical print content box to CSS pixels before layout:
// 1000px + 17px fits; adding one 1/64px LayoutUnit starts a second page.
export const PAGE_CONTENT_HEIGHT_PX = Math.round(
  (A4_HEIGHT_MM / MM_PER_INCH) * PX_PER_INCH - PAGE_PADDING_TOP_PX - PAGE_PADDING_BOTTOM_PX,
);
export const PAGE_RULE = `@page { size: ${A4_WIDTH_MM}mm ${A4_HEIGHT_MM}mm; margin: ${MARGIN_TOP_IN}in ${MARGIN_SIDE_IN}in ${MARGIN_BOTTOM_IN}in }`;
