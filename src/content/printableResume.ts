export interface ResumeTextStrongPart {
  strong: true;
  text: string;
}

export interface ResumeTextCodePart {
  code: true;
  text: string;
}

export type ResumeTextPart = string | ResumeTextStrongPart | ResumeTextCodePart;

export interface ResumeContactItem {
  href?: string;
  label: string;
  value: string;
}

export interface ResumeHeroMetric {
  label: string;
  value: string;
}

export interface ResumeProjectBlock {
  bullets: ResumeTextPart[][];
  period?: string;
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
  heroMetrics: ResumeHeroMetric[];
  name: string;
  pages: {
    sections: ResumePageSection[];
  }[];
  role: string;
  summaryBullets: ResumeTextPart[][];
  summaryTitle: string;
  techKeywords: string[];
}

export type ResumeVariantId = 'web' | 'web-rn' | 'ops-data';

const strong = (text: string): ResumeTextStrongPart => ({ strong: true, text });

// ---------------------------------------------------------------------------
// Company entry factories — shared across variants
// ---------------------------------------------------------------------------

const orcaEntry = (projects: ResumeProjectBlock[]): ResumeWorkEntry => ({
  companyName: '오르카에이아이 (Orca AI Inc.)',
  role: 'Frontend Lead (Co-Founder)',
  period: '2024.01 - 2026.07',
  location: 'Seoul, Korea',
  projects,
});

const vaultEntry = (projects: ResumeProjectBlock[]): ResumeWorkEntry => ({
  companyName: '볼트마이크로 (Vault Micro)',
  role: 'Frontend Developer',
  period: '2022.01 - 2023.06',
  location: 'Seoul, Korea',
  projects,
});

const mndEntry = (projects: ResumeProjectBlock[]): ResumeWorkEntry => ({
  companyName: '대한민국 국방부 (Ministry of National Defense)',
  role: 'Software Developer (SW개발병 · 병장 만기전역)',
  period: '2019.05 - 2020.12',
  location: 'Seoul, Korea',
  projects,
});

// ---------------------------------------------------------------------------
// Project blocks — positioning-aware bullet sets for Aira, fixed for the rest
// ---------------------------------------------------------------------------

const airaSummary: ResumeTextPart[] = [
  '제품 기획부터 프론트엔드 아키텍처, 배포, 운영, 수익화까지 전 과정을 주도하여 ',
  strong('최고 MAU 2.3만 명, 월 매출 $3,000, 평균 체류 시간 46분'),
  '을 달성했습니다. (Google Play 엔터테인먼트 최고 ',
  strong('57위'),
  ')',
];

