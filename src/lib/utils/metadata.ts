import type { Language } from '$lib/utils/language';

export interface MetadataContent {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  imageAlt: string;
  siteName: string;
  locale: string;
  skipLink: string;
  schemaDescription: string;
}

export const metadataMap: Record<Language, MetadataContent> = {
  ko: {
    title: 'Junwon Park | 프로필',
    description:
      '프론트엔드 개발자 박준원의 프로필. AI 챗봇 앱 스타트업 공동 창업자이자 프론트엔드 리드로 Expo 기반 앱 기획부터 배포, 운영, 수익화까지의 전 과정을 주도했습니다.',
    ogTitle: 'Junwon Park | 프로필',
    ogDescription:
      '프론트엔드 개발자 박준원의 프로필. AI 챗봇 앱 스타트업 공동 창업자이자 프론트엔드 리드로 Expo 기반 앱 기획부터 배포, 운영, 수익화까지의 전 과정을 주도했습니다.',
    twitterTitle: 'Junwon Park | 프로필',
    twitterDescription:
      '프론트엔드 개발자 박준원의 프로필. AI 챗봇 앱 스타트업 공동 창업자이자 프론트엔드 리드로 Expo 기반 앱 기획부터 배포, 운영, 수익화까지의 전 과정을 주도했습니다.',
    imageAlt: 'Junwon Park - 프론트엔드 개발자 프로필',
    siteName: 'Junwon Park | 프로필',
    locale: 'ko_KR',
    skipLink: '본문으로 건너뛰기',
    schemaDescription:
      '5년 차 프론트엔드 개발자. AI 챗봇 앱 스타트업 공동 창업자이자 프론트엔드 리드로 Expo 기반 앱 기획부터 배포, 운영, 수익화까지의 전 과정을 주도했습니다.',
  },
  en: {
    title: 'Junwon Park | Profile',
    description:
      "Frontend developer Junwon Park's profile. Co-founder and frontend lead of an AI chatbot app startup, leading the entire process from planning to deployment, operations, and monetization of an Expo-based app.",
    ogTitle: 'Junwon Park | Profile',
    ogDescription:
      "Frontend developer Junwon Park's profile. Co-founder and frontend lead of an AI chatbot app startup, leading the entire process from planning to deployment, operations, and monetization of an Expo-based app.",
    twitterTitle: 'Junwon Park | Profile',
    twitterDescription:
      "Frontend developer Junwon Park's profile. Co-founder and frontend lead of an AI chatbot app startup, leading the entire process from planning to deployment, operations, and monetization of an Expo-based app.",
    imageAlt: 'Junwon Park - Frontend Developer Profile',
    siteName: 'Junwon Park | Profile',
    locale: 'en_US',
    skipLink: 'Skip to main content',
    schemaDescription:
      '5-year frontend developer. Co-founder and frontend lead of an AI chatbot app startup, leading the entire process from planning to deployment, operations, and monetization of an Expo-based app.',
  },
};

export const getMetadata = (lang: Language): MetadataContent => {
  return metadataMap[lang];
};
