import { describe, expect, it } from 'vitest';

import { GET } from './route';

const request = () => new Request('https://junwon.dev/ko/opengraph-image');

describe('localized opengraph image route', () => {
  it('redirects the English locale to the localized opengraph image asset', async () => {
    const response = await GET(request(), { params: Promise.resolve({ locale: 'en' }) });

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://junwon.dev/en/opengraph-image.png');
  });

  it('redirects the Korean locale to the root opengraph image asset', async () => {
    const response = await GET(request(), { params: Promise.resolve({ locale: 'ko' }) });

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://junwon.dev/opengraph-image.png');
  });

  it('falls back to the root asset for any other locale segment', async () => {
    const response = await GET(request(), { params: Promise.resolve({ locale: 'fr' }) });

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://junwon.dev/opengraph-image.png');
  });
});