const airaBlocks: Record<ResumeVariantId, ResumeProjectBlock> = {
  // 웹 포지션: 모바일 전용 어휘를 줄이고 웹 지원 구조와 데이터 계층 관점으로 서술
  web: {
    title: '아이라 - 글로벌 AI 캐릭터 채팅 플랫폼',
    period: '2024.07 – 2025.12',
    summary: airaSummary,
    bullets: [
      [
        'Expo 기반 ',
        strong('단일 코드베이스'),
        '로 Android, iOS, Web을 지원하되, 웹 빌드에 모바일 전용 라이브러리가 섞이지 않도록 플랫폼별 번들을 격리해 빌드 안정성을 확보했습니다.',
      ],
      [
        'Type-Safe한 ',
        strong('쿼리 캐시 파사드(queryData)'),
        '로 API 계층을 정리하고, InfiniteQuery 기반 실시간 패치로 스트리밍 UI를 구현했습니다.',
      ],
      [
        strong('React Compiler'),
        ' 도입으로 수동 메모이제이션을 전면 제거하고, 2.3만 사용자 생성(UGC) 캐릭터 검수를 위한 내부 심사 도구 기능을 지원해 운영 효율을 개선했습니다.',
      ],
      [
        '사용자 경험을 해치지 않는 ',
        strong('커스텀 네이티브 광고'),
        '로 월 매출 $3,000을 달성했습니다.',
      ],
    ],
  },
  // 크로스플랫폼 포지션: 기존의 공유 구조 서사를 유지
  'web-rn': {
    title: '아이라 - 글로벌 AI 캐릭터 채팅 플랫폼',
    period: '2024.07 – 2025.12',
    summary: airaSummary,
    bullets: [
      [
        'Expo Router 기반 ',
        strong('단일 코드베이스'),
        '로 Android, iOS, Web을 지원하되, 웹 빌드 시 모바일 앱 전용 라이브러리가 섞여 들어가지 않도록 플랫폼별 코드를 분리하여 빌드 안정성을 확보했습니다.',
      ],
      [
        'Realm -> 서버 DB 마이그레이션 과정에서 재시도 가능한 작업 단위와 상태 플래그를 설계해 ',
        strong('대화 데이터 유실을 방지'),
        '했습니다.',
      ],
      [
        'FlashList, React Compiler, Reanimated worklet을 적용해 저사양 기기에서도 안정적인 ',
        strong('60 FPS 채팅 경험'),
        '을 유지했습니다.',
      ],
      [
        strong('즉시 실행 경험: '),
        'MMKV 기반 ',
        strong('TanStack Query 영속 캐시'),
        '로 재실행 즉시 데이터를 복원하고, 2.3만 UGC 캐릭터 심사 도구로 운영 효율을 개선했습니다.',
      ],
      [
        'Unistyles 기반 ',
        strong('디자인 토큰 시스템'),
        '으로 라이트·다크 테마 전환 시 깜빡임 없이 지원했습니다.',
      ],
      [strong('typesafe-i18n'), '으로 컴파일 타임 i18n Type Safety를 확보했습니다.'],
    ],
  },
  // 운영/데이터 포지션: 데이터 무결성과 캐시 계층 관점으로 서술
  'ops-data': {
    title: '아이라 - 글로벌 AI 캐릭터 채팅 플랫폼',
    period: '2024.07 – 2025.12',
    summary: airaSummary,
    bullets: [
      [
        'Realm -> Firestore 마이그레이션에서 재시도 가능한 작업 단위와 상태 플래그를 설계해 ',
        strong('대화 데이터 유실을 방지'),
        '했습니다.',
      ],
      [
        'Type-Safe한 ',
        strong('쿼리 캐시 파사드(queryData)'),
        '로 서버 데이터 접근을 단일 계층으로 정리했습니다.',
      ],
      [strong('Zod 스키마 연동'), '으로 선언적 입력 폼을 제어해 검증 로직 중복을 제거했습니다.'],
      [
        strong('프레젠테이션·컨테이너 분리'),
        '로 화면 로직과 데이터 흐름을 분리해 유지보수성을 높였습니다.',
      ],
    ],
  },
};

const hanyangChatbotBlock: ResumeProjectBlock = {
  title: '한양대학교 창업지원단 AI 챗봇 위젯',
  period: '2024.01 – 2024.03',
  summary: [
    '스크립트 한 줄로 고객사 웹사이트에 임베드되는 화이트라벨 AI 챗봇 위젯의 프론트엔드를 전담 개발했습니다.',
  ],
  bullets: [
    [
      '위젯 전체를 Shadow DOM(closed) 안에 렌더링하고 ',
      { code: true, text: 'orca.setup(websiteId)' },
      ' SDK로 웹사이트 ID만으로 자가 구성되는 멀티테넌트 임베드 구조를 구축했습니다.',
    ],
    [
      '토큰 단위 스트리밍을 ',
      strong('마지막 메시지만 증분 렌더링'),
      '하는 병합 로직으로 처리하고, 한글 IME 조합 감지 전송 등 한국어·모바일 UX 디테일을 구현했습니다.',
    ],
  ],
};

