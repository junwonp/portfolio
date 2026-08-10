import { describe, expect, it, vi } from "vitest";

import { getOptimizedImageUrl } from "./image";

describe("getOptimizedImageUrl", () => {
  it("should return the original URL if it is not a relative path", () => {
    expect(getOptimizedImageUrl("https://example.com/image.png")).toBe(
      "https://example.com/image.png"
    );
  });

  it("should return the original URL if it is a video file", () => {
    expect(getOptimizedImageUrl("/videos/hero.mp4")).toBe("/videos/hero.mp4");
  });

  it("should return the optimized URL with options in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(getOptimizedImageUrl("/images/project1.png", { width: 500 })).toBe(
      "/_next/image?url=%2Fimages%2Fproject1.png&w=500&q=85"
    );

    expect(
      getOptimizedImageUrl("/images/project1.png", { width: 800, quality: 90 })
    ).toBe(
      "/_next/image?url=%2Fimages%2Fproject1.png&w=800&q=90"
    );

    vi.unstubAllEnvs();
  });

  it("should return the original URL in development", () => {
    vi.stubEnv("NODE_ENV", "development");

    expect(getOptimizedImageUrl("/images/project1.png", { width: 500 })).toBe(
      "/images/project1.png"
    );

    vi.unstubAllEnvs();
  });
});
