import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isReservedApplicationSlug } from '@/lib/utils/applicationSlug';
import { resolveLocaleFromPathname, stripLocalePathPrefix } from '@/lib/utils/language';

const ASSET_CACHE_PATHS = [/^\/fonts\//, /^\/images\//, /^\/certificates\//];
const ASSET_CACHE_HEADER = 'public, max-age=31536000, immutable';
// Public pages are KV-prerendered at deploy; a short CDN window keeps stale
// HTML bounded after a deploy while serving repeat visits from the edge.
const PUBLIC_PAGE_CACHE_HEADER = 'public, max-age=0, s-maxage=60, stale-while-revalidate=3600';
const PRIVATE_PAGE_CACHE_HEADER = 'private, no-cache, no-store, must-revalidate';
// The site is deliberately kept out of search indexes. This header is the
// authoritative signal: it also drops pages that are already indexed, which a
// robots.txt disallow could not do, because crawlers never fetch the page to
// read the directive.
export const ROBOTS_TAG_EXCLUDED = 'noindex, nofollow';
const PRIVATE_NONCE_PATHS = [
  /^\/admin(?:\/|$)/,
  /^\/a(?:\/|$)/,
  /^\/api(?:\/|$)/,
  /^\/print(?:\/|$)/,
  /^\/(?:en\/)?r(?:\/|$)/,
];
const DEFAULT_LOCALE_REWRITE_EXCLUSIONS = [
  /^\/_next(?:\/|$)/,
  /^\/api(?:\/|$)/,
  /^\/a(?:\/|$)/,
  /^\/admin(?:\/|$)/,
  /^\/portfolio(?:\/|$)/,
  /^\/print(?:\/|$)/,
  /^\/resume(?:\/|$)/,
  /^\/fonts(?:\/|$)/,
  /^\/images(?:\/|$)/,
  /^\/certificates(?:\/|$)/,
];
const PUBLIC_FILE_PATH_PATTERN = /\/[^/.][^/]*\.[^/]+$/;
const PUBLIC_METADATA_ROUTE_PATHS = new Set(['/opengraph-image', '/twitter-image']);
const PROJECT_DETAIL_PATH_PATTERN = /^\/projects\/[^/]+\/?$/;
const SINGLE_SEGMENT_PATH_PATTERN = /^\/([^/]+)\/?$/;
const APPLICATION_LINK_PATH_PATTERN = /^\/r\/[^/]+\/?$/;
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

const buildContentSecurityPolicy = (scriptSrc: string) =>
  [
    "default-src 'self'",
    `script-src 'self' ${scriptSrc}${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
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

export const getContentSecurityPolicyForPath = (pathname: string, nonce: string): string => {
  // Public pages are KV-prerendered at deploy time, so their streamed inline
  // scripts cannot carry a per-request nonce; those pages are generated from
  // trusted MDX with no user input, so inline scripts are acceptable there.
  // Authenticated/user-data surfaces keep the strict per-request nonce policy
  // (vinext applies the nonce from this header to all streamed scripts).
  const isPrivatePath = PRIVATE_NONCE_PATHS.some((regex) => regex.test(pathname));
  return buildContentSecurityPolicy(isPrivatePath ? `'nonce-${nonce}'` : "'unsafe-inline'");
};

// Application links live under /r/. Root-level single segments still resolve as
// legacy links so already-submitted URLs keep their private, noindex treatment
// until the migration window closes.
const isApplicationLinkPath = (pathname: string): boolean => {
  const canonicalPath = stripLocalePathPrefix(pathname);

  if (APPLICATION_LINK_PATH_PATTERN.test(canonicalPath)) {
    return true;
  }

  const slug = canonicalPath.match(SINGLE_SEGMENT_PATH_PATTERN)?.[1];

  return Boolean(
    slug && !isReservedApplicationSlug(slug) && !PUBLIC_FILE_PATH_PATTERN.test(canonicalPath),
  );
};

export const getCacheControlForPath = (pathname: string): string => {
  if (ASSET_CACHE_PATHS.some((regex) => regex.test(pathname))) {
    return ASSET_CACHE_HEADER;
  }

  if (PRIVATE_NONCE_PATHS.some((regex) => regex.test(pathname)) || pathname === '/resume') {
    return PRIVATE_PAGE_CACHE_HEADER;
  }

  // Revocation and expiry must take effect on the next request, not after a CDN TTL.
  if (isApplicationLinkPath(pathname)) {
    return PRIVATE_PAGE_CACHE_HEADER;
  }

  return PUBLIC_PAGE_CACHE_HEADER;
};

export const getDefaultLocaleRedirectPathname = (pathname: string): string | null => {
  if (pathname === '/ko' || pathname.startsWith('/ko/')) {
    return stripLocalePathPrefix(pathname);
  }

  return null;
};

export const getDefaultLocaleRewritePathname = (pathname: string): string | null => {
  if (
    pathname === '/favicon.ico' ||
    pathname === '/en' ||
    pathname.startsWith('/en/') ||
    pathname === '/ko' ||
    pathname.startsWith('/ko/') ||
    DEFAULT_LOCALE_REWRITE_EXCLUSIONS.some((regex) => regex.test(pathname)) ||
    PUBLIC_FILE_PATH_PATTERN.test(pathname)
  ) {
    return null;
  }

  if (
    pathname === '/' ||
    pathname === '/privacy' ||
    PROJECT_DETAIL_PATH_PATTERN.test(pathname) ||
    APPLICATION_LINK_PATH_PATTERN.test(pathname)
  ) {
    return pathname === '/' ? '/ko' : `/ko${pathname}`;
  }

  const singleSegment = pathname.match(SINGLE_SEGMENT_PATH_PATTERN)?.[1];
  if (
    singleSegment &&
    !isReservedApplicationSlug(singleSegment) &&
    !PUBLIC_METADATA_ROUTE_PATHS.has(pathname)
  ) {
    return `/ko${pathname}`;
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
  response.headers.set('Content-Security-Policy', getContentSecurityPolicyForPath(pathname, nonce));
  response.headers.set('Cache-Control', getCacheControlForPath(pathname));

  if (!ASSET_CACHE_PATHS.some((regex) => regex.test(pathname))) {
    response.headers.set('X-Locale', locale);
  }

  response.headers.set('X-Robots-Tag', ROBOTS_TAG_EXCLUDED);
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

    const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    applyResponseHeaders(rewriteResponse, resumeRewritePathname, nonce);

    return rewriteResponse;
  }

  // The deploy-time prerender phase renders the /ko/* concrete paths directly;
  // the canonical 307 would otherwise make every Korean page unprerenderable.
  // VINEXT_PRERENDER is only set in the local prerender server process.
  const isPrerenderRequest = process.env.VINEXT_PRERENDER === '1';

  const defaultLocaleRedirectPathname = isPrerenderRequest
    ? null
    : getDefaultLocaleRedirectPathname(pathname);

  if (defaultLocaleRedirectPathname) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = defaultLocaleRedirectPathname;
    const redirectResponse = NextResponse.redirect(redirectUrl);
    applyResponseHeaders(redirectResponse, defaultLocaleRedirectPathname, nonce);

    return redirectResponse;
  }

  const defaultLocaleRewritePathname = getDefaultLocaleRewritePathname(pathname);

  if (defaultLocaleRewritePathname) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = defaultLocaleRewritePathname;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', 'ko');

    const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    applyResponseHeaders(rewriteResponse, pathname, nonce);

    return rewriteResponse;
  }

  // Setup request headers for Server Components.
  const requestHeaders = new Headers(request.headers);
  const locale = resolveLocaleFromPathname(pathname);
  requestHeaders.set('x-locale', locale);

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
