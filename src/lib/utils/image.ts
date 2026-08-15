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
  _options?: { width?: number; quality?: number }
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

  // Local images are served as-is from public/ via Cloudflare static assets.
  // Routing them through vinext's /_next/image optimizer broke production
  // rendering (the endpoint is not wired in this deployment), while videos —
  // which take this same path — render fine.
  return src;
}