const kftcProjectItem: ResumeSimpleItem = {
  title: '금융결제원 금융인증서 이벤트 페이지',
  period: '2026.04 – 2026.05',
  bullets: [
    [
      '오르카에이아이 소속으로 금융결제원 금융인증서 프로모션 웹 페이지 개발과 클라이언트 QA 대응을 담당했습니다.',
    ],
    [
      strong('민감 데이터 캐시 설계: '),
      '세션·포인트·알림은 persistence에서 제외하고 안전한 데이터만 영속화하도록 TanStack Query 캐시를 설계했습니다.',
    ],
    [strong('Express Mock 서버·Storybook'), ' 으로 백엔드 개발과 병렬로 화면 상태를 검증했습니다.'],
  ],
};

const camerafiStudioBlock: ResumeProjectBlock = {
  title: 'CameraFi Studio - 웹 오버레이 스코어보드',
  period: '2022.02 – 2023.06',
  summary: [
    strong('1인 개발로 시작해 사내 두 번째 메인 수익 모델'),
    '로 성장시킨 스포츠 중계 오버레이 웹 SaaS입니다.',
  ],
  bullets: [
    [
      'Webpack Tree Shaking, Code Splitting, Dynamic Import로 메인 번들 사이즈를 ',
      strong('15% (324KB -> 277KB)'),
      ' 감량했습니다.',
    ],
    [
      'Firebase Custom Token과 ',
      strong('HTTP-only Cookie'),
      '를 결합해 클라이언트와 서버 간 인증 상태를 안전하게 동기화했습니다.',
    ],
    [
      strong('GDPR 쿠키 동의'),
      ' 배너·제어 로직을 서드파티 도구 없이 직접 구현해 외부 스크립트 로딩 없이 페이지 속도를 지켰습니다.',
    ],
  ],
};

// ops-data 변형용 축소판 — 결제·구독 라이프사이클이 운영 관점의 핵심
const camerafiStudioBlockOpsData: ResumeProjectBlock = {
  title: 'CameraFi Studio - 웹 오버레이 스코어보드',
  period: '2022.02 – 2023.06',
  summary: [
    strong('1인 개발로 시작해 사내 두 번째 메인 수익 모델'),
    '로 성장시킨 스포츠 중계 오버레이 웹 SaaS입니다.',
  ],
  bullets: [
    [strong('Paddle 구독 결제·웹훅 갱신'), ' 처리를 연동해 결제 라이프사이클 전반을 운영했습니다.'],
  ],
};

// ops-data 변형용 강화판 — 정량 성과와 상태 경계 설계를 전면에
const adminDashboardBlockOpsData: ResumeProjectBlock = {
  title: 'Internal Admin Dashboard',
  period: '2022.03 – 2023.06',
  summary: ['계정, 구독, 제품 사용량, 매출 지표를 관리하는 내부 운영 도구를 구축했습니다.'],
  bullets: [
    [
      'React Table, MUI, TanStack Query를 조합해 목록, 필터, 상세, 생성, 수정 흐름을 재사용 가능한 ',
      strong('CRUD/Table 패턴'),
      '으로 정리했습니다.',
    ],
    [
      strong('운영 화면 확장성: '),
      '공통 상호작용 모델로 신규 관리 화면 개발을 ',
      strong('3일 → 반나절'),
      '로 단축했습니다.',
    ],
    [strong('query → table 단방향 흐름'), '으로 서버 상태와 UI 상태의 충돌을 원천 차단했습니다.'],
  ],
};

// 크로스플랫폼 변형용 축소판 — RN 관점이 없는 web SaaS이므로 핵심 수치만 유지
const camerafiStudioBlockWebRn: ResumeProjectBlock = {
  title: 'CameraFi Studio - 웹 오버레이 스코어보드',
  period: '2022.02 – 2023.06',
  summary: [
    strong('1인 개발로 시작해 사내 두 번째 메인 수익 모델'),
    '로 성장시킨 스포츠 중계 오버레이 웹 SaaS입니다.',
  ],
  bullets: [
    [
      'Webpack Tree Shaking, Code Splitting, Dynamic Import로 메인 번들 사이즈를 ',
      strong('15% (324KB -> 277KB)'),
      ' 감량했습니다.',
    ],
  ],
};

