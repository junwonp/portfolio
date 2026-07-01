const getPortfolioUrl = () => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.APP_ENV === 'development') {
      return 'https://preview.junwon.dev';
    }
    if (process.env.APP_ENV === 'local' || process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }
  }
  return 'https://junwon.dev';
};

export const PORTFOLIO_URL = getPortfolioUrl();
export const GITHUB_PROFILE = 'https://github.com/junwonp';
export const GITHUB_USERNAME = GITHUB_PROFILE.split('/').pop() ?? '';
export const LINKEDIN_PROFILE = 'https://www.linkedin.com/in/junwonp';

export const LANGUAGE_COOKIE = 'preferred-language';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
