/* eslint-disable @typescript-eslint/only-throw-error */
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
  const { filename } = params;

  if (!platform?.env) {
    throw error(500, 'Platform environment is not available');
  }

  const bucket = platform.env['portfolio-assets'];
  const object = await bucket.get(filename);

  if (!object) {
    throw error(404, 'File not found');
  }

  const headers = new Headers();

  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  if (filename.endsWith('.pdf')) {
    headers.set('Content-Type', 'application/pdf');
  }

  return new Response(object.body, {
    headers,
  });
};