const adminDashboardBlock: ResumeProjectBlock = {
  title: 'Internal Admin Dashboard',
  period: '2022.03 – 2023.06',
  summary: ['계정, 구독, 제품 사용량, 매출 지표를 관리하는 내부 운영 도구를 구축했습니다.'],
  bullets: [
    [
      'React Table, MUI, TanStack Query를 조합해 목록, 필터, 상세, 생성, 수정 흐름을 재사용 가능한 ',
      strong('CRUD/Table 패턴'),
      '으로 정리했습니다.',
    ],
    [
      strong('운영 화면 확장성: '),
      '반복되는 운영 흐름이 같은 상호작용 모델을 공유하도록 설계해 신규 화면 추가 속도를 개선했습니다.',
    ],
  ],
};

const mndViewerBlock: ResumeProjectBlock = {
  title: '웹 기반 문서 뷰어',
  period: '2020.08 – 2020.10',
  summary: [
    '수천 행 규모의 엑셀·문서 데이터를 다루는 폐쇄망 웹 뷰어의 프론트엔드를 단독 개발했습니다.',
  ],
  bullets: [
    [
      '수천 행의 엑셀 데이터를 안정적으로 탐색할 수 있도록 React Table과 ',
      strong('Virtualization'),
      '을 적용해 스크롤 지연을 줄였습니다.',
    ],
    [
      '외부 통신이 차단된 폐쇄망 환경의 한계를 극복하기 위해 ',
      strong('모의 데이터(fixture)와 가상 소켓(mock socket) 레이어'),
      '를 설계하여 실시간 UI 동작 및 협업 기능을 성공적으로 테스트했습니다.',
    ],
    [
      strong('react-window·react-virtualized'),
      ' 이중 렌더러로 그리드와 가변 줄 텍스트를 가상화하고, ',
      strong('역방향 텍스트 범위 정규화'),
      '까지 구현했습니다.',
    ],
  ],
};

// ---------------------------------------------------------------------------
// Positioning summaries — carried by the resume headline and bullets
// ---------------------------------------------------------------------------

const summaries: Record<ResumeVariantId, { bullets: ResumeTextPart[][]; title: string }> = {
  web: {
    title: '웹 플랫폼 성능 최적화와 크로스플랫폼 아키텍처를 설계하는 5년 차 프론트엔드 엔지니어',
    bullets: [
      [strong('웹 성능: '), '번들 15% 감량(324→277KB)·1K+ 행 가상화로 렌더링 지연 해소'],
      [strong('프로덕션: '), 'MAU 2.3만 서비스·어드민/SaaS 프론트엔드 아키텍처 리드'],
      [
        strong('실시간·보안: '),
        'SSE 스트리밍, HTTP-only Cookie 인증, 폐쇄망 개발+민감 데이터 캐시 설계',
      ],
    ],
  },
  'web-rn': {
    title: '크로스플랫폼 서비스의 아키텍처와 성능을 설계하는 5년 차 프론트엔드 엔지니어',
    bullets: [
      [strong('크로스플랫폼: '), 'Android·iOS·Web 단일 코드베이스, 플랫폼별 번들 격리'],
      [strong('성능: '), '저사양 기기 60 FPS, 웹 빌드 번들 15% 감량'],
      [
        strong('실시간·보안: '),
        'SSE 스트리밍, HTTP-only Cookie 인증, 폐쇄망 개발+민감 데이터 캐시 설계',
      ],
    ],
  },
  'ops-data': {
    title: '운영 데이터와 대규모 데이터 UI를 설계하는 5년 차 웹 프론트엔드 엔지니어',
    bullets: [
      [strong('대규모 데이터 UI: '), '1K+ 행 가상화, CRUD/Table 재사용 패턴 구축'],
      [strong('데이터 무결성: '), '재시도 가능한 작업 단위로 마이그레이션 유실 방지'],
      [
        strong('실시간·보안: '),
        'SSE 스트리밍, HTTP-only Cookie 인증, 폐쇄망 개발+민감 데이터 캐시 설계',
      ],
    ],
  },
};

