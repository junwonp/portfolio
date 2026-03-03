import type {
  ArchiveProps,
  CertificateProps,
  EducationProps,
  IntroductionProps,
  OtherExperienceProps,
  SkillProps,
  WorkExperienceProps,
} from '../../types/about';
import { GITHUB_PROFILE, LINKEDIN_PROFILE } from './constants';

export const introduction: IntroductionProps = {
  name: '박준원',
  role: 'Frontend Engineer',
  tagline: '제품의 시작부터 성장까지 직접 경험한 프론트엔드 엔지니어',
  githubLink: GITHUB_PROFILE,
  linkedinLink: LINKEDIN_PROFILE,
  briefing: [
    '아이디어 단계에서 시작해 실제 2.3만 명의 사용자(MAU)가 활동하는 서비스로 키워낸 경험이 있습니다. 기획부터 개발, 배포, 운영의 전 과정을 직접 겪으며 안정적인 서비스를 만드는 법을 익혔습니다.',
    '공식 문서를 집요하게 파고들어 원리를 이해하고, 라이브러리에만 의존하기보다 필요한 기능을 직접 구현하는 것을 선호합니다. 독자적인 UI 시스템을 설계하고 렌더링 성능을 극한으로 최적화해본 경험이 있습니다.',
    '무조건 최신 기술이나 화려한 기술을 쫓기보다, 현재 비즈니스 상황과 "사용자에게 진짜 필요한가"를 기준으로 기술을 선택하고 적용하는 합리적인 엔지니어링을 지향합니다.',
  ],
};

