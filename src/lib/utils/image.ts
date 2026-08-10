/**
 * Generates an optimized image URL using vinext's image optimization endpoint.
 *
 * In production on Cloudflare Workers, the `/_next/image` endpoint is handled
 * by vinext's built-in image optimizer backed by the `IMAGES` Worker binding.
 * Format negotiation (AVIF / WebP) is handled automatically via the `Accept`
 * header — no extra parameter needed.
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

  // Use vinext's image optimizer (backs the /_next/image endpoint) in production
  if (process.env.NODE_ENV === "production") {
    const params = new URLSearchParams();
    params.set("url", src);
    if (options?.width) {
      params.set("w", String(options.width));
    }
    params.set("q", String(options?.quality ?? 85));

    return `/_next/image?${params.toString()}`;
  }

  return src;
}
