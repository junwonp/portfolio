export const runtime = 'edge';

export async function GET(request: Request) {
  return Response.redirect(new URL('/en/opengraph-image.png', request.url), 308);
}
