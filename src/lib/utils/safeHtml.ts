import Prism from 'prismjs';

if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { Prism: typeof Prism }).Prism = Prism;
}

import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-json.js';


const ALLOWED_TAGS = new Set([
  'br',
  'code',
  'h2',
  'h3',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  'span',
  'strong',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'ul',
]);

const VOID_TAGS = new Set(['br', 'img']);

const TAG_REGEX = /<\/?([a-z][a-z0-9-]*)(\s[^<>]*?)?\s*\/?>/gi;

const escapeHtml = (value: string) =>
  value
    .replace(/&(?!(#[0-9]+|[a-zA-Z]+);)/g, '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const decodeHtml = (value: string) =>
  value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

const getAttribute = (attributes: string, name: string) => {
  const match = attributes.match(new RegExp(`\\s${name}=(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? '';
};

const isAllowedImageSrc = (src: string) => src.startsWith('/images/');

const serializeAllowedTag = (rawTag: string, tagName: string, attributes = '') => {
  const tag = tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tag)) {
    return escapeHtml(rawTag);
  }

  const isClosingTag = rawTag.startsWith('</');

  if (isClosingTag) {
    return VOID_TAGS.has(tag) ? '' : `</${tag}>`;
  }

  if (tag === 'img') {
    const alt = getAttribute(attributes, 'alt');
    const src = getAttribute(attributes, 'src');

    if (!isAllowedImageSrc(src)) {
      return '';
    }

    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
  }

  if (['code', 'pre', 'span'].includes(tag)) {
    const className = getAttribute(attributes, 'class');
    if (className) {
      return `<${tag} class="${escapeHtml(className)}">`;
    }
  }

  return `<${tag}>`;
};

const highlightCodeBlocks = (html: string): string => {
  return html.replace(
    /<pre[^>]*class="([^"]*language-([a-z0-9-]+)[^"]*)"[^>]*>\s*<code[^>]*class="[^"]*"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (match, preClass, lang, rawCode) => {
      let cleanCode = decodeHtml(rawCode);
      cleanCode = cleanCode.replace(/^\s*\n/, '').replace(/\n\s*$/, '');
      const grammar = Prism.languages[lang] || Prism.languages.tsx || Prism.languages.javascript;
      const highlighted = Prism.highlight(cleanCode, grammar, lang);
      return `<pre class="${preClass}"><code class="language-${lang}">${highlighted}</code></pre>`;
    }
  );
};

export const sanitizeProjectHtml = (html: string) => {
  let lastIndex = 0;
  let sanitized = '';

  for (const match of html.matchAll(TAG_REGEX)) {
    const rawTag = match[0];
    const tagName = match[1];
    const attributes = match[2];
    const index = match.index;

    sanitized += escapeHtml(html.slice(lastIndex, index));
    sanitized += serializeAllowedTag(rawTag, tagName, attributes);
    lastIndex = index + rawTag.length;
  }

  sanitized += escapeHtml(html.slice(lastIndex));

  return highlightCodeBlocks(sanitized);
};