export const workExperiences: WorkExperienceProps[] = [
  {
    companyName: '오르카에이아이 주식회사',
    dateFrom: '2024-01',
    project: [
      {
        title: '아이라',
        dateFrom: '2024-01',
        description:
          '글로벌 AI 캐릭터 채팅 플랫폼입니다. 공동 창업자이자 프론트엔드 리드로서 기획, 개발, 운영 전 과정을 주도했습니다.',
        detail: [
          "**[핵심 성과]** MAU 2.3만 명, 월 매출 $3,000 달성 및 평균 체류 시간 46분의 고몰입 서비스 구축 (Google Play 엔터테인먼트 최고 57위 / '25.02 기준)",
          '**[아키텍처 고도화]** 초기 로컬 모델의 한계를 극복하기 위해 서버 기반 멀티 모델로 전환하고, 기존 Realm 데이터를 Firestore로 유실 없이 이관(Migration)하는 로직 구현. **React Query Persister**를 도입하여 초기 로딩 속도 개선 및 서버 데이터 캐싱 전략 수립',
          '**[크로스 플랫폼 설계]** **Expo Router** 기반의 단일 코드베이스로 Android, iOS, Web을 동시에 지원하고, **Universal Link**를 적용하여 플랫폼 간 매끄러운 연결 경험 제공',
          '**[렌더링 성능 최적화]** **Flashlist**를 도입하여 뷰 재사용성을 높여 저사양 기기에서의 프레임 드랍을 방지하고, **React Compiler**를 선제적으로 도입하여 코드 복잡도 감소 및 렌더링 효율화',
          '**[고성능 인터랙션 & R&D]** **iOS 26 Liquid Glass** 및 **Shorts 스타일의 스와이프 UI**를 구현하여 차세대 인터페이스를 실험(V2)하고, **Reanimated(v4)**로 네이티브 수준의 60fps 제스처 애니메이션 구현',
          '**[UX 중심 수익화]** 채팅 경험을 해치지 않는 **Native Ads** UI를 직접 설계하여 이질감 없는 광고 노출 및 레이아웃 안정성(CLS 방지) 확보',
          '**[서비스 안정성]** Sentry 및 dSYM 연동으로 정밀한 에러 트래킹 환경을 구축하고, 특정 Android 기기 이슈 발생 시 **신속한 롤백(Rollback)** 프로세스로 사용자 이탈 방어. **Zod**를 도입하여 런타임 데이터의 타입 안정성(Type Safety) 확보',
          '**[운영 효율화]** **EAS** 및 **GitHub Actions** 기반의 CI/CD 파이프라인(Android 비공개 트랙 자동 배포, iOS TestFlight)을 구축하고, **Samsung Test Lab**을 활용한 기기 호환성 테스트 프로세스 정립',
          '**[글로벌 확장]** **i18n** 도입으로 3개국어(한/영/일)를 지원하여 글로벌 유저 유입을 이끌어냈으며, `llama.rn`을 활용한 **온디바이스(On-device) sLLM PoC**를 수행하여 엣지 컴퓨팅 가능성 검증',
        ],
        detailLink: '/projects/aira',
        productLink: 'https://aira.gg',
        skills: [
          'React Native',
          'TypeScript',
          'Expo',
          'Flashlist',
          'Reanimated',
          'React Query',
          'Zod',
          'Firebase',
          'Sentry',
        ],
      },
    ],
    role: 'Co-Founder / Frontend Lead',
  },
  {
    companyName: '볼트마이크로',
    dateFrom: '2022-01',
    dateTo: '2023-06',
    project: [
      {
        title: 'CameraFi Studio',
        dateFrom: '2022-02',
        dateTo: '2023-06',
        description:
          '웹 오버레이 스코어보드 서비스입니다. 1인 개발로 시작하여 프론트엔드 아키텍처를 구축하고 사내 핵심 프로젝트로 성장시켰습니다.',
        detail: [
          '**[번들 사이즈 최적화]** Webpack 설정 최적화(Tree Shaking, Code Splitting) 및 Dynamic Import 적용으로 메인 번들 사이즈 15% 감량(324KB → 277KB) 및 TTI 단축',
          '**[보안 및 인증]** 라이브러리에 의존하지 않고 Cookie Consent 및 토큰 기반 인증 로직을 직접 구현하여 외부 의존성 제거 및 보안성 강화',
          '**[글로벌 아키텍처]** i18n 시스템 및 MUI와 Styled-components를 결합한 **전역 테마 시스템**을 구축하여 디자인 변경에 유연한 구조 설계',
          '**[서비스 고도화]** Next-PWA를 도입하여 앱 수준의 설치 경험(A2HS)을 제공하고, Paddle 결제 솔루션을 연동하여 정기 구독 라이프사이클 관리',
        ],
        productLink: 'https://studio.camerafi.com',
        detailLink: '/projects/camerafi-studio',
        skills: ['Next.js', 'TypeScript', 'Mui', 'PWA', 'Webpack', 'Firebase', 'Paddle'],
      },
      {
        title: 'Internal Admin Dashboard',
        dateFrom: '2022-03',
        dateTo: '2023-06',
        description: '사내 서비스 관리 및 통계 대시보드입니다.',
        detail: [
          '**[대용량 리스트 최적화]** 유튜브 UI를 벤치마킹하여 수십만 건의 영상 목록을 끊김 없이 탐색할 수 있도록 Intersection Observer 기반의 무한 스크롤(Infinite Scroll) 구현',
          '**[생산성 향상]** 데이터 조회·수정·삭제(CRUD) 로직과 Chart.js 시각화 모듈을 재사용 가능한 컴포넌트로 추상화하여 반복되는 어드민 페이지 개발 속도 단축',
          '**[인프라]** Firebase Hosting을 활용한 SPA 배포 파이프라인 구축 및 관리',
        ],
        skills: ['React', 'TypeScript', 'Mui', 'Chart.js', 'React Query', 'Firebase Hosting'],
      },
    ],
    role: 'Frontend Developer',
  },
  {
    companyName: '대한민국 국방부',
    dateFrom: '2019-05',
    dateTo: '2020-12',
    project: [
      {
        title: '웹 기반 문서 뷰어',
        dateFrom: '2020-08',
        dateTo: '2020-10',
        description:
          '외부 라이브러리 사용이 제한된 폐쇄망 환경에서의 문서 뷰어 개발 프로젝트입니다.',
        detail: [
          '**[대용량 데이터 렌더링]** 수천 행의 엑셀 데이터를 처리할 때 발생하는 렌더링 지연을 막기 위해, **React Table** 및 **Virtualization(가상화)** 기법을 도입하여 끊김 없는 스크롤 경험 구현',
          '**[아키텍처 설계]** 비동기 데이터 처리를 위해 Redux-Saga 도입, 유지보수 효율성을 위해 Atomic Design Pattern을 적용하여 컴포넌트 시스템 구축',
        ],
        skills: ['React', 'TypeScript', 'React Table', 'Redux-Saga', 'Atomic Design'],
      },
      {
        title: '국방부 대시보드 페이지',
        dateFrom: '2019-06',
        dateTo: '2019-09',
        description: '국방부 망 내 대시보드 웹페이지 유지보수 및 고도화 프로젝트입니다.',
        detail: [
          '**[유지보수]** Ant Design 라이브러리를 커스터마이징하여 UI 컴포넌트 개발 및 레거시 코드 리팩토링을 통한 시스템 안정성 확보',
        ],
        skills: ['React', 'JavaScript', 'Ant Design', 'styled-components', 'Redux'],
      },
    ],
    role: 'Software Developer (SW개발병)',
  },
];

