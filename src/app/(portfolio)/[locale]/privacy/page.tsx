import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ComponentType } from 'react';

import PrivacyEn from '@/content/privacy/privacy.en.mdx';
import PrivacyKo from '@/content/privacy/privacy.ko.mdx';
import { getPrivacyMetadata } from '@/lib/portfolio/metadata';
import { isValidLanguage, type Language } from '@/lib/utils/language';

import * as styles from './privacy.css';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

const privacyContent: Record<Language, ComponentType> = {
  en: PrivacyEn,
  ko: PrivacyKo,
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLanguage(locale)) {
    notFound();
  }

  return getPrivacyMetadata(locale);
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;

  if (!isValidLanguage(locale)) {
    notFound();
  }

  const PrivacyContent = privacyContent[locale];

  return (
    <article className={styles.privacyContent}>
      <PrivacyContent />
    </article>
  );
}
