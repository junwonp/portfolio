/*
 * The A4 invariant: every atomic document item — a project block, or a section
 * heading glued to its first block — must fit the printable content box. Nothing
 * enforces it today: one added bullet can push a block past the budget, the
 * screen preview can still report the old page count, and the PDF grows a page
 * with a project's title and image split across it.
 *
 * The arithmetic lives here, separate from the browser harness, so the failure
 * cases are unit-testable without a running dev server.
 *
 * The budget is derived from A4's physical size and the document's own @page
 * margins, not a literal, so the gate cannot disagree with the app about how
 * much content fits. pageGeometry.test.ts asserts the two stay equal.
 */

const PX_PER_INCH = 96;
const MM_PER_INCH = 25.4;
const A4_HEIGHT_MM = 297;
const MARGIN_TOP_IN = 0.6;
const MARGIN_BOTTOM_IN = 0.5;

const toCssPx = (inches) => Math.round(inches * PX_PER_INCH * 100) / 100;

/** Chromium snaps the printed page onto the 1/64px LayoutUnit grid. */
export const PAGE_HEIGHT_PX = Math.floor((A4_HEIGHT_MM / MM_PER_INCH) * PX_PER_INCH * 64) / 64;
export const PAGE_CONTENT_HEIGHT_PX = Math.round(
  (A4_HEIGHT_MM / MM_PER_INCH) * PX_PER_INCH - toCssPx(MARGIN_TOP_IN) - toCssPx(MARGIN_BOTTOM_IN),
);

const formatPx = (value) => `${value.toFixed(2)}px`;

/**
 * PDF page objects are plain `/Type /Page` dictionaries; `/Pages` and `/PageMode`
 * must not count, hence the negative lookahead. page.pdf() hands back a
 * Uint8Array whose own `toString` is a list of numbers, hence the Buffer wrap.
 */
export const pdfPageCount = (bytes) =>
  (
    Buffer.from(bytes)
      .toString('latin1')
      .match(/\/Type\s*\/Page(?![a-zA-Z])/g) ?? []
  ).length;

const heightOf = (item) => item.height;
const byHeightDesc = (a, b) => heightOf(b) - heightOf(a);

const overBudgetViolations = (items, kind, budget) =>
  items
    .filter((item) => item.height > budget)
    .map(
      (item) =>
        `${kind} “${item.label}” measured ${formatPx(item.height)} against the ${formatPx(budget)} printable height`,
    );

/**
 * `report` is the measured document: `blocks` are project blocks, `groups` are
 * section headings glued to their first block. Returns every violation plus the
 * tallest item per kind, so the caller can report headroom.
 */
export const evaluateLayout = (report, budget = PAGE_CONTENT_HEIGHT_PX) => {
  const blocks = [...report.blocks].sort(byHeightDesc);
  const groups = [...report.groups].sort(byHeightDesc);

  return {
    violations: [
      ...overBudgetViolations(report.blocks, 'project block', budget),
      ...overBudgetViolations(report.groups, 'section group', budget),
    ],
    worstBlock: blocks[0] ?? null,
    worstGroup: groups[0] ?? null,
  };
};

export const pageCountViolation = (simulated, actual) =>
  simulated === actual ? null : `preview reports ${simulated} page(s) but the PDF has ${actual}`;
