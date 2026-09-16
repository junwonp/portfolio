import { existsSync } from 'node:fs';
import path from 'node:path';

/*
 * Both media generators read the same locale pair for every project directory.
 * A missing file is a content bug, not a case to skip: the manifest would
 * silently lose the project and the document would fall back to the WebP print
 * variants. Failing with every relative path at once is actionable; a raw ENOENT
 * names one absolute path and aborts mid-run.
 */
export const LOCALES = ['ko', 'en'];
/** ko is the canonical document locale; the two locales are compared, never merged. */
export const CANONICAL_LOCALE = 'ko';

export const assertProjectContent = (root, contentDirectory, slugs) => {
  const missing = [];

  for (const slug of slugs) {
    for (const locale of LOCALES) {
      const file = path.join(contentDirectory, slug, `detail.${locale}.mdx`);
      if (!existsSync(file)) missing.push(path.relative(root, file));
    }
  }

  if (missing.length === 0) return;

  throw new Error(
    [
      `Project content is incomplete (${missing.length} missing file(s)):`,
      ...missing.map((file) => `  ${file}`),
      '',
      'Every project directory must contain detail.ko.mdx and detail.en.mdx; the media',
      'generators and the document manifest mirror both locales. Add the missing file(s)',
      'and re-run `pnpm generate:media`.',
    ].join('\n'),
  );
};
