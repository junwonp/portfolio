import generatedImages from '@/lib/generated/images.json';

interface ImageVariant {
  src: string;
  width: number;
}

interface ImageAsset {
  width: number;
  height: number;
  variants: ImageVariant[];
  /** JPEG counterparts for print; absent on assets generated before print variants existed. */
  printVariants?: ImageVariant[];
}

interface ResponsiveImageProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
}

const images: Readonly<Record<string, ImageAsset>> = generatedImages;
const DEFAULT_IMAGE_WIDTH = 960;

/** The smallest candidate covering the requested width, or the largest one when none does. */
const pickVariant = (variants: ImageVariant[], width: number): string | undefined =>
  variants.find((variant) => variant.width >= width)?.src ?? variants.at(-1)?.src;

export function getOptimizedImageUrl(src: string, options?: { width?: number }): string {
  const asset = images[src];
  if (!asset) return src;

  return pickVariant(asset.variants, options?.width ?? DEFAULT_IMAGE_WIDTH) ?? src;
}

/*
 * Print assets: the PDF path embeds a JPEG byte-for-byte (DCTDecode), but decodes a
 * WebP and re-encodes it losslessly, several times larger. Prefer the JPEG variant
 * and fall back to the WebP one so assets without print variants still render.
 */
export function getPrintImageUrl(src: string, options?: { width?: number }): string {
  const asset = images[src];
  if (!asset) return src;

  const candidates = asset.printVariants?.length ? asset.printVariants : asset.variants;
  return pickVariant(candidates, options?.width ?? DEFAULT_IMAGE_WIDTH) ?? src;
}

export function getResponsiveImageProps(
  src: string,
  sizes = '(max-width: 768px) 100vw, 960px',
): ResponsiveImageProps {
  const asset = images[src];
  if (!asset) return { src };

  return {
    src: getOptimizedImageUrl(src),
    srcSet: asset.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', '),
    sizes,
    width: asset.width,
    height: asset.height,
  };
}
