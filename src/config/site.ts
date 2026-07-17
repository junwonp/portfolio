const getPortfolioUrl = () => {
  if (typeof process !== 'undefined' && process.env) {
    const configuredUrl = process.env.PORTFOLIO_URL?.trim();
    if (configuredUrl) {
      return configuredUrl.replace(/\/+$/, '');
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
