import { createGlobalTheme, createGlobalThemeContract, globalStyle } from '@vanilla-extract/css';

const kebabCase = (str: string) => str.replace(/([A-Z])/g, '-$1').toLowerCase();

// 1. Create a global theme contract with custom names to match existing CSS custom properties
export const vars = createGlobalThemeContract({
  space: {
    '2xs': null,
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    projectGap: null,
    rowPadding: null,
    rowGap: null,
  },
  fontFamily: {
    code: null,
    text: null,
  },
  fontSize: {
    h1: null,
    h2: null,
    h3: null,
    h4: null,
    h5: null,
    h6: null,
    body: null,
    role: null,
    tagline: null,
  },
  lineHeight: {
    tight: null,
    heading: null,
    body: null,
    default: null,
  },
  radius: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    full: null,
    squircle: null,
    circle: null,
  },
  ease: {
    standard: null,
    emphasized: null,
    snap: null,
  },
  z: {
    base: null,
    raised: null,
    elevated: null,
    docked: null,
    sticky: null,
    dropdown: null,
    overlay: null,
    modal: null,
  },
  shadow: {
    card: null,
    cardLifted: null,
    floating: null,
    menu: null,
  },
  color: {
    bold: null,
    inlineCode: null,
    main: null,
    placeholder: null,
    quoted: null,
    sub: null,
    basicBg: null,
    codeBg: null,
    disabledBg: null,
    inlineBg: null,
    scrollThumb: null,
    scrollTrack: null,
    shadow: null,
    tableBg: null,
    bgDivider: null,
    bgSubdivider: null,
    quotedBorder: null,
    scrollBorder: null,
    selection: null,
    tableBorder: null,
    primary: null,
    primaryHover: null,
    primaryTransparent: null,
    primaryBg: null,
    onPrimary: null,
    surfaceHover: null,
    error: null,
    catLanguages: null,
    catFrameworks: null,
    catUi: null,
    catState: null,
    catPerformance: null,
    catBackend: null,
    catDevops: null,
  },
  glass: {
    bg: null,
    blur: null,
    border: null,
  },
}, (value, path) => {
  const section = path[0];
  const key = kebabCase(path[1]);
  if (section === 'fontSize') {
    return `font-${key}`;
  }
  if (section === 'fontFamily') {
    return `font-family-${key}`;
  }
  return `${kebabCase(section)}-${key}`;
});

// 2. Define the global theme values (Light/Default theme) on :root
createGlobalTheme(':root', vars, {
  space: {
    '2xs': '0.25rem',
    xs: '0.5rem',
    sm: '1rem',
    md: '2rem',
    lg: '4rem',
    xl: '6rem',
    projectGap: '4rem',
    rowPadding: '2rem',
    rowGap: '4rem',
  },
  fontFamily: {
    code: "'Geist Mono'",
    text: "var(--font-wanted-sans, 'Wanted Sans')",
  },
  fontSize: {
    h1: '2.25rem',
    h2: '1.5rem',
    h3: '1.1875rem',
    h4: '1.0625rem',
    h5: '1rem',
    h6: '0.875rem',
    body: '1rem',
    role: '2rem',
    tagline: '1.5rem',
  },
  lineHeight: {
    tight: '1.1',
    heading: '1.3',
    body: '1.55',
    default: '1.15',
  },
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    // Pill shape — used for nav bars, tabs, badges, chips, and buttons
    full: '9999px',
    // iOS-style app icon silhouette
    squircle: '22.5%',
    circle: '50%',
  },
  ease: {
    // M3 spec curves — standard for everyday motion, emphasized for entrances
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    // Carousel snap — kept as its own token so drag-and-settle stays distinct
    snap: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  // Values preserved from the previous scattered literals so stacking
  // relationships do not change — the tokens only name the intent
  z: {
    base: '1',
    raised: '10',
    elevated: '20',
    docked: '30',
    sticky: '50',
    dropdown: '100',
    overlay: '1000',
    modal: '1100',
  },
  shadow: {
    card: '0 4px 20px rgba(0, 0, 0, 0.03)',
    cardLifted: '0 8px 30px rgba(0, 0, 0, 0.05)',
    floating: '0 4px 12px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    menu: '0 16px 40px rgba(0, 0, 0, 0.06)',
  },
  color: {
    bold: 'oklch(0% 0 0)',
    inlineCode: 'oklch(22.84% 0.01 250)',
    main: 'oklch(28.26% 0 0)',
    placeholder: 'oklch(67.4% 0 0)',
    quoted: 'oklch(41.13% 0.02 245)',
    sub: 'oklch(33.09% 0 0)',
    basicBg: 'oklch(100% 0 0)',
    codeBg: 'oklch(97.6% 0.01 230)',
    disabledBg: 'oklch(97.28% 0 0)',
    inlineBg: 'oklch(88.94% 0.01 230)',
    scrollThumb: 'oklch(57.51% 0 0)',
    scrollTrack: 'oklch(98.61% 0 0)',
    shadow: 'oklch(0% 0 0 / 0.16)',
    tableBg: 'oklch(97.87% 0.01 230)',
    bgDivider: 'oklch(87.56% 0.01 230)',
    bgSubdivider: 'oklch(94.8% 0.01 230)',
    quotedBorder: 'oklch(85.34% 0.01 230)',
    scrollBorder: 'oklch(92.74% 0 0)',
    selection: 'oklch(90.15% 0.04 250)',
    tableBorder: 'oklch(87.7% 0.01 230)',
    primary: 'oklch(45.54% 0.16 260)',
    primaryHover: 'oklch(38.08% 0.15 260)',
    primaryTransparent: 'oklch(45.54% 0.16 260 / 0.1)',
    primaryBg: 'oklch(45.54% 0.16 260)',
    onPrimary: 'oklch(100% 0 0)',
    surfaceHover: 'oklch(96.22% 0.01 230)',
    error: 'oklch(60.1% 0.22 17.5)',
    catLanguages: 'oklch(62% 0.16 250)',
    catFrameworks: 'oklch(62% 0.16 150)',
    catUi: 'oklch(62% 0.16 340)',
    catState: 'oklch(62% 0.16 295)',
    catPerformance: 'oklch(62% 0.16 55)',
    catBackend: 'oklch(62% 0.15 95)',
    catDevops: 'oklch(62% 0.16 195)',
  },
  glass: {
    bg: 'oklch(100% 0 0 / 0.45)',
    blur: 'saturate(140%) blur(20px)',
    border: '1px solid oklch(0% 0 0 / 0.06)',
  },
});

