export const getAssetObjectResponse = async (
  bucket: R2Bucket | undefined,
  filename: string,
): Promise<Response> => {
  if (!bucket) {
    return new Response('R2 Bucket binding is missing', { status: 500 });
  }

  const object = await bucket.get(filename);
  if (!object) {
    return new Response('File not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body, {
    headers,
  });
};
