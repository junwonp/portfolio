import { i18nData } from '$lib/data/resume.i18n';
import type { SharedProject } from '$lib/data/resume.shared';
import {
  archivesShared,
  certificateOrder,
  certificatesShared,
  educationOrder,
  educationShared,
  otherExperiencesShared,
  sharedIntroduction,
  skillsShared,
  workExperiencesShared,
} from '$lib/data/resume.shared';
import type {
  ArchiveProps,
  CertificateProps,
  EducationProps,
  IntroductionProps,
  OtherExperienceProps,
  SkillProps,
  WorkExperienceProps,
} from '$lib/types/about';
import type { Language } from '$lib/utils/language';

export const summaryPresetIds = ['default', 'ops-data', 'web', 'rn', 'web-rn'] as const;

export type SummaryPresetId = (typeof summaryPresetIds)[number];

type SummaryPresetContent = Pick<IntroductionProps, 'metrics' | 'pillars' | 'tagline'>;

const summaryPresetAliases: Partial<Record<string, SummaryPresetId>> = {
  opsData: 'ops-data',
  webRn: 'web-rn',
};

const summaryPresets: Record<Language, Record<SummaryPresetId, Partial<SummaryPresetContent>>> = {
  en: {
    default: {},
    'ops-data': {
      tagline:
        'Frontend Engineer focused on data-heavy web systems, operational UX, and product reliability',
      metrics: [
        { value: '100k+', label: 'Rows & Logs' },
        { value: '15%', label: 'Bundle Saved' },
        { value: '80%+', label: 'API Load Cut' },
      ],
      pillars: [
        {
          index: '01',
          title: 'Operational Web Systems',
          description:
            'Building data lookup, table, dashboard, and workflow interfaces for internal users who need speed and accuracy.',
        },
        {
          index: '02',
          title: 'Performance & Reliability',
          description:
            'Improving large-data rendering, loading paths, caching, and bundle size so web products stay responsive in real use.',
        },
        {
          index: '03',
          title: 'Platform Delivery Ownership',
          description:
            'Owning frontend architecture, release pipelines, monitoring, and cross-platform delivery from zero to operation.',
        },
      ],
    },
    rn: {
      tagline:
        'Frontend Engineer focused on React Native products, native integration, and mobile performance',
      pillars: [
        {
          index: '01',
          title: 'Cross-Platform Mobile',
          description:
            'Shipping shared mobile experiences across iOS and Android with a single React Native codebase.',
        },
        {
          index: '02',
          title: 'Native Integration & Performance',
          description:
            'Connecting native modules, animation, and list rendering so mobile screens stay smooth under real use.',
        },
        {
          index: '03',
          title: 'Stable Release Operations',
          description:
            'Operating EAS, GitHub Actions, and crash reporting to keep mobile releases predictable and recoverable.',
        },
      ],
    },
    web: {
      tagline:
        'Frontend Engineer focused on scalable web products, reusable UI systems, and fast iteration',
      pillars: [
        {
          index: '01',
          title: 'Product UI Systems',
          description:
            'Designing reusable interfaces and predictable interactions for customer-facing web products.',
        },
        {
          index: '02',
          title: 'Data-Driven Delivery',
          description:
            'Turning complex tables, filters, and dashboards into clear operational workflows.',
        },
        {
          index: '03',
          title: 'Performance Ownership',
          description: 'Keeping bundles, rendering, and interactions responsive as features grow.',
        },
      ],
    },
    'web-rn': {
      tagline:
        'Frontend Engineer focused on shared web/mobile product systems and cross-platform delivery',
      pillars: [
        {
          index: '01',
          title: 'Shared Code Architecture',
          description:
            'Keeping product logic, data flow, and UI decisions reusable across web and mobile surfaces.',
        },
        {
          index: '02',
          title: 'Consistent Product Experience',
          description:
            'Aligning web and mobile behavior so users see one product, not two separate implementations.',
        },
        {
          index: '03',
          title: 'Operational Delivery',
          description:
            'Managing release paths, monitoring, and maintenance so cross-platform systems remain dependable.',
        },
      ],
    },
  },
  ko: {
    default: {},
    'ops-data': {
      tagline: '데이터 중심 웹 시스템, 운영 UX, 제품 안정성을 설계하는 프론트엔드 엔지니어',
      metrics: [
        { value: '수십만+', label: '행/로그 처리' },
        { value: '15%', label: '번들 절감' },
        { value: '80%+', label: 'API 부하 절감' },
      ],
      pillars: [
        {
          index: '01',
          title: '운영 웹 시스템',
          description:
            '내부 사용자가 빠르고 정확하게 일해야 하는 데이터 조회, 테이블, 대시보드, 워크플로우 UI를 설계합니다.',
        },
        {
          index: '02',
          title: '성능과 안정성',
          description:
            '대량 데이터 렌더링, 로딩 경로, 캐싱, 번들 사이즈를 개선해 실제 사용 환경에서도 반응성을 유지합니다.',
        },
        {
          index: '03',
          title: '플랫폼 출시 오너십',
          description:
            '프론트엔드 아키텍처부터 배포 파이프라인, 모니터링, 크로스플랫폼 운영까지 출시 이후를 고려해 책임집니다.',
        },
      ],
    },
    rn: {
      tagline: 'React Native 제품, 네이티브 연동, 모바일 성능에 집중하는 프론트엔드 엔지니어',
      pillars: [
        {
          index: '01',
          title: '크로스플랫폼 모바일',
          description:
            '하나의 React Native 코드베이스로 iOS와 Android에 공통된 사용자 경험을 제공합니다.',
        },
        {
          index: '02',
          title: '네이티브 연동과 성능',
          description:
            '네이티브 모듈, 애니메이션, 리스트 렌더링을 연결해 실사용에서도 부드러운 화면을 유지합니다.',
        },
        {
          index: '03',
          title: '안정적인 배포 운영',
          description:
            'EAS, GitHub Actions, 크래시 리포팅을 운영해 모바일 릴리즈를 예측 가능하게 관리합니다.',
        },
      ],
    },
    web: {
      tagline: '확장 가능한 웹 제품, 재사용 UI 시스템, 빠른 반복에 집중하는 프론트엔드 엔지니어',
      pillars: [
        {
          index: '01',
          title: '제품형 UI 시스템',
          description:
            '고객용 웹 제품에 맞는 재사용 가능한 인터페이스와 예측 가능한 상호작용을 설계합니다.',
        },
        {
          index: '02',
          title: '데이터 기반 화면 설계',
          description: '복잡한 테이블, 필터, 대시보드를 운영 흐름으로 읽기 쉬운 구조로 바꿉니다.',
        },
        {
          index: '03',
          title: '성능 오너십',
          description: '기능이 늘어나도 번들, 렌더링, 인터랙션이 느려지지 않도록 관리합니다.',
        },
      ],
    },
    'web-rn': {
      tagline: '웹과 모바일을 함께 설계하고 크로스플랫폼 배송을 책임지는 프론트엔드 엔지니어',
      pillars: [
        {
          index: '01',
          title: '공유 코드 구조',
          description:
            '제품 로직, 데이터 흐름, UI 결정을 웹과 모바일에서 재사용 가능한 형태로 정리합니다.',
        },
        {
          index: '02',
          title: '일관된 제품 경험',
          description: '웹과 모바일의 동작을 맞춰 사용자가 하나의 제품으로 느끼도록 만듭니다.',
        },
        {
          index: '03',
          title: '운영형 배포',
          description:
            '배포 경로, 모니터링, 유지보수를 관리해 크로스플랫폼 시스템을 안정적으로 운영합니다.',
        },
      ],
    },
  },
};

