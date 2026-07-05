export const APPLICATION_SLUG_LENGTH = 4;

export const RESERVED_APPLICATION_SLUGS = new Set([
  'a',
  'admin',
  'api',
  'certificates',
  'en',
  'favicon.ico',
  'github',
  'images',
  'ko',
  'linkedin',
  'print',
  'projects',
  'robots.txt',
]);

export const normalizeApplicationSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 32);

export const isReservedApplicationSlug = (slug: string): boolean =>
  RESERVED_APPLICATION_SLUGS.has(slug.toLowerCase());

export const extractApplicationSlugFromPath = (path: string | undefined): string | undefined => {
  if (!path) {
    return undefined;
  }

  const match = /^\/(?:en\/)?([^/]+)\/?$/.exec(path);
  if (!match) {
    return undefined;
  }

  const segment = match[1].trim();
  const slug = normalizeApplicationSlug(segment);
  if (!slug || slug !== segment.toLowerCase() || isReservedApplicationSlug(slug)) {
    return undefined;
  }

  return slug;
};
