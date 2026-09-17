import { describe, expect, it } from 'vitest';

import { GET } from './route';

describe('root twitter image route', () => {
  it('permanently redirects to the root twitter image asset', async () => {
    const request = new Request('https://junwon.dev/twitter-image');

    const response = await GET(request);

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://junwon.dev/twitter-image.png');
  });

  it('resolves the redirect target against the incoming request host', async () => {
    const request = new Request('https://preview.example.com/twitter-image');

    const response = await GET(request);

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://preview.example.com/twitter-image.png');
  });
});
