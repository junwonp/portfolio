/*
 * The print document's screenshots come from the MDX the project page already
 * curates: the frontmatter `image` is the chosen representative shot, and the
 * desktop `src` of each body figure follows in document order. Mobile crops,
 * videos, and icons are not document figures.
 *
 * The body is scanned as text, not parsed: no MDX parser is a direct dependency
 * of this repository, and a script cannot reach a hoisted one. The scanner
 * therefore removes the two MDX constructs that never render a figure — comment
 * expressions and fenced code — before reading `src` values, and accepts both
 * the attribute form (`src="…"`) and the expression form (`src={"…"}`).
 *
 * Shared by scripts/generate-project-images.mjs and the manifest freshness test,
 * so the checked-in manifest cannot drift away from the content it mirrors.
 */

/** Document figures per project: three share one row inside a page's width. */
export const MAX_PROJECT_IMAGES = 3;

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---/;
/** `{/* … *\/}` is how a project retires a figure; its content must not be scanned. */
const mdxCommentPattern = /\{\s*\/\*[\s\S]*?\*\/\s*\}/g;
/** A fenced code block is sample text, never a rendered figure. */
const codeFencePattern = /^ {0,3}```[^\n]*\n[\s\S]*?^ {0,3}```[ \t]*$/gm;
/*
 * `src` as an object property (`src: '…'`) or a JSX attribute: string form
 * (`src="…"`) and expression-container form (`src={'…'}` / `src={"…"}`). The
 * lookbehind keeps `mobileSrc`, `srcSet`, and `data-src` out.
 */
const bodySourcePattern =
  /(?<![\w$.-])src\s*(?:[:=]\s*(['"])([^'"]*)\1|=\s*\{\s*(['"])([^'"]*)\3\s*\})/g;
const videoPattern = /\.(mp4|webm|mov|avi|m4v)$/i;
const printableSourcePattern = /^\/images\//;

const stripQuotes = (value) =>
  value
    .trim()
    .replace(/^(['"])([\s\S]*)\1$/, '$2')
    .trim();

const isPrintableSource = (src) =>
  Boolean(src) && src !== 'null' && printableSourcePattern.test(src) && !videoPattern.test(src);

const splitFrontmatter = (source) => {
  const match = frontmatterPattern.exec(source);

  return match ? { frontmatter: match[1], body: source.slice(match[0].length) } : { body: source };
};

/** The representative screenshot: a project without one declares `image: null` or omits the key. */
export const frontmatterImage = (source) => {
  const { frontmatter } = splitFrontmatter(source);
  if (!frontmatter) return undefined;

  const line = /^image:\s*(.*)$/m.exec(frontmatter);
  const image = line ? stripQuotes(line[1]) : '';

  return isPrintableSource(image) ? image : undefined;
};

/** Desktop captures declared by the body figures, in document order. */
export const bodyImages = (source) => {
  const { body } = splitFrontmatter(source);
  const scannable = body.replace(mdxCommentPattern, '').replace(codeFencePattern, '');
  const images = [];

  for (const match of scannable.matchAll(bodySourcePattern)) {
    const image = match[2] ?? match[4];
    if (isPrintableSource(image)) images.push(image);
  }

  return images;
};

/** Every declared document figure: representative shot first, then body figures, de-duplicated. */
export const extractDeclaredImages = (source) => {
  const images = [];
  const seen = new Set();

  for (const image of [frontmatterImage(source), ...bodyImages(source)]) {
    if (!image || seen.has(image)) continue;

    seen.add(image);
    images.push(image);
  }

  return images;
};

/** The manifest list: the document shows at most three per project. */
export const extractProjectImages = (source) =>
  extractDeclaredImages(source).slice(0, MAX_PROJECT_IMAGES);
