import type { Language } from '$lib/utils/language';

export interface Labels {
  authorName: string;
  contentLoadError: string;
  linkCopied: string;
  shareFooter: string;
  sharePage: string;
  description: string;
  errorOccurred: string;
  goBack: string;
  goHome: string;
  hideDetails: string;
  goToGithubPage: string;
  goToGithubProfile: string;
  goToLinkedinPage: string;
  goToProductPage: string;
  languageToggleError: string;
  navAriaLabel: string;
  noProjectsFound: string;
  pageNotFound: string;
  paradigmAgentic: string;
  paradigmAssisted: string;
  present: string;
  project: string;
  resumeTitle: string;
  sectionArchives: string;
  showDetails: string;
  sectionEducation: string;
  sectionIntro: string;
  sectionAwards: string;
  sectionSkills: string;
  sectionWork: string;
  skillBarCollapse: string;
  skillBarCollapseAriaLabel: string;
  skillBarExpand: string;
  skillBarExpandAriaLabel: string;
  skillFilterActive: string;
  skillFilterClear: string;
  skillFilterClearAriaLabel: string;
  skillFilterPlaceholder: string;
  tabEducation: string;
  tabIntro: string;
  tabProjects: string;
  tabSkills: string;
  tabWork: string;
  techStack: string;
  tocProjectDetails: string;
  tocTitle: string;
  toggleLanguage: string;
  viewProjectDetails: string;
  visitSite: string;
  whatDidIDo: string;
}

export const labelsMap: Record<Language, Labels> = {
  ko: {
    authorName: '박준원',
    contentLoadError: '컨텐츠를 불러올 수 없습니다.',
    linkCopied: '링크가 복사되었습니다',
    shareFooter: '이 포트폴리오 공유하기',
    sharePage: '공유',
    description: '설명',
    errorOccurred: '오류가 발생했습니다',
    goBack: '← 뒤로',
    goHome: '홈으로 돌아가기',
    hideDetails: '접기',
    goToGithubPage: 'GitHub 페이지로 이동',
    goToGithubProfile: 'GitHub 프로필로 이동',
    goToLinkedinPage: 'Linkedin 페이지로 이동',
    goToProductPage: '제품 페이지로 이동',
    languageToggleError: '언어 전환에 실패했습니다.',
    navAriaLabel: '섹션 탐색',
    noProjectsFound: '조건에 맞는 프로젝트가 없습니다.',
    pageNotFound: '페이지를 찾을 수 없습니다',
    paradigmAgentic: '에이전틱 주도',
    paradigmAssisted: 'AI 보조',
    present: '현재',
    project: '프로젝트',
    resumeTitle: '포트폴리오',
    sectionArchives: '기타 활동',
    showDetails: '상세보기',
    sectionEducation: '학력',
    sectionIntro: '소개',
    sectionAwards: '수상 및 프로젝트',
    sectionSkills: '기술 스택',
    sectionWork: '경력',
    skillBarCollapse: '↓ 접기',
    skillBarCollapseAriaLabel: '접기',
    skillBarExpand: '↑ 펼치기',
    skillBarExpandAriaLabel: '펼치기',
    skillFilterActive: '현재 {tech} 필터링 중',
    skillFilterClear: '✕ 닫기',
    skillFilterClearAriaLabel: '필터 해제 및 닫기',
    skillFilterPlaceholder: '기술을 선택해서 필터링해보세요',
    tabEducation: '학력',
    tabIntro: '소개',
    tabProjects: '프로젝트',
    tabSkills: '스킬',
    tabWork: '경력',
    techStack: '기술 스택',
    tocProjectDetails: '프로젝트 상세',
    tocTitle: '목차',
    toggleLanguage: 'Switch to English',
    viewProjectDetails: '프로젝트 자세히 보기',
    visitSite: '서비스 바로가기',
    whatDidIDo: '주요 작업',
  },
  en: {
    authorName: 'Junwon',
    contentLoadError: 'Unable to load content.',
    linkCopied: 'Link copied!',
    shareFooter: 'Share this portfolio',
    sharePage: 'Share',
    description: 'Description',
    errorOccurred: 'An error occurred',
    goBack: '← Back',
    goHome: 'Go home',
    hideDetails: 'Collapse',
    goToGithubPage: 'Go to Github page',
    goToGithubProfile: 'Go to Github profile',
    goToLinkedinPage: 'Go to Linkedin page',
    goToProductPage: 'Go to product page',
    languageToggleError: 'Failed to switch language.',
    navAriaLabel: 'Section navigation',
    noProjectsFound: 'No projects match the selected filters.',
    pageNotFound: 'Page not found',
    paradigmAgentic: 'Agentic Driven',
    paradigmAssisted: 'AI Assisted',
    present: 'Present',

    project: 'Project',
    resumeTitle: 'Portfolio',
    sectionArchives: 'Archives',
    showDetails: 'Show details',
    sectionEducation: 'Education',
    sectionIntro: 'Introduction',
    sectionAwards: 'Awards & Projects',
    sectionSkills: 'Skills Set',
    sectionWork: 'Work Experience',
    skillBarCollapse: '↓ Collapse',
    skillBarCollapseAriaLabel: 'Collapse',
    skillBarExpand: '↑ Expand',
    skillBarExpandAriaLabel: 'Expand',
    skillFilterActive: 'Filtering by {tech}',
    skillFilterClear: '✕ Clear',
    skillFilterClearAriaLabel: 'Clear filter and close',
    skillFilterPlaceholder: 'Select skills to filter',
    tabEducation: 'Education',
    tabIntro: 'Intro',
    tabProjects: 'Projects',
    tabSkills: 'Skills',
    tabWork: 'Work',
    techStack: 'Tech Stack',
    tocProjectDetails: 'Project Details',
    tocTitle: 'Table of Contents',
    toggleLanguage: '한국어로 전환하기',
    viewProjectDetails: 'View project details',
    visitSite: 'Visit Site',
    whatDidIDo: 'What did I Do',
  },
};

export const getLabels = (lang: Language): Labels => {
  return labelsMap[lang];
};
