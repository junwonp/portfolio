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
  name: 'Junwon Park',
  role: 'Frontend Engineer',
  tagline: 'Frontend Engineer experienced in the entire product lifecycle from inception to growth',
  githubLink: GITHUB_PROFILE,
  linkedinLink: LINKEDIN_PROFILE,
  briefing: [
    'Experienced in growing a service from the idea stage to 23k MAU. I have learned how to build stable services by directly experiencing the entire process of planning, development, deployment, and operation.',
    'I prefer deep technical exploration—implementing necessary features directly rather than relying solely on libraries—and understanding principles by diving deep into official documentation. I have experience designing proprietary UI systems and optimizing rendering performance to the limit.',
    'I aim for rational engineering, selecting and applying technologies based on the current business context and "what users truly need," rather than blindly chasing the latest or flashy technologies.',
  ],
};

export const workExperiences: WorkExperienceProps[] = [
  {
    companyName: 'Orca AI Inc.',
    dateFrom: '2024-01',
    project: [
      {
        title: 'aira',
        dateFrom: '2024-01',
        description:
          'A global AI character chat platform. As a Co-Founder and Frontend Lead, I led the entire process of planning, development, and operation.',
        detail: [
          "**[Key Achievements]** Achieved 23k MAU and $3,000 monthly revenue, building a highly immersive service with an average session time of 46 minutes (Ranked 57th in Google Play Entertainment / as of Feb '25)",
          '**[Architecture Enhancement]** Transitioned to a server-based multi-model to overcome local model limitations and implemented logic to migrate existing Realm data to Firestore without loss. Introduced **React Query Persister** to improve initial loading speed and establish a server data caching strategy.',
          '**[Cross-Platform Design]** Supported Android, iOS, and Web simultaneously with a single codebase based on **Expo Router**, and integrated **Universal Link** to provide a seamless user experience across platforms.',
          '**[Rendering Optimization]** Prevented frame drops on low-end devices by introducing **Flashlist** for high view reusability, and proactively adopted **React Compiler** to reduce code complexity and optimize rendering efficiency.',
          '**[High-Performance Interaction & R&D]** Experimented with next-gen interfaces (V2) by implementing **iOS 26 Liquid Glass** and **Shorts-style Swipe UI**, and achieved native-level 60fps gesture animations using **Reanimated (v4)**.',
          '**[UX-Centric Monetization]** Directly designed **Native Ads** UI that does not disrupt the chat experience, ensuring seamless ad exposure and layout stability (preventing CLS).',
          '**[Service Stability]** Built a precise error tracking environment by integrating Sentry and dSYM, and prevented user churn with a **rapid rollback policy** when specific Android device issues occurred. Ensured runtime data type safety by introducing **Zod**.',
          '**[Operational Efficiency]** Built CI/CD pipelines based on **EAS** and **GitHub Actions** (Android closed track auto-deployment, iOS TestFlight) and established a device compatibility testing process using **Samsung Test Lab**.',
          '**[Global Expansion]** Supported 3 languages (KR/EN/JP) via **i18n**, driving global user influx, and verified edge computing feasibility by conducting an **On-device sLLM PoC** using `llama.rn`.',
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
    companyName: 'Vault Micro',
    dateFrom: '2022-01',
    dateTo: '2023-06',
    project: [
      {
        title: 'CameraFi Studio',
        dateFrom: '2022-02',
        dateTo: '2023-06',
        description:
          'A web overlay scoreboard service. Started as a solo developer, I built the frontend architecture and grew it into a core company project.',
        detail: [
          '**[Bundle Size Optimization]** Reduced main bundle size by 15% (324KB → 277KB) and improved TTI by establishing Webpack Tree Shaking & Code Splitting strategies and applying Dynamic Import.',
          '**[Security & Auth]** Removed external dependencies and enhanced security by directly implementing Cookie Consent and token-based authentication logic instead of relying on libraries.',
          '**[Global Architecture]** Designed a flexible structure for design changes by building an i18n system and a **Global Theme System** combining MUI and Styled-components.',
          '**[Service Enhancement]** Implemented app-like installation (A2HS) by introducing Next-PWA and established a subscription lifecycle management process by integrating Paddle payment solution.',
        ],
        productLink: 'https://studio.camerafi.com',
        detailLink: '/projects/camerafi-studio',
        skills: ['Next.js', 'TypeScript', 'Mui', 'PWA', 'Webpack', 'Firebase', 'Paddle'],
      },
      {
        title: 'Internal Admin Dashboard',
        dateFrom: '2022-03',
        dateTo: '2023-06',
        description: 'An internal service management and statistics dashboard.',
        detail: [
          '**[Large List Optimization]** Implemented Intersection Observer-based Infinite Scroll to enable seamless navigation of hundreds of thousands of video lists, benchmarking YouTube UI.',
          '**[Productivity Improvement]** Abstracted CRUD logic and Chart.js visualization modules into reusable components, accelerating the development speed of repetitive admin pages.',
          '**[Infrastructure]** Built and managed SPA deployment pipelines using Firebase Hosting.',
        ],
        skills: ['React', 'TypeScript', 'Mui', 'Chart.js', 'React Query', 'Firebase Hosting'],
      },
    ],
    role: 'Frontend Developer',
  },
  {
    companyName: 'Ministry of National Defense',
    dateFrom: '2019-05',
    dateTo: '2020-12',
    project: [
      {
        title: 'Web-based Document Viewer',
        dateFrom: '2020-08',
        dateTo: '2020-10',
        description:
          'A document viewer development project in a closed network environment with restricted external library access.',
        detail: [
          '**[Large Data Rendering]** Implemented seamless scrolling by introducing **React Table** and **Virtualization** techniques to prevent rendering delays when processing thousands of rows of Excel data.',
          '**[Architecture Design]** Introduced Redux-Saga for asynchronous data processing and applied Atomic Design Pattern to build a component system for maintenance efficiency.',
        ],
        skills: ['React', 'TypeScript', 'React Table', 'Redux-Saga', 'Atomic Design'],
      },
      {
        title: 'MND Dashboard Page',
        dateFrom: '2019-06',
        dateTo: '2019-09',
        description:
          'Maintenance and enhancement project for the dashboard webpage within the Ministry of National Defense intranet.',
        detail: [
          '**[Maintenance]** Developed UI components by customizing the Ant Design library and secured system stability through legacy code refactoring.',
        ],
        skills: ['React', 'JavaScript', 'Ant Design', 'styled-components', 'Redux'],
      },
    ],
    role: 'Software Developer',
  },
];

export const otherExperiences: OtherExperienceProps[] = [
  {
    project: [
      {
        title: 'Seoul Campus Town Selection (Orca AI)',
        dateFrom: '2024',
        description:
          'Selected for office space and commercialization funding support from the Seoul Metropolitan Government and universities in recognition of business potential and technical capability.',
        detail: [],
      },
    ],
  },
  {
    project: [
      {
        title: 'OnelineBank — 2021 Woori Bank Hackathon Rebuild',
        dateFrom: '2026-02',
        dateTo: '2026-03',
        description:
          'A personal project fully rewriting the 2021 Woori Bank Hackathon submission with a modern tech stack. The original JavaScript codebase, written rapidly under time pressure, was rebuilt from scratch in TypeScript with current libraries.',
        detail: [
          '**[Tech Modernization]** Full JavaScript → TypeScript migration and architecture redesign with **Expo Router** file-based routing',
          '**[Core Feature]** Implemented natural language remittance processing logic that auto-parses bank name, account number, and amount from chat text',
          '**[Server State]** Adopted **TanStack Query v5** + **Async Storage Persister** for query caching and offline support',
          '**[Form & Validation]** Type-safe input handling via **TanStack Form v1** + **Zod v4** combination',
          '**[Mock API]** Built a mock server using **Expo API Routes** to replicate the full financial transaction flow, replacing the now-blocked Woori Bank Open API',
          '**[Styling]** Applied a consistent utility-first design system using **NativeWind v5** (Tailwind CSS-based)',
        ],
        githubLink: `${GITHUB_PROFILE}/OnelineBank`,
        skills: [
          'React Native',
          'TypeScript',
          'Expo Router',
          'TanStack Query',
          'TanStack Form',
          'Zustand',
          'NativeWind(Tailwind CSS)',
          'Zod',
          'MMKV',
          'Firebase',
          'Reanimated',
        ],
      },
    ],
  },
  {
    project: [
      {
        title: 'OnelineBank (2021 Woori Bank Hackathon Finalist)',
        dateFrom: '2021-04',
        dateTo: '2021-05',
        description:
          'Advanced to the finals by independently planning and developing a fintech app with remittance and biometric authentication features, learning React Native with a rapid learning curve in 5 days.',
        detail: [
          '**[Conversational Interface]** Implemented natural language remittance processing logic via text parsing.',
          '**[Security & API]** Processed actual financial transactions through Biometrics and Woori Bank Open API integration.',
        ],
        detailLink: '/projects/oneline-bank-legacy',
        githubLink: `${GITHUB_PROFILE}/OnelineBank-legacy`,
        skills: ['React Native', 'JavaScript', 'Firebase', 'Expo'],
      },
    ],
  },
  {
    project: [
      {
        title: 'SvelteKit Portfolio Website',
        dateFrom: '2021-02',
        description:
          'An edge-enhanced website maximizing performance and user experience using Cloudflare Pages and Svelte 5.',
        detail: [
          '**[Server-side Logic]** Migrated from GitHub Pages to Cloudflare Pages to implement Zero-flash language detection via `Accept-Language` header parsing.',
          '**[Performance Optimization]** Achieved 100 points in Lighthouse Performance/Accessibility through Svelte 5 Runes and Pure CSS design (SEO intentionally blocked for privacy).',
          '**[Responsive Design]** Directly designed UI/UX optimized for both Mobile and PC environments using CSS Variables.',
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
    label: 'Linux Master Level 2',
    link: '/certificates/linux-master-2.pdf',
  },
];

export const education: EducationProps[] = [
  {
    school: 'Hanyang University',
    dateFrom: '2017-03',
    dateTo: '2024-02',
    major: 'B.S. in Computer Software Engineering',
  },
  {
    school: 'Sejong Science High School',
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
        title: 'Election News Aggregator',
        dateFrom: '2021-11',
        dateTo: '2021-12',
        description:
          'A project for Hanyang University Software Studio 2. As a team leader, I led the entire process of planning, design, and development, experiencing Serverless architecture.',
        detail: [
          '**[Serverless Adoption]** Built authentication (Login/Signup) and data management environments using AWS Amplify without a separate backend.',
          '**[Data Visualization]** Rendered card news by parsing metadata (OG Tags) from Naver News API and visualized poll data using **Recharts**.',
          '**[Component Design]** Designed a reusable component hierarchy using React and styled-components.',
        ],
        detailLink: '/projects/election-aggregator',
        githubLink: `${GITHUB_PROFILE}/ITE3068_team8`,
        skills: ['React', 'JavaScript', 'AWS Amplify', 'GraphQL', 'styled-components'],
      },
    ],
  },
];
