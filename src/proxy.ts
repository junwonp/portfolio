import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { LANGUAGE_COOKIE } from '@/lib/data/constants';
import {
  detectLanguageFromHeader,
  getLocaleCookieOptions,
  isValidLanguage,
} from '@/lib/utils/language';

const ASSET_CACHE_PATHS = [/^\/fonts\//, /^\/images\//, /^\/certificates\//];
const ASSET_CACHE_HEADER = 'public, max-age=31536000, immutable';
const PAGE_CACHE_HEADER = 'private, no-cache, no-store, must-revalidate';
const PRIVATE_ROBOTS_PATHS = [
  /^\/admin(?:\/|$)/,
  /^\/a(?:\/|$)/,
  /^\/api(?:\/|$)/,
  /^\/print(?:\/|$)/,
];

const SECURITY_HEADERS = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
} as const;

const buildContentSecurityPolicy = () =>
  [
    "default-src 'self'",
    `script-src 'self'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Determine Locale
  const cookieLocale = request.cookies.get(LANGUAGE_COOKIE)?.value;
  let locale: 'ko' | 'en';
  let shouldSetCookie = false;

  if (isValidLanguage(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get('accept-language');
    locale = detectLanguageFromHeader(acceptLanguage);
    shouldSetCookie = true;
  }

  // 2. Setup request headers (to pass locale to server components)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 3. Set security headers
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value);
  }
  response.headers.set('Content-Security-Policy', buildContentSecurityPolicy());

  // 4. Cache headers
  if (ASSET_CACHE_PATHS.some((regex) => regex.test(pathname))) {
    response.headers.set('Cache-Control', ASSET_CACHE_HEADER);
  } else {
    // Default to page cache for HTML pages / routes
    response.headers.set('Cache-Control', PAGE_CACHE_HEADER);
    response.headers.set('Vary', 'Accept-Language, Cookie');
    response.headers.set('X-Locale', locale);
  }

  // 5. Robots tag
  if (PRIVATE_ROBOTS_PATHS.some((regex) => regex.test(pathname))) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  } else {
    response.headers.set('X-Robots-Tag', 'index, follow');
  }

  // 6. Set locale cookie if not set
  if (shouldSetCookie) {
    const isHttps = request.nextUrl.protocol === 'https:';
    const cookieOptions = getLocaleCookieOptions(isHttps);
    response.cookies.set(LANGUAGE_COOKIE, locale, cookieOptions);
  }

  return response;
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
