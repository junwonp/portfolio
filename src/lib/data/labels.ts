import type { Language } from '$lib/utils/language';

export interface Labels {
  contentLoadError: string;
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
  pageNotFound: string;
  printPreview: string;
  project: string;
  resumeTitle: string;
  sectionArchives: string;
  showDetails: string;
  sectionEducation: string;
  sectionIntro: string;
  sectionAwards: string;
  sectionSkills: string;
  sectionWork: string;
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
  whatDidIDo: string;
}

export const labelsMap: Record<Language, Labels> = {
  ko: {
    contentLoadError: '컨텐츠를 불러올 수 없습니다.',
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
    pageNotFound: '페이지를 찾을 수 없습니다',
    printPreview: '자세히 보기',
    project: '프로젝트',
    resumeTitle: '포트폴리오',
    sectionArchives: '기타 활동',
    showDetails: '상세보기',
    sectionEducation: '학력',
    sectionIntro: '소개',
    sectionAwards: '수상 및 프로젝트',
    sectionSkills: '기술 스택',
    sectionWork: '경력',
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
    whatDidIDo: '주요 작업',
  },
  en: {
    contentLoadError: 'Unable to load content.',
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
    pageNotFound: 'Page not found',
    printPreview: 'View Details',
    project: 'Project',
    resumeTitle: 'Portfolio',
    sectionArchives: 'Archives',
    showDetails: 'Show details',
    sectionEducation: 'Education',
    sectionIntro: 'Introduction',
    sectionAwards: 'Awards & Projects',
    sectionSkills: 'Skills Set',
    sectionWork: 'Work Experience',
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
    whatDidIDo: 'What did I Do',
  },
};

export const getLabels = (lang: Language): Labels => {
  return labelsMap[lang];
};
