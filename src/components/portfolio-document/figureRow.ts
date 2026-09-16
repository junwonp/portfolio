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

import { DOC_CONTENT_WIDTH_PX } from './pageGeometry';

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

/** Invalid geometry cannot be sized safely; the caller omits the row. */
export const layoutFigureRow = (images: readonly FigureRowImage[]): FigureRow | null => {
  if (images.length === 0) return null;
  if (
    images.some(
      (image) =>
        !Number.isFinite(image.width) ||
        !Number.isFinite(image.height) ||
        image.width <= 0 ||
        image.height <= 0 ||
        image.width > Number.MAX_SAFE_INTEGER ||
        image.height > Number.MAX_SAFE_INTEGER,
    )
  )
    return null;

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
  // Chromium cannot represent image content smaller than one LayoutUnit.
  if (
    !Number.isFinite(contentHeight) ||
    contentHeight < 1 / 64 ||
    aspectRatios.some((ratio) => !Number.isFinite(ratio) || contentHeight * ratio < 1 / 64)
  )
    return null;

  return {
    cells: images.map((image) => ({
      height: contentHeight + FIGURE_CELL_CHROME_PX,
      image,
      width: contentHeight * (image.width / image.height) + FIGURE_CELL_CHROME_PX,
    })),
  };
};
