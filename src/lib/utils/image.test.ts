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

  it("returns the original URL for local images in any environment", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(getOptimizedImageUrl("/images/project1.png", { width: 500 })).toBe(
      "/images/project1.png"
    );
    vi.unstubAllEnvs();

    vi.stubEnv("NODE_ENV", "development");
    expect(getOptimizedImageUrl("/images/project1.png", { width: 500 })).toBe(
      "/images/project1.png"
    );
    vi.unstubAllEnvs();
  });
});