// 3. Redefine dark theme values under html.dark selector
globalStyle('html.dark', {
  vars: {
    [vars.color.bold]: 'oklch(85.5% 0.01 230)',
    [vars.color.inlineCode]: 'oklch(80.59% 0.01 230)',
    [vars.color.main]: 'oklch(85.5% 0.01 230)',
    [vars.color.placeholder]: 'oklch(80% 0 0)',
    [vars.color.quoted]: 'oklch(63.26% 0.02 240)',
    [vars.color.sub]: 'oklch(63.45% 0.02 240)',
    [vars.color.basicBg]: 'oklch(14.07% 0.02 250)',
    [vars.color.codeBg]: 'oklch(18.66% 0.02 250)',
    [vars.color.disabledBg]: 'oklch(23.63% 0.02 250)',
    [vars.color.inlineBg]: 'oklch(30.1% 0.02 250)',
    [vars.color.scrollThumb]: 'oklch(50% 0 0)',
    [vars.color.scrollTrack]: 'oklch(27.42% 0 0)',
    [vars.color.shadow]: 'oklch(0% 0 0 / 0.16)',
    [vars.color.tableBg]: 'oklch(14.07% 0.02 250)',
    [vars.color.bgDivider]: 'oklch(28.98% 0.02 250)',
    [vars.color.bgSubdivider]: 'oklch(27.56% 0.02 250)',
    [vars.color.quotedBorder]: 'oklch(28.98% 0.02 250)',
    [vars.color.scrollBorder]: 'oklch(33.09% 0 0)',
    [vars.color.selection]: 'oklch(35.53% 0.08 260)',
    [vars.color.tableBorder]: 'oklch(21.46% 0.02 250)',
    [vars.color.primary]: 'oklch(72.76% 0.15 250)',
    [vars.color.primaryHover]: 'oklch(79.35% 0.13 250)',
    [vars.color.primaryTransparent]: 'oklch(72.76% 0.15 250 / 0.15)',
    [vars.color.primaryBg]: 'oklch(72.76% 0.15 250)',
    [vars.color.onPrimary]: 'oklch(14.07% 0.02 250)',
    [vars.color.surfaceHover]: 'oklch(21.68% 0.02 250)',
    [vars.color.error]: 'oklch(67.75% 0.22 17.5)',
    [vars.shadow.card]: '0 4px 20px rgba(0, 0, 0, 0.2)',
    [vars.shadow.cardLifted]: '0 8px 30px rgba(0, 0, 0, 0.28)',
    [vars.shadow.floating]:
      '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    [vars.shadow.menu]: '0 16px 40px rgba(0, 0, 0, 0.45)',
    [vars.glass.bg]: 'oklch(100% 0 0 / 0.06)',
    [vars.glass.border]: '1px solid oklch(100% 0 0 / 0.12)',
  },
});

// 4. Redefine responsive text size & space variables with media queries
globalStyle(':root', {
  '@media': {
    '(max-width: 960px)': {
      vars: {
        [vars.fontSize.h1]: '2rem',
        [vars.fontSize.h2]: '1.375rem',
        [vars.fontSize.h3]: '1.125rem',
        [vars.fontSize.role]: '1.625rem',
        [vars.fontSize.tagline]: '1.25rem',
        [vars.space.xl]: '4rem',
        [vars.space.lg]: '3rem',
        [vars.space.projectGap]: 'var(--space-sm)',
        [vars.space.rowPadding]: 'var(--space-sm)',
        [vars.space.rowGap]: 'var(--space-sm)',
      },
    },
    '(max-width: 576px)': {
      vars: {
        [vars.fontSize.h1]: '1.75rem',
        [vars.fontSize.h2]: '1.25rem',
        [vars.fontSize.h3]: '1.125rem',
        [vars.fontSize.h4]: '1.05rem',
        [vars.fontSize.role]: '1.375rem',
        [vars.fontSize.tagline]: '1.125rem',
        [vars.space.xl]: '3rem',
        [vars.space.lg]: '2.5rem',
        [vars.space.md]: '1.5rem',
        [vars.space.projectGap]: 'var(--space-sm)',
        [vars.space.rowPadding]: 'var(--space-xs)',
        [vars.space.rowGap]: 'var(--space-sm)',
      },
    },
  },
});
