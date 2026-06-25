import type { Language } from "@/lib/utils/language";

// Next.js 환경에서는 React Context(useLocale) 또는 헤더를 사용하여 언어를 참조하므로,
// 기존 Svelte 코드 호환성을 위해 타입 안전한 기본 폴백만 유지합니다.
export const getPageLocale = (): Language => "ko";