// Scannable number badges in the hero — values and labels mirror the
// portfolio project metrics (detail MDX frontmatter)
const heroMetricsByVariant: Record<ResumeVariantId, ResumeHeroMetric[]> = {
  web: [
    { value: '15%', label: '번들 감량' },
    { value: '1K+ 행', label: '데이터 가상화' },
    { value: '$3,000', label: '월 매출' },
    { value: '2.3만', label: '최고 MAU' },
  ],
  'web-rn': [
    { value: '2.3만', label: '최고 MAU' },
    { value: '$3,000', label: '월 매출' },
    { value: '46분', label: '평균 체류' },
    { value: '57위', label: 'Google Play' },
  ],
  'ops-data': [
    { value: '1K+ 행', label: '가상화 그리드' },
    { value: 'Mock', label: '오프라인 검증' },
    { value: 'CRUD', label: '재사용 패턴' },
    { value: '2.3만', label: '최고 MAU' },
  ],
};

// One-line keyword signal for ATS/JD matching before the work section
const techKeywordsByVariant: Record<ResumeVariantId, string[]> = {
  web: [
    'React',
    'Next.js',
    'TypeScript',
    'TanStack Query',
    'React Table',
    'Webpack',
    'Tailwind CSS',
    'Vitest',
  ],
  'web-rn': [
    'React',
    'React Native',
    'Expo',
    'TypeScript',
    'TanStack Query',
    'Zustand',
    'Reanimated',
    'FlashList',
  ],
  'ops-data': [
    'React',
    'TypeScript',
    'TanStack Query',
    'React Table',
    'React Window',
    'Chart.js',
    'Zod',
    'Vitest',
  ],
};

// ---------------------------------------------------------------------------
// Shared sections — skills, awards, education
// ---------------------------------------------------------------------------

const skillsSection: ResumePageSection = {
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
    {
      label: 'DevOps & Tools',
      values: [
        'GitHub Actions',
        'Cloudflare',
        'Firebase',
        'Vitest',
        'EAS',
        'Sentry',
        'Vite',
        'Webpack',
      ],
    },
  ],
};

const awardsSection: ResumePageSection = {
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
    kftcProjectItem,
    {
      title: '서울 캠퍼스타운 사업 선정 (Orca AI)',
      period: '2024',
      bullets: [
        [
          '서울 캠퍼스타운 창업 지원 사업에 선정되어 AI 캐릭터 채팅 사업의 시장성·사업화 가능성을 외부 기관으로부터 검증받고 사무 공간과 사업화 지원을 확보했습니다.',
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
        [
          '본선 MVP는 ',
          strong('5일 만에 1인 개발'),
          '로 구현했고, 2026년 리빌드에서는 이전 구조와의 전후 차이를 비교할 수 있게 정리했습니다.',
        ],
      ],
    },
  ],
};

const educationSection: ResumePageSection = {
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
};

const certificatesSection: ResumePageSection = {
  type: 'simple-list',
  title: 'Certificates',
  items: [
    {
      title: 'TOPCIT 수준 3 · 리눅스마스터 2급',
      period: '',
      bullets: [],
    },
  ],
};

// ---------------------------------------------------------------------------
// Page layouts — strictly reverse-chronological (Orca AI -> Vault Micro -> MND)
// while adapting project bullets and summaries to the target variant
// ---------------------------------------------------------------------------

