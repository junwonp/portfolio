// Display labels for the interaction insights panel and the sessions table.
// Analytics stores fixed kinds (`github`, `external:<domain>`, `light`, `ko`),
// so a label that is not mapped yet falls back to its raw value instead of
// vanishing from the ranking.

const EXTERNAL_LABEL_PREFIX = 'external:';

const OUTBOUND_LINK_LABELS: Record<string, string> = {
  email: '이메일',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  resume: '이력서',
};

const THEME_TOGGLE_LABELS: Record<string, string> = {
  dark: '다크',
  light: '라이트',
};

const LOCALE_SWITCH_LABELS: Record<string, string> = {
  en: '영어',
  ko: '한국어',
};

export function formatOutboundLinkLabel(label: string): string {
  const trimmed = label?.trim() ?? '';

  if (trimmed.startsWith(EXTERNAL_LABEL_PREFIX)) {
    const domain = trimmed.slice(EXTERNAL_LABEL_PREFIX.length).trim();
    return domain.length > 0 ? domain : trimmed;
  }

  return OUTBOUND_LINK_LABELS[trimmed] ?? trimmed;
}

export function formatThemeToggleLabel(label: string): string {
  const trimmed = label?.trim() ?? '';
  return THEME_TOGGLE_LABELS[trimmed] ?? trimmed;
}

export function formatLocaleSwitchLabel(label: string): string {
  const trimmed = label?.trim() ?? '';
  return LOCALE_SWITCH_LABELS[trimmed] ?? trimmed;
}

// `accept_language` is nullable in D1, so rows recorded before the column
// existed read back as NULL or `unknown`; show a label instead of a blank cell.
export function formatAcceptLanguage(value: string): string {
  const trimmed = value?.trim() ?? '';
  return trimmed.length === 0 || trimmed.toLowerCase() === 'unknown' ? '알 수 없음' : trimmed;
}
