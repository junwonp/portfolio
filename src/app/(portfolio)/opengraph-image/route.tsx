export async function GET(request: Request) {
  return Response.redirect(new URL('/opengraph-image.png', request.url), 308);
}
