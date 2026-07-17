export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (locale === 'en') {
    return Response.redirect(new URL('/en/twitter-image.png', request.url), 308);
  }

  return Response.redirect(new URL('/twitter-image.png', request.url), 308);
}