const buildPages = (variant: ResumeVariantId): PrintableResumeData['pages'] => {
  // 크로스플랫폼 변형: RN 관점이 없는 프로젝트는 축소하거나 2페이지로 내리고,
  // 아이라(확장)가 1페이지를 주도하도록 구성
  if (variant === 'web-rn') {
    return [
      {
        sections: [
          {
            type: 'work',
            title: 'Work Experience',
            entries: [
              orcaEntry([airaBlocks[variant]]),
              vaultEntry([camerafiStudioBlockWebRn, adminDashboardBlock]),
            ],
          },
        ],
      },
      {
        sections: [
          {
            type: 'work',
            entries: [mndEntry([mndViewerBlock])],
          },
          skillsSection,
          awardsSection,
          certificatesSection,
          educationSection,
        ],
      },
    ];
  }

  // 운영/데이터 변형: 결제·CRUD·가상화 등 운영 관점 소재를 1페이지에 집중
  if (variant === 'ops-data') {
    return [
      {
        sections: [
          {
            type: 'work',
            title: 'Work Experience',
            entries: [
              orcaEntry([airaBlocks[variant]]),
              vaultEntry([camerafiStudioBlockOpsData, adminDashboardBlockOpsData]),
              mndEntry([mndViewerBlock]),
            ],
          },
        ],
      },
      {
        sections: [skillsSection, awardsSection, certificatesSection, educationSection],
      },
    ];
  }

  return [
    {
      sections: [
        {
          type: 'work',
          title: 'Work Experience',
          entries: [
            orcaEntry([airaBlocks[variant], hanyangChatbotBlock]),
            vaultEntry([camerafiStudioBlock, adminDashboardBlock]),
          ],
        },
      ],
    },
    {
      sections: [
        {
          type: 'work',
          entries: [mndEntry([mndViewerBlock])],
        },
        skillsSection,
        awardsSection,
        certificatesSection,
        educationSection,
      ],
    },
  ];
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const parseResumeVariant = (value: string | null | undefined): ResumeVariantId | null => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'web' || normalized === 'web-rn' || normalized === 'ops-data') {
    return normalized as ResumeVariantId;
  }
  if (normalized === 'rn' || normalized === 'mobile' || normalized === 'ai') {
    return 'web-rn';
  }
  if (normalized === 'opsdata' || normalized === 'ops-data' || normalized === 'ops') {
    return 'ops-data';
  }
  return null;
};

// Maps a short link's positioning (role + summary preset) to the resume
// variant that matches it
export const resolveResumeVariant = (
  role: string | null | undefined,
  summaryPreset: string | null | undefined,
): ResumeVariantId => {
  if (summaryPreset === 'ops-data') return 'ops-data';
  if (summaryPreset === 'web-rn' || role === 'ai' || role === 'mobile') return 'web-rn';
  return 'web';
};

const baseContactItems: ResumeContactItem[] = [
  { label: 'Location', value: 'Seoul, Korea' },
  { href: 'mailto:me@junwon.dev', label: 'Email', value: 'me@junwon.dev' },
  { href: 'https://junwon.dev', label: 'Portfolio', value: 'https://junwon.dev' },
  { href: 'https://github.com/junwonp', label: 'GitHub', value: 'github.com/junwonp' },
];

export const getPrintableResume = (
  variant: ResumeVariantId = 'web',
  portfolioUrl?: string,
): PrintableResumeData => ({
  name: '박준원 (Junwon Park)',
  role: 'Frontend Engineer · 5년 차',
  contactItems: portfolioUrl
    ? baseContactItems.map((item) =>
        item.label === 'Portfolio' ? { ...item, href: portfolioUrl, value: portfolioUrl } : item,
      )
    : baseContactItems,
  heroMetrics: heroMetricsByVariant[variant],
  summaryTitle: summaries[variant].title,
  summaryBullets: summaries[variant].bullets,
  techKeywords: techKeywordsByVariant[variant],
  pages: buildPages(variant),
});

// Default export backs the generic resume page (resume.junwon.dev); most
// applications target web positions, so the web variant is the default
export const printableResume: PrintableResumeData = getPrintableResume('web');
