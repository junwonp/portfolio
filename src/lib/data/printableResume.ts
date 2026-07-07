export interface ResumeTextStrongPart {
  strong: true;
  text: string;
}

export type ResumeTextPart = string | ResumeTextStrongPart;

export interface ResumeContactItem {
  href?: string;
  label: string;
  value: string;
}

export interface ResumeProjectBlock {
  bullets: ResumeTextPart[][];
  summary?: ResumeTextPart[];
  title: string;
}

export interface ResumeWorkEntry {
  companyName?: string;
  location?: string;
  period?: string;
  projects: ResumeProjectBlock[];
  role?: string;
}

export interface ResumeSkillGroup {
  label: string;
  values: string[];
}

export interface ResumeSimpleItem {
  bullets: ResumeTextPart[][];
  period: string;
  title: string;
}

export type ResumePageSection =
  | {
      entries: ResumeWorkEntry[];
      title?: string;
      type: 'work';
    }
  | {
      groups: ResumeSkillGroup[];
      title: string;
      type: 'skills';
    }
  | {
      items: ResumeSimpleItem[];
      title: string;
      type: 'simple-list';
    }
  | {
      items: ResumeSimpleItem[];
      title: string;
      type: 'education';
    };

export interface PrintableResumeData {
  contactItems: ResumeContactItem[];
  name: string;
  pages: {
    sections: ResumePageSection[];
  }[];
  role: string;
  summaryBullets: ResumeTextPart[][];
  summaryTitle: string;
}

