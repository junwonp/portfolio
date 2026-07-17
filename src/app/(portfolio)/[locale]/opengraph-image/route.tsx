export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (locale === 'en') {
    return Response.redirect(new URL('/en/opengraph-image.png', request.url), 308);
  }

  return Response.redirect(new URL('/opengraph-image.png', request.url), 308);
}
