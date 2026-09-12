export function getGithubHref(link: string | null | undefined): string {
  if (!link) return '';
  return link.startsWith('http') ? link : `https://github.com/${link}`;
}
