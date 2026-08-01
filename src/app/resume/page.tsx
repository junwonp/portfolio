import type { Metadata } from 'next';

import PrintableResume from '@/components/resume/PrintableResume';
import { printableResume } from '@/content/printableResume';

const RESUME_URL = 'https://resume.junwon.dev';

export const metadata: Metadata = {
  title: '박준원 이력서',
  description: '프론트엔드 개발자 박준원의 인쇄용 이력서입니다.',
  alternates: {
    canonical: RESUME_URL,
  },
  openGraph: {
    title: '박준원 이력서',
    description: '프론트엔드 개발자 박준원의 인쇄용 이력서입니다.',
    type: 'profile',
    url: RESUME_URL,
  },
};

export default function ResumePage() {
  return <PrintableResume resume={printableResume} />;
}
