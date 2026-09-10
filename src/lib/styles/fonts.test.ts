import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('font delivery', () => {
  it('does not preload the complete variable font on every route', () => {
    const layout = readFileSync(new URL('../../app/layout.tsx', import.meta.url), 'utf8');
    expect(layout).not.toContain('WantedSansVariable.woff2');
    expect(layout).toContain('fonts.generated.css');
  });
});

it('keeps the common Latin and Korean font payload under 160 KiB', () => {
  const fonts = JSON.parse(
    readFileSync(new URL('../generated/fonts.json', import.meta.url), 'utf8'),
  ) as { name: string; src: string; bytes: number }[];
  const primary = fonts.filter((font) => font.name === 'latin' || font.name === 'content');
  expect(primary).toHaveLength(2);
  expect(primary.reduce((sum, font) => sum + font.bytes, 0)).toBeLessThan(160 * 1024);
  for (const font of fonts) {
    const bytes = readFileSync(new URL(`../../../public${font.src}`, import.meta.url));
    expect(bytes.byteLength).toBe(font.bytes);
  }
});
