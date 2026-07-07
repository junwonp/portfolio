import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  resolveLocaleFromPathname,
  stripLocalePathPrefix,
} from '@/lib/utils/language';

const ASSET_CACHE_PATHS = [/^\/fonts\//, /^\/images\//, /^\/certificates\//];
const ASSET_CACHE_HEADER = 'public, max-age=31536000, immutable';
const PAGE_CACHE_HEADER = 'private, max-age=0, must-revalidate';
const PRIVATE_PAGE_CACHE_HEADER = 'private, no-cache, no-store, must-revalidate';
const PRIVATE_ROBOTS_PATHS = [
  /^\/admin(?:\/|$)/,
  /^\/a(?:\/|$)/,
  /^\/api(?:\/|$)/,
  /^\/print(?:\/|$)/,
];
const RESUME_HOST = 'resume.junwon.dev';

const SECURITY_HEADERS = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
} as const;

const createNonce = () => Buffer.from(crypto.randomUUID()).toString('base64');

const buildContentSecurityPolicy = (nonce: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
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

export const getCacheControlForPath = (pathname: string): string => {
  if (ASSET_CACHE_PATHS.some((regex) => regex.test(pathname))) {
    return ASSET_CACHE_HEADER;
  }

  if (PRIVATE_ROBOTS_PATHS.some((regex) => regex.test(pathname))) {
    return PRIVATE_PAGE_CACHE_HEADER;
  }

  return PAGE_CACHE_HEADER;
};

export const getDefaultLocaleRedirectPathname = (pathname: string): string | null => {
  if (pathname === '/ko' || pathname.startsWith('/ko/')) {
    return stripLocalePathPrefix(pathname);
  }

  return null;
};

export const getResumeRewritePathname = (host: string | null, pathname: string): string | null => {
  const normalizedHost = host?.toLowerCase().split(':')[0];

  if (normalizedHost === RESUME_HOST && pathname === '/') {
    return '/resume';
  }

  return null;
};

const applyResponseHeaders = (response: NextResponse, pathname: string, nonce: string): void => {
  const locale = resolveLocaleFromPathname(pathname);

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value);
  }
  response.headers.set('Content-Security-Policy', buildContentSecurityPolicy(nonce));
  response.headers.set('Cache-Control', getCacheControlForPath(pathname));

  if (!ASSET_CACHE_PATHS.some((regex) => regex.test(pathname))) {
    response.headers.set('X-Locale', locale);
  }

  if (PRIVATE_ROBOTS_PATHS.some((regex) => regex.test(pathname))) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  } else {
    response.headers.set('X-Robots-Tag', 'index, follow');
  }
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = createNonce();
  const resumeRewritePathname = getResumeRewritePathname(request.headers.get('host'), pathname);

  if (resumeRewritePathname) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = resumeRewritePathname;

    const requestHeaders = new Headers(request.headers);
    const locale = resolveLocaleFromPathname(resumeRewritePathname);
    requestHeaders.set('x-locale', locale);
    requestHeaders.set('x-nonce', nonce);

    const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    applyResponseHeaders(rewriteResponse, resumeRewritePathname, nonce);

    return rewriteResponse;
  }

  const defaultLocaleRedirectPathname = getDefaultLocaleRedirectPathname(pathname);

  if (defaultLocaleRedirectPathname) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = defaultLocaleRedirectPathname;
    const redirectResponse = NextResponse.redirect(redirectUrl);
    applyResponseHeaders(redirectResponse, defaultLocaleRedirectPathname, nonce);

    return redirectResponse;
  }

  // Setup request headers for Server Components.
  const requestHeaders = new Headers(request.headers);
  const locale = resolveLocaleFromPathname(pathname);
  requestHeaders.set('x-locale', locale);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  applyResponseHeaders(response, pathname, nonce);

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
