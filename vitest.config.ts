import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const mdxMockPlugin = {
  name: 'mdx-mock-plugin',
  transform(code: string, id: string) {
    if (id.endsWith('.mdx') || id.endsWith('.md')) {
      const match = code.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      let frontmatter = {};
      if (match) {
        const yamlText = match[1];
        const lines = yamlText.split(/\r?\n/);
        const result: Record<string, unknown> = {};
        let currentKey = '';
        let accumulator = '';
        let inArray = false;
        
        const cleanValue = (val: string) => val.replace(/^['"]|['"]$/g, '').trim();
        const parseYamlArray = (str: string) => {
          try {
            return new Function(`return ${str}`)();
          } catch {
            const matches = str.match(/['"](.*?)['"]/g);
            return matches ? matches.map(m => m.replace(/^['"]|['"]$/g, '')) : [];
          }
        };

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.includes(':') && !inArray) {
            const colonIdx = trimmed.indexOf(':');
            const key = trimmed.slice(0, colonIdx).trim();
            const val = trimmed.slice(colonIdx + 1).trim();

            if (val.startsWith('[') && val.endsWith(']')) {
              result[key] = parseYamlArray(val);
            } else if (val === '[' || val === '') {
              currentKey = key;
              inArray = true;
              accumulator = val;
            } else {
              result[key] = cleanValue(val);
            }
          } else if (inArray) {
            accumulator += ' ' + trimmed;
            if (trimmed.endsWith(']')) {
              inArray = false;
              result[currentKey] = parseYamlArray(accumulator);
            }
          }
        }
        frontmatter = result;
      }

      return {
        code: `
          export const frontmatter = ${JSON.stringify(frontmatter)};
          export default function MDXComponent() { return null; }
        `,
        map: null,
      };
    }
  }
};

export default defineConfig({
  plugins: [mdxMockPlugin],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'cloudflare:workers': fileURLToPath(
        new URL('./src/lib/server/cloudflare-workers.mock.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'node',
  },
});
