/**
 * Generates an optimized image URL using Cloudflare Image Resizing.
 *
 * @param src The original image path (e.g., "/images/project1.png")
 * @param options Optimization options (width, quality)
 * @returns Optimized image URL or the original src in development/non-supported environments
 */
export function getOptimizedImageUrl(
  src: string,
  options?: { width?: number; quality?: number }
): string {
  // Return early if not a local relative path, is an external URL, or is a video
  if (!src.startsWith("/") || src.startsWith("//")) {
    return src;
  }

  // Unsupported formats check (e.g. videos)
  const isVideo = [".mp4", ".webm", ".mov", ".avi", ".m4v"].some((ext) =>
    src.toLowerCase().endsWith(ext)
  );
  if (isVideo) {
    return src;
  }

  // Use Cloudflare Image Resizing in production
  if (process.env.NODE_ENV === "production") {
    const params = ["format=auto"]; // Auto-detect and serve WebP/AVIF
    if (options?.width) {
      params.push(`width=${options.width}`);
    }
    if (options?.quality) {
      params.push(`quality=${options.quality}`);
    } else {
      params.push("quality=85"); // Default high-quality compression
    }

    const normalizedSrc = src.startsWith("/") ? src.slice(1) : src;
    return `/cdn-cgi/image/${params.join(",")}/${normalizedSrc}`;
  }

  return src;
}
