import type { Metadata } from 'next';

import PrintableResume from '@/lib/components/PrintableResume';
import { printableResume } from '@/lib/data/printableResume';

const RESUME_URL = 'https://resume.junwon.dev';

export const metadata: Metadata = {
  title: '박준원 이력서',
  description: 'Frontend Engineer Junwon Park printable resume.',
  alternates: {
    canonical: RESUME_URL,
  },
  openGraph: {
    title: '박준원 이력서',
    description: 'Frontend Engineer Junwon Park printable resume.',
    type: 'profile',
    url: RESUME_URL,
  },
};

export default function ResumePage() {
  return <PrintableResume resume={printableResume} />;
}
