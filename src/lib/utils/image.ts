import generatedImages from '@/lib/generated/images.json';

interface ImageAsset {
  width: number;
  height: number;
  variants: { src: string; width: number }[];
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

export function getOptimizedImageUrl(src: string, options?: { width?: number }): string {
  const asset = images[src];
  if (!asset) return src;

  const width = options?.width ?? DEFAULT_IMAGE_WIDTH;
  return (
    asset.variants.find((variant) => variant.width >= width)?.src ??
    asset.variants.at(-1)?.src ??
    src
  );
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
