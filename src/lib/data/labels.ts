import type { Language } from '$lib/utils/language';

export interface Labels {
  contentLoadError: string;
  description: string;
  errorOccurred: string;
  goHome: string;
  goToGithubPage: string;
  goToGithubProfile: string;
  goToLinkedinPage: string;
  goToProductPage: string;
  languageToggleError: string;
  pageNotFound: string;
  project: string;
  projectNotFound: string;
  techStack: string;
  toggleLanguage: string;
  viewProjectDetails: string;
  whatDidIDo: string;
}

export const labelsMap: Record<Language, Labels> = {
  ko: {
    contentLoadError: '컨텐츠를 불러올 수 없습니다.',
    description: '설명',
    errorOccurred: '오류가 발생했습니다',
    goHome: '홈으로 돌아가기',
    goToGithubPage: 'GitHub 페이지로 이동',
    goToGithubProfile: 'GitHub 프로필로 이동',
    goToLinkedinPage: 'Linkedin 페이지로 이동',
    goToProductPage: '제품 페이지로 이동',
    languageToggleError: '언어 전환에 실패했습니다.',
    pageNotFound: '페이지를 찾을 수 없습니다',
    project: '프로젝트',
    projectNotFound: '프로젝트를 찾을 수 없습니다.',
    techStack: '기술 스택',
    toggleLanguage: 'Switch to English',
    viewProjectDetails: '프로젝트 자세히 보기',
    whatDidIDo: '주요 작업',
  },
  en: {
    contentLoadError: 'Unable to load content.',
    description: 'Description',
    errorOccurred: 'An error occurred',
    goHome: 'Go home',
    goToGithubPage: 'Go to Github page',
    goToGithubProfile: 'Go to Github profile',
    goToLinkedinPage: 'Go to Linkedin page',
    goToProductPage: 'Go to product page',
    languageToggleError: 'Failed to switch language.',
    pageNotFound: 'Page not found',
    project: 'Project',
    projectNotFound: 'Project not found.',
    techStack: 'Tech Stack',
    toggleLanguage: '한국어로 전환하기',
    viewProjectDetails: 'View project details',
    whatDidIDo: 'What did I Do',
  },
};

export const getLabels = (lang: Language): Labels => {
  return labelsMap[lang];
};
