import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PrivacyEn from '@/content/privacy/privacy.en.mdx';
import PrivacyKo from '@/content/privacy/privacy.ko.mdx';
import { isValidLanguage, type Language } from '@/lib/utils/language';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

const privacyContent: Record<Language, ComponentType> = {
  en: PrivacyEn,
  ko: PrivacyKo,
};

const privacyMetadata: Record<Language, Metadata> = {
  en: {
    title: "Privacy Policy | Junwon's Portfolio",
    description: "Privacy Policy for Junwon's personal portfolio website.",
  },
  ko: {
    title: '개인정보 처리방침 | 박준원 포트폴리오',
    description: '박준원의 개인 포트폴리오 웹사이트 개인정보 처리방침입니다.',
  },
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLanguage(locale)) {
    notFound();
  }

  return privacyMetadata[locale];
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;

  if (!isValidLanguage(locale)) {
    notFound();
  }

  const PrivacyContent = privacyContent[locale];

  return (
    <div style={{ marginTop: 'var(--space-md)', paddingBottom: 'var(--space-lg)' }}>
      <PrivacyContent />
    </div>
  );
}
