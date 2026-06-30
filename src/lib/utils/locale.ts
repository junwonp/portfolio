import type { Language } from "@/lib/utils/language";

// Next.js uses React Context (useLocale) or headers for locale detection.
// Keep only a fallback for backward compatibility.
export const getPageLocale = (): Language => "ko";
