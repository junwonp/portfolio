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

const OWN_REFERRER_DOMAINS = new Set(['junwon.dev', 'www.junwon.dev', 'localhost', '127.0.0.1']);

// Recovers attribution for visitors who open a project link in a new tab:
// sessionStorage is per-tab, so the new tab's path has no slug and only the
// referrer still points at the application link
export const extractApplicationSlugFromReferrer = (referrer: string): string | undefined => {
  if (!referrer || referrer === 'direct') {
    return undefined;
  }

  let url: URL;
  try {
    url = new URL(referrer);
  } catch {
    return undefined;
  }

  if (!OWN_REFERRER_DOMAINS.has(url.hostname)) {
    return undefined;
  }

  return extractApplicationSlugFromPath(url.pathname);
};