export const printableResume: PrintableResumeData = {
  name: '박준원 (Junwon Park)',
  role: 'Frontend Engineer',
  contactItems: [
    { label: 'Location', value: 'Seoul, Korea' },
    { href: 'mailto:junwon.p@icloud.com', label: 'Email', value: 'junwon.p@icloud.com' },
    { href: 'https://junwon.dev', label: 'Portfolio', value: 'https://junwon.dev' },
    { href: 'https://github.com/junwonp', label: 'GitHub', value: 'github.com/junwonp' },
  ],
  summaryTitle: '제품의 시작부터 성장까지 직접 경험한 프론트엔드 엔지니어',
  summaryBullets: [
    [
      { strong: true, text: '서비스 구축 및 운영:' },
      ' 아이디어 단계에서 시작해 실제 2.3만 명의 사용자(MAU)가 활동하는 서비스로 키워냈습니다. 기획, 개발, 배포, 운영의 전 과정을 직접 겪으며 안정적인 서비스를 만드는 법을 익혔습니다.',
    ],
    [
      { strong: true, text: '기술적 자립성과 UX 완성도:' },
      ' 외부 UI 라이브러리 의존을 낮추고 요구사항에 최적화된 기능 단위 컴포넌트를 직접 설계하여 UI 시스템을 구축합니다. 플랫폼 동작 원리를 바탕으로 정교한 인터랙션을 구현해 UX 완성도를 관리합니다.',
    ],
    [
      { strong: true, text: '합리적인 기술 선택:' },
      " 최신 기술 자체보다 현재 비즈니스 상황과 '사용자에게 진짜 필요한가'를 기준으로 기술을 선택하고, 테스트와 런타임 검증으로 결과를 확인하는 엔지니어링을 지향합니다.",
    ],
  ],
  pages: [
    {
      sections: [
        {
          type: 'work',
          title: 'Work Experience',
          entries: [
            {
              companyName: '오르카에이아이 (Orca AI Inc.)',
              role: 'Co-Founder & Frontend Lead',
              period: '2024.01 - 2026.05',
              location: 'Seoul, Korea',
              projects: [
                {
                  title: '아이라 - 글로벌 AI 캐릭터 채팅 플랫폼',
                  summary: [
                    '제품 기획부터 프론트엔드 아키텍처, 배포, 운영, 수익화까지 전 과정을 주도하여 ',
                    { strong: true, text: '최고 MAU 2.3만 명, 월 매출 $3,000, 평균 체류 시간 46분' },
                    '을 달성했습니다. (Google Play 엔터테인먼트 최고 ',
                    { strong: true, text: '57위' },
                    ')',
                  ],
                  bullets: [
                    [
                      'Expo Router 기반 ',
                      { strong: true, text: '단일 코드베이스' },
                      '로 Android, iOS, Web을 지원하되, 웹 빌드 시 모바일 앱 전용 라이브러리가 섞여 들어가지 않도록 플랫폼별 코드를 분리하여 빌드 안정성을 확보했습니다.',
                    ],
                    [
                      'Realm -> 서버 DB 마이그레이션 과정에서 재시도 가능한 작업 단위와 상태 플래그를 설계해 ',
                      { strong: true, text: '대화 데이터 유실을 방지' },
                      '했습니다.',
                    ],
                    [
                      'FlashList, React Compiler, Reanimated worklet을 적용해 저사양 기기에서도 안정적인 ',
                      { strong: true, text: '60 FPS 채팅 경험' },
                      '을 유지했습니다.',
                    ],
                    [
                      { strong: true, text: 'Sentry, EAS, GitHub Actions' },
                      ' 기반으로 크래시 추적, TestFlight/Android closed track 배포, 기기 호환성 검증 프로세스를 운영했습니다.',
                    ],
                  ],
                },
                {
                  title: '금융결제원 금융인증서 이벤트 페이지',
                  summary: [
                    '오르카에이아이 소속으로 금융인증서 사용 촉진 이벤트 페이지 개발을 담당하며, 금융권 클라이언트 요구사항에 맞춘 웹 화면 구현과 QA 대응을 수행했습니다.',
                  ],
                  bullets: [
                    [
                      { strong: true, text: 'React' },
                      ' 기반 이벤트 페이지를 구현하고, 다양한 사용자 진입 경로에서도 일관된 화면과 안정적인 사용자 흐름을 제공하도록 구성했습니다.',
                    ],
                    [
                      '요구사항 변경과 QA 피드백을 빠르게 반영하되, 최종 반영 전 직접 코드 리뷰와 빌드 검증으로 배포 품질을 관리했습니다.',
                    ],
                  ],
                },
              ],
            },
            {
              companyName: '볼트마이크로 (Vault Micro)',
              role: 'Frontend Developer',
              period: '2022.01 - 2023.06',
              location: 'Seoul, Korea',
              projects: [
                {
                  title: 'CameraFi Studio - 웹 오버레이 스코어보드',
                  summary: [
                    '오버레이 에디터, 인증 페이지, 다국어 처리, Paddle 구독 결제, 웹훅 기반 갱신 처리까지 포함한 운영 웹 서비스를 구현했습니다.',
                  ],
                  bullets: [
                    [
                      'Webpack Tree Shaking, Code Splitting, Dynamic Import로 메인 번들 사이즈를 ',
                      { strong: true, text: '15% (324KB -> 277KB)' },
                      ' 감량했습니다.',
                    ],
                    [
                      'Firebase Custom Token과 ',
                      { strong: true, text: 'HTTP-only Cookie' },
                      '를 결합해 클라이언트와 서버 간 인증 상태를 안전하게 동기화했습니다.',
                    ],
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      sections: [
        {
          type: 'work',
          entries: [
            {
              projects: [
                {
                  title: 'Internal Admin Dashboard',
                  summary: ['계정, 구독, 제품 사용량, 매출 지표를 관리하는 내부 운영 도구를 구축했습니다.'],
                  bullets: [
                    [
                      'React Table, MUI, TanStack Query를 조합해 목록, 필터, 상세, 생성, 수정 흐름을 재사용 가능한 ',
                      { strong: true, text: 'CRUD/Table 패턴' },
                      '으로 정리했습니다.',
                    ],
                    [
                      'Chart.js 기반 사용량 및 매출 모니터링 화면을 구현해 운영 지표를 실시간에 가깝게 확인할 수 있도록 개선했습니다.',
                    ],
                  ],
                },
              ],
            },
            {
              companyName: '대한민국 국방부 (Ministry of National Defense)',
              role: 'Software Developer (SW개발병)',
              period: '2019.05 - 2020.12',
              location: 'Seoul, Korea',
              projects: [
                {
                  title: '웹 기반 문서 뷰어',
                  bullets: [
                    [
                      '수천 행의 엑셀 데이터를 안정적으로 탐색할 수 있도록 React Table과 ',
                      { strong: true, text: 'Virtualization' },
                      '을 적용해 스크롤 지연을 줄였습니다.',
                    ],
                    [
                      '외부 통신이 차단된 폐쇄망 환경의 한계를 극복하기 위해 ',
                      { strong: true, text: '모의 데이터(fixture)와 가상 소켓(mock socket) 레이어' },
                      '를 설계하여 실시간 UI 동작 및 협업 기능을 성공적으로 테스트했습니다.',
                    ],
                    [
                      '선택 영역 오버레이, 고정 헤더, ErrorBoundary를 적용해 대용량 문서 탐색 중 발생할 수 있는 렌더링 오류와 사용성 문제를 줄였습니다.',
                    ],
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'skills',
          title: 'Skills Set',
          groups: [
            { label: 'Languages', values: ['TypeScript', 'JavaScript'] },
            { label: 'Frontend', values: ['React', 'Next.js', 'React Native', 'Expo'] },
            {
              label: 'Engineering',
              values: ['TanStack Query', 'Zustand', 'Zod', 'FlashList', 'Reanimated'],
            },
            { label: 'UI & Styling', values: ['Tailwind CSS', 'shadcn/ui', 'styled-components', 'MUI'] },
            { label: 'DevOps & Tools', values: ['GitHub Actions', 'Cloudflare', 'Firebase', 'Vitest', 'EAS', 'Sentry', 'Vite', 'Webpack'] },
          ],
        },
        {
          type: 'simple-list',
          title: 'Awards & Projects',
          items: [
            {
              title: 'Next.js & Cloudflare 포트폴리오',
              period: '2026',
              bullets: [
                [
                  'Next.js 16 App Router와 vinext를 Cloudflare Workers에 배포하고, D1/R2/KV 기반 관리자 편집 및 분석 흐름을 운영 가능한 구조로 정리했습니다.',
                ],
              ],
            },
            {
              title: '오늘날씨 (Today’s Weather) — 개인화 날씨 서비스',
              period: '2026.04',
              bullets: [
                [
                  '기상청 및 에어코리아 데이터를 활용해 최적의 복장과 준비물을 제안하는 1인 개발 서비스입니다. Turbopack 기반 모노레포 구조에서 Next.js와 Expo Router로 PWA 환경을 구축하고 API 호출 부하를 80% 이상 절감했습니다.',
                ],
              ],
            },
            {
              title: '2021 우리은행 해커톤 본선 진출 / OnelineBank 리빌드',
              period: '2021.04',
              bullets: [
                [
                  'React Native 기반 핀테크 MVP로 본선에 진출했으며, 이후 기존 JavaScript 코드를 TypeScript로 전환하고 Expo Router, TanStack Query, Zustand, EAS 기반으로 리빌드했습니다.',
                ],
              ],
            },
          ],
        },
        {
          type: 'education',
          title: 'Education',
          items: [
            {
              title: '한양대학교 (Hanyang University) | 컴퓨터소프트웨어학부 학사',
              period: '2017.03 - 2024.02',
              bullets: [],
            },
            {
              title: '세종과학고등학교 (Sejong Science High School)',
              period: '2014.03 - 2017.02',
              bullets: [],
            },
          ],
        },
      ],
    },
  ],
};
