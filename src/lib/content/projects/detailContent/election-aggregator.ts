import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const electionAggregatorDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'election-aggregator-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\n**"What if scattered election information was gathered in one place?"**\n\nDuring the election period, news, polls, and candidate pledges were scattered across platforms — making it hard for voters to stay informed. I led the team as **Tech Lead and Full Stack developer**, establishing ESLint/Prettier conventions, introducing Git Flow strategy, and building the core AWS Amplify serverless infrastructure (Cognito auth, AppSync API). The result is an aggregator that collects and visualizes all election-related data in a single dashboard.',
    },
    {
      id: 'election-aggregator-en-02',
      type: 'techStack',
    },
    {
      id: 'election-aggregator-en-03',
      type: 'markdown',
      markdown: '## Key work',
    },
    {
      id: 'election-aggregator-en-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'UI',
          accent: true,
          title: 'Responsive dashboard with MUI Grid',
          detail:
            "The main dashboard is the first thing users see. Used **MUI's Grid System** to lay out the D-Day counter, daily headlines, and election timeline in a responsive grid that adapts from mobile to desktop without custom media queries.",
        },
        {
          tag: 'Auth',
          accent: true,
          title: 'Serverless authentication with AWS Amplify',
          detail:
            'Integrated **AWS Amplify Auth (Cognito)** to handle sign-up, login, and session management without a dedicated backend server. Built custom login and sign-up modals on top of the Amplify SDK to keep the UX seamless within the SPA.',
        },
        {
          tag: 'Feature',
          title: 'Personalized reading list (bookmarks)',
          detail:
            "Users can bookmark articles of interest. Saved articles are synced to each user's personal storage via **Amplify API (AppSync/GraphQL)** — persisting across sessions and devices without any custom backend code.",
        },
        {
          tag: 'Data',
          title: 'News curation & metadata enrichment',
          detail:
            'Collected election news via the **Naver News API** and displayed results as article cards. Used **Microlink** to enrich each card with OG metadata (thumbnail, summary), and resolved CORS issues through Axios + Proxy configuration.',
        },
        {
          tag: 'Visualization',
          title: 'Poll approval-rating charts',
          detail:
            'Visualized complex candidate approval-rating trends as interactive line and bar charts using the **Recharts** library. Designed the chart components to accept generic data shapes, keeping them reusable across different poll datasets.',
        },
      ],
    },
    {
      id: 'election-aggregator-en-05',
      type: 'markdown',
      markdown: '## Screenshots',
    },
    {
      id: 'election-aggregator-en-06',
      type: 'lightbox',
      images: [
        {
          src: '/images/election-aggregator/1.webp',
          mobileSrc: '/images/election-aggregator/1_mobile.jpg',
          alt: 'Main dashboard',
          caption: 'Main dashboard — D-Day counter, headlines, and election timeline',
        },
        {
          src: '/images/election-aggregator/2.webp',
          mobileSrc: '/images/election-aggregator/2_mobile.jpg',
          alt: 'Login page',
          caption: 'Custom login modal on top of AWS Amplify Auth',
        },
        {
          src: '/images/election-aggregator/3.webp',
          mobileSrc: '/images/election-aggregator/3_mobile.jpg',
          alt: 'Sign-up page',
          caption: 'Custom sign-up modal',
        },
        {
          src: '/images/election-aggregator/5.webp',
          mobileSrc: '/images/election-aggregator/5_mobile.jpg',
          alt: 'Reading list',
          caption: 'Personal reading list synced via AppSync/GraphQL',
        },
        {
          src: '/images/election-aggregator/11.webp',
          mobileSrc: '/images/election-aggregator/11_mobile.jpg',
          alt: 'Election news',
          caption: 'News cards enriched with Microlink metadata',
        },
        {
          src: '/images/election-aggregator/13.webp',
          mobileSrc: '/images/election-aggregator/13_mobile.jpg',
          alt: 'Poll charts',
          caption: 'Approval-rating trends visualized with Recharts',
        },
      ],
    },
    {
      id: 'election-aggregator-en-07',
      type: 'markdown',
      markdown:
        '## Retrospective\n\nAdopting **AWS Amplify** instead of hand-rolling a backend let the team focus on business logic and data visualization. We shipped Auth, DB, and API within the project deadline — something that would have taken far longer with a custom server setup. The experience showed me how much leverage the right infrastructure choice can give a small team.',
    },
  ],
  ko: [
    {
      id: 'election-aggregator-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**"파편화된 선거 정보를 한 곳에서 볼 수 있다면?"**\n\n대선 기간 동안 뉴스, 여론조사, 후보자 공약 등의 정보가 여러 플랫폼에 흩어져 있어 유권자가 정보를 접하기 어려운 문제가 있었습니다. **Tech Lead 겸 Full Stack 개발자**로서 ESLint/Prettier 컨벤션 수립, Git Flow 전략 도입, AWS Amplify 서버리스 인프라(Cognito 인증, AppSync API) 구축을 주도했습니다. 그 결과물이 모든 선거 관련 데이터를 한 대시보드에서 수집·시각화하는 애그리게이터 서비스입니다.',
    },
    {
      id: 'election-aggregator-ko-02',
      type: 'techStack',
    },
    {
      id: 'election-aggregator-ko-03',
      type: 'markdown',
      markdown: '## 주요 작업',
    },
    {
      id: 'election-aggregator-ko-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'UI',
          accent: true,
          title: 'MUI Grid를 활용한 반응형 대시보드',
          detail:
            '사용자가 가장 먼저 접하는 메인 대시보드입니다. **MUI의 그리드 시스템**을 활용하여 D-Day 카운터, 오늘의 주요 뉴스, 선거 일정을 별도의 미디어 쿼리 없이 모바일부터 데스크탑까지 대응하는 반응형 레이아웃으로 구성했습니다.',
        },
        {
          tag: 'Auth',
          accent: true,
          title: 'AWS Amplify 기반 서버리스 인증',
          detail:
            '**AWS Amplify Auth(Cognito)**를 연동하여 별도의 백엔드 서버 없이 회원가입, 로그인, 세션 관리를 구현했습니다. Amplify SDK 위에 커스텀 로그인·회원가입 모달을 직접 제작해 SPA 내에서 자연스러운 사용자 경험을 제공했습니다.',
        },
        {
          tag: 'Feature',
          title: '개인화 기능 (북마크)',
          detail:
            '관심 기사를 스크랩하면 **Amplify API(AppSync/GraphQL)**를 통해 사용자 개인 저장소에 동기화됩니다. 커스텀 백엔드 없이 세션과 기기에 걸쳐 데이터를 유지할 수 있습니다.',
        },
        {
          tag: 'Data',
          title: '뉴스 큐레이션 및 메타데이터 강화',
          detail:
            '**Naver News API**로 대선 뉴스를 수집하고 카드 형태로 표시했습니다. **Microlink**를 활용해 각 카드에 OG 메타데이터(썸네일, 요약)를 보강했으며, Axios와 Proxy 설정으로 CORS 이슈를 해결하여 API를 연동했습니다.',
        },
        {
          tag: 'Visualization',
          title: '여론조사 지지율 차트',
          detail:
            '복잡한 후보별 지지율 추이를 **Recharts** 라이브러리로 인터랙티브한 라인/바 차트로 시각화했습니다. 차트 컴포넌트를 범용 데이터 구조를 받도록 설계하여 다양한 여론조사 데이터셋에 재사용 가능하게 구현했습니다.',
        },
      ],
    },
    {
      id: 'election-aggregator-ko-05',
      type: 'markdown',
      markdown: '## 스크린샷',
    },
    {
      id: 'election-aggregator-ko-06',
      type: 'lightbox',
      images: [
        {
          src: '/images/election-aggregator/1.webp',
          mobileSrc: '/images/election-aggregator/1_mobile.jpg',
          alt: '메인 대시보드',
          caption: '메인 대시보드 — D-Day 카운터, 주요 뉴스, 선거 일정',
        },
        {
          src: '/images/election-aggregator/2.webp',
          mobileSrc: '/images/election-aggregator/2_mobile.jpg',
          alt: '로그인 페이지',
          caption: 'AWS Amplify Auth 기반 커스텀 로그인 모달',
        },
        {
          src: '/images/election-aggregator/3.webp',
          mobileSrc: '/images/election-aggregator/3_mobile.jpg',
          alt: '회원가입 페이지',
          caption: '커스텀 회원가입 모달',
        },
        {
          src: '/images/election-aggregator/5.webp',
          mobileSrc: '/images/election-aggregator/5_mobile.jpg',
          alt: '읽기 목록',
          caption: 'AppSync/GraphQL로 동기화되는 개인 읽기 목록',
        },
        {
          src: '/images/election-aggregator/11.webp',
          mobileSrc: '/images/election-aggregator/11_mobile.jpg',
          alt: '대선 뉴스',
          caption: 'Microlink 메타데이터가 보강된 뉴스 카드',
        },
        {
          src: '/images/election-aggregator/13.webp',
          mobileSrc: '/images/election-aggregator/13_mobile.jpg',
          alt: '여론조사 차트',
          caption: 'Recharts로 시각화한 지지율 추이',
        },
      ],
    },
    {
      id: 'election-aggregator-ko-07',
      type: 'markdown',
      markdown:
        '## 회고\n\n직접 백엔드를 구축하는 대신 **AWS Amplify**를 도입하자 팀이 비즈니스 로직과 데이터 시각화에 집중할 수 있었습니다. 제한된 프로젝트 기간 안에 인증, DB, API를 모두 갖춘 서비스를 배포할 수 있었고, 올바른 인프라 선택이 소규모 팀에 얼마나 큰 레버리지를 주는지 직접 경험할 수 있었습니다.',
    },
  ],
};
