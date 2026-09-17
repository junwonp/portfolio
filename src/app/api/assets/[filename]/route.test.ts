import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  env: vi.fn(),
}));
vi.mock('@/lib/server/infrastructure/database', () => ({ getCloudflareEnv: mocks.env }));

import { GET } from './route';

const createObject = () =>
  ({
    body: 'asset-body',
    httpEtag: '"etag"',
    writeHttpMetadata(headers: Headers) {
      headers.set('content-type', 'image/webp');
    },
  }) as unknown as R2ObjectBody;

const request = () => new Request('https://junwon.dev/api/assets/preview.webp');

const params = (filename: string) => ({ params: Promise.resolve({ filename }) });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('asset download route', () => {
  it('streams the stored object with its metadata when the asset exists', async () => {
    const get = vi.fn(async () => createObject());
    mocks.env.mockResolvedValue({
      portfolio_assets: { get } as unknown as R2Bucket,
    } as unknown as CloudflareEnv);

    const response = await GET(request(), params('preview.webp'));

    expect(get).toHaveBeenCalledWith('preview.webp');
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/webp');
    expect(response.headers.get('etag')).toBe('"etag"');
  });

  it('returns 404 when the requested asset is not stored in the bucket', async () => {
    const get = vi.fn(async () => null);
    mocks.env.mockResolvedValue({
      portfolio_assets: { get } as unknown as R2Bucket,
    } as unknown as CloudflareEnv);

    const response = await GET(request(), params('missing.webp'));

    expect(get).toHaveBeenCalledWith('missing.webp');
    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toBe('File not found');
  });

  it('returns 500 when the Cloudflare env has no portfolio_assets binding', async () => {
    mocks.env.mockResolvedValue({} as unknown as CloudflareEnv);

    const response = await GET(request(), params('preview.webp'));

    expect(response.status).toBe(500);
    await expect(response.text()).resolves.toBe('R2 Bucket binding is missing');
  });

  it('returns 500 when the Cloudflare env is unavailable', async () => {
    mocks.env.mockResolvedValue(undefined);

    const response = await GET(request(), params('preview.webp'));

    expect(response.status).toBe(500);
    await expect(response.text()).resolves.toBe('R2 Bucket binding is missing');
  });
});
