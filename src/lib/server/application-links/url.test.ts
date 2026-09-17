import { describe, expect, it } from 'vitest';

import { PORTFOLIO_URL } from '@/config/site';
import { getApplicationLinkUrl } from '@/lib/server/application-links/url';

describe('getApplicationLinkUrl', () => {
  it('composes the short link from the configured portfolio URL', () => {
    expect(getApplicationLinkUrl('p48r')).toBe(`${PORTFOLIO_URL}/r/p48r`);
  });

  it('keeps the composed pathname inside the /r/ short-link namespace', () => {
    const url = getApplicationLinkUrl('abcd');

    expect(url.startsWith(PORTFOLIO_URL)).toBe(true);
    expect(url.slice(PORTFOLIO_URL.length)).toBe('/r/abcd');
  });

  it('appends the slug verbatim without normalizing it', () => {
    expect(getApplicationLinkUrl('Team-2026!')).toBe(`${PORTFOLIO_URL}/r/Team-2026!`);
  });
});
