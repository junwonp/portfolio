/*
 * A project's screenshots render as one row of uniform height, sized to fit the
 * sheet's content width. A vertical stack, or a row of full-size figures, would
 * push a project block past the printable page height — and Chromium then
 * ignores `break-inside: avoid`, splitting the block and orphaning its images
 * from the title above them.
 *
 * The cap is what makes growth impossible: a row adopts the smallest cap in the
 * row, exactly the cap the single-figure layout gave that image.
 */

/** A4 content box at 96dpi: the sheet's 8.27in width less its 0.62in side margins (see @page). */
export const DOC_CONTENT_WIDTH_PX = 8.27 * 96 - 2 * 0.62 * 96;

const INCH_PX = 96;
const MM_PX = INCH_PX / 25.4;

/** Frame chrome per cell, in px: the CSS renders these exact values (PortfolioDocument.css.ts). */
export const FIGURE_CELL_PADDING_PX = 0.0575 * INCH_PX;
export const FIGURE_CELL_BORDER_PX = 0.5 * (INCH_PX / 72);
export const FIGURE_CELL_GAP_PX = 0.1035 * INCH_PX;

const FIGURE_CELL_CHROME_PX = 2 * (FIGURE_CELL_PADDING_PX + FIGURE_CELL_BORDER_PX);

const LANDSCAPE_CAP_PX = 52 * MM_PX;
/** A phone capture at the landscape cap renders ~24mm wide and is unreadable. */
const PORTRAIT_CAP_PX = 80 * MM_PX;

export interface FigureRowImage {
  src: string;
  /** Intrinsic size in px, from the generated image manifest. */
  width: number;
  height: number;
}

export interface FigureRowCell {
  /** Border-box height; every cell in a row shares it. */
  height: number;
  image: FigureRowImage;
  /** Border-box width: the image's own ratio at that height, plus the frame. */
  width: number;
}

export interface FigureRow {
  cells: FigureRowCell[];
}

/** Null when any image lacks a recorded size; the caller then renders the natural-size figure. */
export const layoutFigureRow = (images: readonly FigureRowImage[]): FigureRow | null => {
  if (images.length === 0) return null;
  if (images.some((image) => !(image.width > 0 && image.height > 0))) return null;

  const aspectRatios = images.map((image) => image.width / image.height);
  const caps = images.map((image) =>
    image.height > image.width ? PORTRAIT_CAP_PX : LANDSCAPE_CAP_PX,
  );
  const availableWidth =
    DOC_CONTENT_WIDTH_PX -
    images.length * FIGURE_CELL_CHROME_PX -
    (images.length - 1) * FIGURE_CELL_GAP_PX;
  const contentHeight = Math.min(
    Math.min(...caps),
    // Floored so the row can never round past the content width.
    Math.floor((availableWidth / aspectRatios.reduce((sum, ratio) => sum + ratio, 0)) * 100) / 100,
  );

  return {
    cells: images.map((image) => ({
      height: contentHeight + FIGURE_CELL_CHROME_PX,
      image,
      width: contentHeight * (image.width / image.height) + FIGURE_CELL_CHROME_PX,
    })),
  };
};
