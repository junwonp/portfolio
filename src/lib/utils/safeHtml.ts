const ALLOWED_TAGS = new Set([
  'br',
  'code',
  'img',
  'li',
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
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

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

  return `<${tag}>`;
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

  return sanitized;
};
