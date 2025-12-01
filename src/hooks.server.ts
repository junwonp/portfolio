import type { Handle } from '@sveltejs/kit';

import { detectLanguageFromHeader } from '$lib/utils/language';

const LANGUAGE_COOKIE = 'preferred-language';

export const handle: Handle = async ({ event, resolve }) => {
  let locale = event.cookies.get(LANGUAGE_COOKIE) as 'ko' | 'en' | undefined;

  if (!locale) {
    const acceptLanguage = event.request.headers.get('accept-language');
    locale = detectLanguageFromHeader(acceptLanguage);

    event.cookies.set(LANGUAGE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: event.url.protocol === 'https:',
    });
  }

  event.locals.locale = locale;

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', locale),
  });

  response.headers.set('X-Robots-Tag', 'noindex, nofollow');

  const cacheControl = getCacheControlHeader(
    event.url.pathname,
    response.headers.get('content-type'),
  );

  if (cacheControl) {
    return withCacheHeaders(response, cacheControl, locale);
  }

  return response;
};

const ASSET_CACHE_PATHS = [/^\/fonts\//, /^\/images\//, /^\/certificates\//];
const ASSET_CACHE_HEADER = 'public, max-age=31536000, immutable';
const PAGE_CACHE_HEADER = 'private, no-cache, no-store, must-revalidate';

const getCacheControlHeader = (pathname: string, contentType: string | null) => {
  if (ASSET_CACHE_PATHS.some((regex) => regex.test(pathname))) {
    return ASSET_CACHE_HEADER;
  }

  if (contentType?.includes('text/html')) {
    return PAGE_CACHE_HEADER;
  }

  return null;
};

const withCacheHeaders = (response: Response, cacheControl: string, locale: string) => {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', cacheControl);

  if (cacheControl === PAGE_CACHE_HEADER) {
    headers.set('Vary', 'Accept-Language, Cookie');
    headers.set('X-Locale', locale);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
