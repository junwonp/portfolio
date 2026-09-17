import { describe, expect, it } from 'vitest';

import { GET } from './route';

const request = () => new Request('https://junwon.dev/ko/twitter-image');

describe('localized twitter image route', () => {
  it('redirects the English locale to the localized twitter image asset', async () => {
    const response = await GET(request(), { params: Promise.resolve({ locale: 'en' }) });

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://junwon.dev/en/twitter-image.png');
  });

  it('redirects the Korean locale to the root twitter image asset', async () => {
    const response = await GET(request(), { params: Promise.resolve({ locale: 'ko' }) });

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://junwon.dev/twitter-image.png');
  });

  it('falls back to the root asset for any other locale segment', async () => {
    const response = await GET(request(), { params: Promise.resolve({ locale: 'fr' }) });

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://junwon.dev/twitter-image.png');
  });
});
