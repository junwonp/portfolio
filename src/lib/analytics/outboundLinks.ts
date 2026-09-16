import { reportInteraction } from '@/lib/analytics/analyticsTransport';

// The server caps interaction labels at 500 chars; keep derived domain labels
// short enough to stay readable in the admin surface
export const MAX_OUTBOUND_LABEL_LENGTH = 120;

// Fixed destination kinds. A host is matched on its exact name first (so
// `resume.junwon.dev` stays `resume`) and then on its registrable domain (so
// `gist.github.com` still reads as `github`).
const KNOWN_HOST_LABELS: Record<string, string> = {
  'github.com': 'github',
  'linkedin.com': 'linkedin',
  'resume.junwon.dev': 'resume',
};

// A few registrable domains need three labels (`example.co.uk`); everything
// else reduces to the last two. A full public-suffix list is not worth the
// dependency for a fixed link set.
const MULTI_PART_SUFFIXES = new Set([
  'ac.kr',
  'ac.uk',
  'co.jp',
  'co.kr',
  'co.uk',
  'com.au',
  'com.br',
  'com.cn',
  'com.hk',
  'com.sg',
  'com.tw',
  'gov.uk',
  'ne.jp',
  'net.au',
  'or.jp',
  'org.au',
  'org.uk',
]);

function registrableDomain(hostname: string): string {
  const host = hostname.toLowerCase().replace(/^www\./, '');
  const labels = host.split('.').filter(Boolean);
  if (labels.length <= 2) return host;

  const keep = MULTI_PART_SUFFIXES.has(labels.slice(-2).join('.')) ? 3 : 2;
  return labels.slice(-keep).join('.');
}

/**
 * Derives the fixed destination kind for an href, or null when the href is
 * internal navigation (relative path, hash, same-origin URL) or a scheme the
 * portfolio does not track.
 */
export function outboundLabelFromHref(href: string, currentOrigin?: string): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;

  if (trimmed.toLowerCase().startsWith('mailto:')) return 'email';

  const isProtocolRelative = trimmed.startsWith('//');
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(trimmed)?.[1]?.toLowerCase();
  if (!isProtocolRelative && scheme !== 'http' && scheme !== 'https') return null;

  let url: URL;
  try {
    url = new URL(isProtocolRelative ? `https:${trimmed}` : trimmed);
  } catch {
    return null;
  }

  if (currentOrigin && url.origin === currentOrigin) return null;

  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const known = KNOWN_HOST_LABELS[host] || KNOWN_HOST_LABELS[registrableDomain(host)];
  if (known) return known;

  return `external:${registrableDomain(host)}`.slice(0, MAX_OUTBOUND_LABEL_LENGTH);
}

/**
 * Reports a click on an external destination. Safe to call from the click
 * handler of a single anchor: internal hrefs and unknown schemes are skipped
 * here so only outbound navigation reaches the analytics endpoint.
 */
export function reportOutboundLink(href: string): void {
  const currentOrigin = typeof window === 'undefined' ? undefined : window.location.origin;
  const label = outboundLabelFromHref(href, currentOrigin);
  if (!label) return;

  reportInteraction({
    interactionType: 'outbound_link',
    interactionLabel: label,
    action: 'open',
  });
}
