import type { CareerId } from '@/lib/portfolio/types';
import { CAREER_ID } from '@/lib/portfolio/types';
import type { Language } from '@/lib/utils/language';

export interface CareerLocaleContent {
  additional?: { label: string; link: string };
  companyName: string;
  dateFrom: string;
  dateTo?: string;
  highlights?: string[];
  role: string;
  titleBadge?: string;
}

export interface CareerCatalogEntry {
  content: Record<Language, CareerLocaleContent>;
  id: CareerId;
}

export const careerCatalog: readonly CareerCatalogEntry[] = [
  {
    id: CAREER_ID.orcaAi,
    content: {
      en: {
        companyName: 'Orca AI Inc.',
        titleBadge: 'Co-Founder',
        role: 'Co-Founder & Frontend Lead',
        dateFrom: '2024-01',
        highlights: [
          'Designed data-heavy real-time chat UI, optimistic workflows, and type-safe TanStack Query cache architecture',
          'Led full product lifecycle from 0 → 23k MAU, $3k/mo revenue, Google Play #57',
          'Operated a cross-platform Android/iOS/Web product with EAS, GitHub Actions, Sentry, and rollback processes',
        ],
      },
      ko: {
        companyName: 'Orca AI Inc.',
        titleBadge: 'Co-Founder',
        role: '공동창업자 · 프론트엔드 리드',
        dateFrom: '2024-01',
        highlights: [
          '**실시간 채팅 UI, Optimistic Workflow, TanStack Query 기반 Type-Safe 캐시 아키텍처** 설계',
          '**0 → 2.3만 MAU, 월 매출 $3k, 구글 플레이 엔터테인먼트 57위**까지 제품 생애주기 주도',
          '**EAS, GitHub Actions, Sentry, 롤백 프로세스** 기반 안드로이드/iOS/웹 크로스플랫폼 제품 운영',
        ],
      },
    },
  },
  {
    id: CAREER_ID.vaultMicro,
    content: {
      en: {
        companyName: 'Vault Micro',
        role: 'Frontend Developer',
        dateFrom: '2022-01',
        dateTo: '2023-06',
        highlights: [
          'Built B2B admin dashboards, reusable CRUD/table components, and operational data monitoring interfaces',
          'Reduced main bundle by 15% (324KB → 277KB) via Webpack Tree Shaking & Code Splitting',
          'Shipped PWA, secure auth, and Paddle subscription lifecycle for a B2B SaaS product solo',
        ],
      },
      ko: {
        companyName: '볼트마이크로 (Vault Micro)',
        role: '프론트엔드 개발자',
        dateFrom: '2022-01',
        dateTo: '2023-06',
        highlights: [
          'B2B SaaS의 **관리자 대시보드, 재사용 가능한 CRUD/테이블 컴포넌트, 운영 데이터 모니터링 UI** 구축',
          'Webpack 트리 쉐이킹 및 코드 스플리팅 최적화로 **메인 번들 15% 감량 (324KB → 277KB)**',
          'B2B SaaS 제품의 **PWA 전환, 보안 인증, Paddle 구독 결제 시스템** 1인 전담 구축',
        ],
      },
    },
  },
  {
    id: CAREER_ID.mnd,
    content: {
      en: {
        companyName: 'Ministry of National Defense',
        role: 'Software Developer',
        dateFrom: '2019-05',
        dateTo: '2020-12',
        highlights: [
          'Built a virtualized Excel viewer handling thousands of rows with 2D cell selection UX',
          'Designed a reusable component system in a restricted closed-network environment',
          'Integrated Socket.IO for real-time highlight collaboration with mock socket for offline testing',
        ],
      },
      ko: {
        companyName: '대한민국 국방부',
        role: '소프트웨어 개발병',
        dateFrom: '2019-05',
        dateTo: '2020-12',
        highlights: [
          '수천 행의 데이터를 처리하는 **가상화 엑셀 뷰어 및 2D 영역 선택 UX** 구현',
          '폐쇄망 환경에서 **재사용 가능한 컴포넌트 시스템** 직접 설계 및 도입',
          '**Socket.IO를 활용한 실시간 협업** 기능 및 오프라인 테스트용 Mock 서버 구축',
        ],
      },
    },
  },
];
