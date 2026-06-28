import { describe, expect, it } from 'vitest';

import { getAssetObjectResponse } from '@/lib/server/assetResponse';

const createObject = () =>
  ({
    body: 'asset-body',
    httpEtag: '"etag"',
    writeHttpMetadata(headers: Headers) {
      headers.set('content-type', 'image/webp');
    },
  }) as unknown as R2ObjectBody;

describe('getAssetObjectResponse', () => {
  it('returns 500 when the R2 binding is missing', async () => {
    const response = await getAssetObjectResponse(undefined, 'preview.webp');

    expect(response.status).toBe(500);
    await expect(response.text()).resolves.toBe('R2 Bucket binding is missing');
  });

  it('returns 404 when the requested object is missing', async () => {
    const bucket = {
      get: async () => null,
    } as unknown as R2Bucket;

    const response = await getAssetObjectResponse(bucket, 'missing.webp');

    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toBe('File not found');
  });

  it('preserves object metadata when the asset exists', async () => {
    const bucket = {
      get: async () => createObject(),
    } as unknown as R2Bucket;

    const response = await getAssetObjectResponse(bucket, 'preview.webp');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/webp');
    expect(response.headers.get('etag')).toBe('"etag"');
  });
});
