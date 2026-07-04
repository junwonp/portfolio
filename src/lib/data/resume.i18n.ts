import type {
  CertificateId,
  EducationId,
  WorkExpId,
} from '@/lib/data/resume.shared';
import type { MetricItem, PillarItem } from '@/lib/types/about';
import type { Language } from '@/lib/utils/language';

interface I18nWorkExp {
  additional?: {
    label: string;
    link: string;
  };
  companyName: string;
  titleBadge?: string;
  highlights?: string[];
  role: string;
}

export interface I18nData {
  certificates: Record<CertificateId, { label: string }>;
  education: Record<EducationId, { major?: string; school: string }>;
  introduction: {
    focusKeywords?: string[];
    metrics?: MetricItem[];
    name: string;
    pillars?: PillarItem[];
    tagline: string;
  };
  skills: Record<import('@/lib/data/resume.shared').SkillId, string>;
  skillDetailsLabel?: Partial<Record<import('@/lib/data/resume.shared').SkillId, string>>;
  skillDescriptions?: Partial<Record<import('@/lib/data/resume.shared').SkillId, string>>;
  workExperiences: Record<WorkExpId, I18nWorkExp>;
}

export const i18nData: Record<Language, I18nData> = {
  en: {
    skills: {
      languages: 'Languages',
      frameworks: 'Frameworks',
      ui: 'UI & Design System',
      state: 'State & Data',
      performance: 'Animation & Performance',
      backend: 'Backend & Cloud',
      devops: 'DevOps & Infra',
    },
    skillDescriptions: {},
    skillDetailsLabel: {},
    introduction: {
      name: 'Junwon Park',
      tagline:
        'Frontend Engineer experienced in the entire product lifecycle from inception to growth',
      focusKeywords: [
        'React',
        'TypeScript',
        'Next.js',
        'React Native',
        'TanStack Query',
        'Cloudflare',
      ],
      metrics: [
        { value: '23,000', label: 'MAU (Peak)' },
        { value: '46 min', label: 'Avg. Session' },
        { value: '#57', label: 'Google Play' },
      ],
      pillars: [
        {
          index: '01',
          title: 'Production Frontend Systems',
          description:
            'Building production UI, server-state, and release workflows for React, React Native, and Svelte products.',
        },
        {
          index: '02',
          title: 'Cross-Platform Delivery',
          description:
            'Shipping Android, iOS, Web, and native platform integrations from one coherent product architecture.',
        },
        {
          index: '03',
          title: 'Performance & Verification',
          description:
            'Improving web performance and reliability through tests, CI, browser validation, and secure AI-assisted workflows.',
        },
      ],
    },
    workExperiences: {
      orca_ai: {
        companyName: 'Orca AI Inc.',
        titleBadge: 'Co-Founder',
        role: 'Co-Founder & Frontend Lead',
        highlights: [
          'Designed data-heavy real-time chat UI, optimistic workflows, and type-safe TanStack Query cache architecture',
          'Led full product lifecycle from 0 → 23k MAU, $3k/mo revenue, Google Play #57',
          'Operated a cross-platform Android/iOS/Web product with EAS, GitHub Actions, Sentry, and rollback processes',
        ],
      },
      vault_micro: {
        companyName: 'Vault Micro',
        role: 'Frontend Developer',
        highlights: [
          'Built B2B admin dashboards, reusable CRUD/table components, and operational data monitoring interfaces',
          'Reduced main bundle by 15% (324KB → 277KB) via Webpack Tree Shaking & Code Splitting',
          'Shipped PWA, secure auth, and Paddle subscription lifecycle for a B2B SaaS product solo',
        ],
      },
      mnd: {
        companyName: 'Ministry of National Defense',
        role: 'Software Developer',
        highlights: [
          'Built a virtualized Excel viewer handling thousands of rows with 2D cell selection UX',
          'Designed a reusable component system in a restricted closed-network environment',
          'Integrated Socket.IO for real-time highlight collaboration with mock socket for offline testing',
        ],
      },
    },
    certificates: {
      aws: { label: 'AWS training and certification' },
      topcit: { label: 'TOPCIT' },
      linux_master: { label: 'Linux Master Grade 2' },
    },
    education: {
      hanyang: { school: 'Hanyang University', major: 'B.S. in Computer Software Engineering' },
      sejong: { school: 'Sejong Science High School' },
    },
  },
  ko: {
    skills: {
      languages: '언어',
      frameworks: '프레임워크',
      ui: 'UI 및 디자인 시스템',
      state: '상태 및 데이터',
      performance: '애니메이션 및 성능',
      backend: '백엔드 및 클라우드',
      devops: '데브옵스 및 인프라',
    },
    skillDescriptions: {},
    skillDetailsLabel: {},
    introduction: {
      name: '박준원',
      tagline: '제품의 시작부터 성장까지 직접 경험한 프론트엔드 엔지니어',
      focusKeywords: [
        'React',
        'TypeScript',
        'Next.js',
        'React Native',
        'TanStack Query',
        'Cloudflare',
      ],
      metrics: [
        { value: '23,000', label: 'MAU (최대)' },
        { value: '46분', label: '평균 체류시간' },
        { value: '#57', label: '구글 플레이' },
      ],
      pillars: [
        {
          index: '01',
          title: '프로덕션 프론트엔드 시스템',
          description:
            'React, React Native, Svelte 제품에서 UI, 서버 상태, 배포 흐름까지 운영 가능한 구조로 만듭니다.',
        },
        {
          index: '02',
          title: '크로스플랫폼 제품 출시',
          description:
            'Android, iOS, Web, 네이티브 연동을 하나의 일관된 제품 아키텍처로 연결해 출시합니다.',
        },
        {
          index: '03',
          title: '성능과 검증',
          description:
            '테스트, CI, 브라우저 검증과 함께 AI 에이전트를 안정적으로 제어하는 워크플로우로 개발 속도와 품질을 보장합니다.',
        },
      ],
    },
    workExperiences: {
      orca_ai: {
        companyName: 'Orca AI Inc.',
        titleBadge: 'Co-Founder',
        role: '공동창업자 · 프론트엔드 리드',
        highlights: [
          '**실시간 채팅 UI, Optimistic Workflow, TanStack Query 기반 Type-Safe 캐시 아키텍처** 설계',
          '**0 → 2.3만 MAU, 월 매출 $3k, 구글 플레이 엔터테인먼트 57위**까지 제품 생애주기 주도',
          '**EAS, GitHub Actions, Sentry, 롤백 프로세스** 기반 안드로이드/iOS/웹 크로스플랫폼 제품 운영',
        ],
      },
      vault_micro: {
        companyName: '볼트마이크로 (Vault Micro)',
        role: '프론트엔드 개발자',
        highlights: [
          'B2B SaaS의 **관리자 대시보드, 재사용 가능한 CRUD/테이블 컴포넌트, 운영 데이터 모니터링 UI** 구축',
          'Webpack 트리 쉐이킹 및 코드 스플리팅 최적화로 **메인 번들 15% 감량 (324KB → 277KB)**',
          'B2B SaaS 제품의 **PWA 전환, 보안 인증, Paddle 구독 결제 시스템** 1인 전담 구축',
        ],
      },
      mnd: {
        companyName: '대한민국 국방부',
        role: '소프트웨어 개발병',
        highlights: [
          '수천 행의 데이터를 처리하는 **가상화 엑셀 뷰어 및 2D 영역 선택 UX** 구현',
          '폐쇄망 환경에서 **재사용 가능한 컴포넌트 시스템** 직접 설계 및 도입',
          '**Socket.IO를 활용한 실시간 협업** 기능 및 오프라인 테스트용 Mock 서버 구축',
        ],
      },
    },
    certificates: {
      aws: { label: 'AWS training and certification' },
      topcit: { label: 'TOPCIT' },
      linux_master: { label: '리눅스 마스터 2급' },
    },
    education: {
      hanyang: { school: '한양대학교 ', major: '컴퓨터소프트웨어학부 학사' },
      sejong: { school: 'Sejong Science High School' },
    },
  },
};
