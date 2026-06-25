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
      "/cdn-cgi/image/format=auto,width=500,quality=85/images/project1.png"
    );

    expect(
      getOptimizedImageUrl("/images/project1.png", { width: 800, quality: 90 })
    ).toBe(
      "/cdn-cgi/image/format=auto,width=800,quality=90/images/project1.png"
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
