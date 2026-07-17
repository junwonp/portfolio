import type { Language } from '@/lib/utils/language';

interface CertificateContent {
  label: string;
}

interface EducationContent {
  major?: string;
  school: string;
}

interface LocalizedRecord<T> {
  content: Record<Language, T>;
}

export const credentials = {
  certificates: [
    {
      content: {
        en: { label: 'AWS training and certification' },
        ko: { label: 'AWS training and certification' },
      },
      id: 'aws',
      link: '/certificates/aws-training.pdf',
    },
    {
      content: {
        en: { label: 'TOPCIT' },
        ko: { label: 'TOPCIT' },
      },
      id: 'topcit',
      link: '/certificates/topcit.pdf',
    },
    {
      content: {
        en: { label: 'Linux Master Grade 2' },
        ko: { label: '리눅스 마스터 2급' },
      },
      id: 'linux_master',
      link: '/certificates/linux-master-2.pdf',
    },
  ] satisfies (LocalizedRecord<CertificateContent> & { id: string; link: string })[],
  education: [
    {
      content: {
        en: { major: 'B.S. in Computer Software Engineering', school: 'Hanyang University' },
        ko: { major: '컴퓨터소프트웨어학부 학사', school: '한양대학교' },
      },
      dateFrom: '2017-03',
      dateTo: '2024-02',
      id: 'hanyang',
    },
    {
      content: {
        en: { school: 'Sejong Science High School' },
        ko: { school: '세종과학고등학교' },
      },
      dateFrom: '2014-03',
      dateTo: '2017-02',
      id: 'sejong',
    },
  ] satisfies (LocalizedRecord<EducationContent> & {
    dateFrom: string;
    dateTo?: string;
    id: string;
  })[],
} as const;