export const resolveSummaryPreset = (value: string | null): SummaryPresetId => {
  if (!value) return 'default';
  const normalized = summaryPresetAliases[value] ?? value;

  return summaryPresetIds.includes(normalized as SummaryPresetId)
    ? (normalized as SummaryPresetId)
    : 'default';
};

export interface ResumeData {
  archives: ArchiveProps[];
  certificates: CertificateProps[];
  education: EducationProps[];
  introduction: IntroductionProps;
  otherExperiences: OtherExperienceProps[];
  skills: SkillProps[];
  workExperiences: WorkExperienceProps[];
}

export const getResumeData = (lang: Language): ResumeData => {
  const i18n = i18nData[lang];

  const introduction: IntroductionProps = {
    ...sharedIntroduction,
    ...i18n.introduction,
  };

  const workExperiences: WorkExperienceProps[] = workExperiencesShared.map((exp) => {
    const i18nExp = i18n.workExperiences[exp.id];
    return {
      companyName: i18nExp.companyName,
      titleBadge: i18nExp.titleBadge,
      dateFrom: exp.dateFrom,
      dateTo: exp.dateTo,
      highlights: i18nExp.highlights,
      role: i18nExp.role,
      additional: i18nExp.additional,
      project: (exp.projects as SharedProject[]).map((proj) => {
        const i18nProj = i18nExp.projects[proj.id];
        return {
          dateFrom: proj.dateFrom,
          dateTo: proj.dateTo,
          detailLink: proj.detailLink,
          featuredSkills: proj.featuredSkills,
          id: proj.id,
          skills: proj.skills,
          description: i18nProj.description,
          detail: i18nProj.detail,
          title: i18nProj.title,
          metrics: i18nProj.metrics,
        };
      }),
    };
  });

  const otherExperiences: OtherExperienceProps[] = otherExperiencesShared.map((exp) => {
    const i18nExp = i18n.otherExperiences[exp.id];
    return {
      titleBadge: i18nExp.titleBadge,
      project: [
        {
          dateFrom: exp.dateFrom,
          dateTo: exp.dateTo,
          detailLink: exp.detailLink,
          featuredSkills: exp.featuredSkills,
          id: exp.id,
          skills: exp.skills,
          description: i18nExp.description,
          detail: i18nExp.detail,
          title: i18nExp.title,
        },
      ],
    };
  });

  const archives: ArchiveProps[] = archivesShared.map((arch) => {
    const i18nArch = i18n.archives[arch.id];
    return {
      project: [
        {
          dateFrom: arch.dateFrom,
          dateTo: arch.dateTo,
          detailLink: arch.detailLink,
          featuredSkills: arch.featuredSkills,
          id: arch.id,
          skills: arch.skills,
          description: i18nArch.description,
          detail: i18nArch.detail,
          title: i18nArch.title,
        },
      ],
    };
  });

  const certificates: CertificateProps[] = certificateOrder.map((id) => ({
    link: certificatesShared[id].link,
    label: i18n.certificates[id].label,
  }));

  const education: EducationProps[] = educationOrder.map((id) => ({
    ...educationShared[id],
    ...i18n.education[id],
  }));

  const skills: SkillProps[] = skillsShared.map((skill) => ({
    id: skill.id,
    title: i18n.skills[skill.id],
    description: i18n.skillDescriptions?.[skill.id],
    detailLink: skill.detailLink,
    detailLabel: i18n.skillDetailsLabel?.[skill.id],
    list: skill.list,
  }));

  return {
    introduction,
    workExperiences,
    otherExperiences,
    archives,
    certificates,
    education,
    skills,
  };
};

export const getSummaryIntroduction = (
  lang: Language,
  preset: SummaryPresetId = 'default',
): IntroductionProps => {
  const i18n = i18nData[lang];

  return {
    ...sharedIntroduction,
    ...i18n.introduction,
    ...summaryPresets[lang][preset],
  };
};

export const resolveFeaturedProjectIds = (searchParams: URLSearchParams): string[] => {
  const values = [
    ...searchParams.getAll('projects'),
    ...searchParams.getAll('projectIds'),
    ...searchParams.getAll('projectId'),
  ];

  const ids = values.flatMap((value) =>
    value
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  );

  return Array.from(new Set(ids));
};

export const getFeaturedWebProjects = (
  lang: Language,
  projectIds: string[] = [],
): OtherExperienceProps[] => {
  if (projectIds.length === 0) return [];

  const resumeData = getResumeData(lang);
  const projects = [
    ...resumeData.workExperiences.flatMap((exp) => exp.project),
    ...resumeData.otherExperiences.flatMap((exp) => exp.project),
    ...resumeData.archives.flatMap((exp) => exp.project),
  ];

  return projectIds.flatMap((id) => {
    const project = projects.find((item) => item.id === id);
    if (!project) return [];

    return [{ project: [project] }];
  });
};
