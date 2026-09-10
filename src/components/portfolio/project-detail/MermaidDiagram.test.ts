import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import diagrams from '@/generated/diagrams.json';

describe('static diagrams', () => {
  it('provides dimensioned theme assets for every authored chart', () => {
    const root = resolve('src/content/projects');
    const sources = readdirSync(root, { recursive: true }).filter((file) =>
      String(file).endsWith('.mdx'),
    );
    let count = 0;
    for (const file of sources) {
      const source = readFileSync(resolve(root, String(file)), 'utf8');
      for (const match of source.matchAll(/export const \w+Chart = `([^`]+)`;/g)) {
        const entry = (
          diagrams as Record<string, { light: string; dark: string; width: number; height: number }>
        )[match[1]];
        expect(entry).toBeDefined();
        expect(entry.width).toBeGreaterThan(0);
        expect(entry.height).toBeGreaterThan(0);
        for (const asset of [entry.light, entry.dark]) {
          const svg = readFileSync(resolve('public', asset.slice(1)), 'utf8');
          expect(svg).toContain('<svg');
          expect(svg).not.toMatch(/<script|<foreignObject/i);
        }
        count += 1;
      }
    }
    expect(count).toBeGreaterThan(0);
  });
});
