import { NextResponse } from "next/server";

import { LANGUAGE_COOKIE } from "@/lib/data/constants";
import { getLocaleCookieOptions, isValidLanguage } from "@/lib/utils/language";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const locale =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>).locale
        : undefined;

    if (!isValidLanguage(locale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, locale });
    const isHttps = new URL(request.url).protocol === "https:";
    const cookieOptions = getLocaleCookieOptions(isHttps);

    response.cookies.set(LANGUAGE_COOKIE, locale, cookieOptions);

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