export const otherExperiences: OtherExperienceProps[] = [
  {
    project: [
      {
        title: '서울 캠퍼스 타운 입주 기업 선정 (오르카에이아이)',
        dateFrom: '2024',
        description:
          '사업성과 기술력을 인정받아 서울시 및 대학교로부터 사무 공간 및 사업화 자금 지원 대상에 선정되었습니다.',
        detail: [],
      },
    ],
  },
  {
    project: [
      {
        title: '2021 우리은행 해커톤 본선 진출',
        dateFrom: '2021-04',
        description:
          '5일간 React Native를 빠른 러닝 커브로 습득하여 송금 및 생체 인증 기능이 있는 핀테크 앱을 기획부터 개발까지 전담하여 본선에 진출했습니다.',
        detail: [
          '**[대화형 인터페이스]** 텍스트 파싱을 통한 자연어 송금 처리 로직 구현',
          '**[보안 및 API]** 생체 인증(Biometrics) 및 우리은행 오픈 API 연동을 통한 실제 금융 트랜잭션 처리',
        ],
        detailLink: '/projects/oneline-bank',
        githubLink: `${GITHUB_PROFILE}/OnelineBank`,
        skills: ['React Native', 'JavaScript', 'Firebase', 'Expo'],
      },
    ],
  },
  {
    project: [
      {
        title: 'SvelteKit 포트폴리오 웹사이트',
        dateFrom: '2021-02',
        description:
          'Cloudflare Pages와 Svelte 5를 활용하여 성능과 사용자 경험을 극대화한 엣지 기반(Edge-enhanced) 웹사이트입니다.',
        detail: [
          '**[서버 사이드 로직 도입]** GitHub Pages에서 Cloudflare Pages로 이관하여 `Accept-Language` 헤더 파싱을 통한 깜빡임 없는(Zero-flash) 언어 감지 구현',
          '**[성능 최적화]** Svelte 5 Runes 및 Pure CSS 설계를 통해 Lighthouse 성능/접근성 100점 달성 (SEO는 개인정보 보호를 위해 의도적 차단)',
          '**[반응형 디자인]** 모바일과 PC 환경 각각에 최적화된 UI/UX를 CSS Variables로 직접 설계',
        ],
        detailLink: '/projects/sveltekit-portfolio',
        githubLink: `${GITHUB_PROFILE}/junuuon.github.io`,
        skills: ['Svelte', 'SvelteKit', 'TypeScript', 'Mdsvex', 'Cloudflare Pages'],
      },
    ],
  },
];

export const certificates: CertificateProps[] = [
  {
    label: 'AWS training and certification',
    link: '/certificates/aws-training.pdf',
  },
  {
    label: 'TOPCIT',
    link: '/certificates/topcit.pdf',
  },
  {
    label: '리눅스 마스터 2급',
    link: '/certificates/linux-master-2.pdf',
  },
];

export const education: EducationProps[] = [
  {
    school: '한양대학교 ',
    dateFrom: '2017-03',
    dateTo: '2024-02',
    major: '컴퓨터소프트웨어학부 학사',
  },
  {
    school: '세종과학고등학교',
    dateFrom: '2014-03',
    dateTo: '2017-02',
  },
];

export const skills: SkillProps[] = [
  {
    title: 'Languages',
    list: ['TypeScript', 'JavaScript (ES6+)'],
  },
  {
    title: 'Frontend',
    list: ['React', 'React Native', 'Expo (Router, EAS)', 'Next.js', 'Svelte / SvelteKit'],
  },
  {
    title: 'Engineering',
    list: [
      'Reanimated (v4)',
      'Flashlist',
      'React Compiler',
      'MMKV',
      'PWA',
      'React Query',
      'Zod',
      'React Hook Form',
    ],
  },
  {
    title: 'DevOps & Tools',
    list: [
      'GitHub Actions',
      'Firebase',
      'Sentry',
      'Cloudflare Pages',
      'Git / GitHub',
      'Figma',
      'Vim',
    ],
  },
];

export const archives: ArchiveProps[] = [
  {
    project: [
      {
        title: '대선 뉴스 모아보기 페이지',
        dateFrom: '2021-11',
        dateTo: '2021-12',
        description:
          '한양대학교 소프트웨어스튜디오2 수업 프로젝트입니다. 팀장으로서 기획, 디자인, 개발 전 과정을 주도하며 Serverless 아키텍처를 경험했습니다.',
        detail: [
          '**[Serverless 도입]** AWS Amplify를 활용하여 별도의 백엔드 구축 없이 인증(로그인/회원가입) 및 데이터 관리 환경 구축',
          '**[데이터 시각화]** Naver News API 데이터의 메타데이터(OG Tag)를 파싱하여 카드 뉴스로 렌더링하고, **Recharts**로 여론조사 데이터 시각화',
          '**[컴포넌트 설계]** React 및 styled-components를 활용하여 재사용 가능한 컴포넌트 계층 구조 디자인',
        ],
        detailLink: '/projects/election-aggregator',
        githubLink: `${GITHUB_PROFILE}/ITE3068_team8`,
        skills: ['React', 'JavaScript', 'AWS Amplify', 'GraphQL', 'styled-components'],
      },
    ],
  },
];
