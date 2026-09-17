import { describe, expect, it } from 'vitest';

import { GET } from './route';

describe('root opengraph image route', () => {
  it('permanently redirects to the root opengraph image asset', async () => {
    const request = new Request('https://junwon.dev/opengraph-image');

    const response = await GET(request);

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://junwon.dev/opengraph-image.png');
  });

  it('resolves the redirect target against the incoming request host', async () => {
    const request = new Request('https://preview.example.com/opengraph-image');

    const response = await GET(request);

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe(
      'https://preview.example.com/opengraph-image.png',
    );
  });
});
