import 'normalize.css';

import { globalFontFace, globalStyle } from '@vanilla-extract/css';

globalFontFace('Geist Mono', {
  fontWeight: '100 900',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  src: 'url("/fonts/GeistMono[wght].woff2") format("woff2 supports variations"), url("/fonts/GeistMono[wght].woff2") format("woff2")',
});

globalStyle('*', {
  boxSizing: 'border-box',
});

globalStyle('::selection', {
  background: 'var(--color-selection)',
});

globalStyle('html, body', {
  MozOsxFontSmoothing: 'grayscale',
  WebkitFontSmoothing: 'antialiased',
  WebkitTextSizeAdjust: 'none',
  background: 'var(--color-basic-bg)',
  color: 'var(--color-main)',
  fontFamily: `var(--font-family-text), -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  fontSize: '16px',
  height: '100%',
  lineHeight: 'var(--line-height-default)',
  margin: 0,
  overflowX: 'hidden',
  padding: 0,
  scrollbarWidth: 'none',
  wordBreak: 'keep-all',
});

globalStyle('#root', {
  height: '100%',
});

globalStyle('h1, h2, h3, h4, h5, h6', {
  fontFamily: 'var(--font-family-text), sans-serif',
});

globalStyle('h1', {
  fontSize: 'var(--font-h1)',
  fontWeight: 800,
  color: 'var(--color-bold)',
  lineHeight: 'var(--line-height-tight)',
  letterSpacing: '-0.02em',
  marginTop: 0,
  marginBottom: 'var(--space-xs)',
});

globalStyle('h2', {
  fontSize: 'var(--font-h2)',
  fontWeight: 700,
  color: 'var(--color-bold)',
  lineHeight: 'var(--line-height-heading)',
  marginTop: 'var(--space-xl)',
  marginBottom: 'var(--space-md)',
  '@media': {
    '(max-width: 576px)': {
      marginTop: 'var(--space-lg)',
    },
  },
});

globalStyle('h3', {
  fontSize: 'var(--font-h3)',
  fontWeight: 700,
  color: 'var(--color-bold)',
  lineHeight: 'var(--line-height-heading)',
  marginBottom: '0.25rem',
});

globalStyle('h4', {
  fontSize: 'var(--font-h4)',
  fontWeight: 600,
  color: 'var(--color-bold)',
  lineHeight: 1.3,
  marginTop: 0,
  marginBottom: 'var(--space-sm)',
});

globalStyle('h5', {
  fontSize: 'var(--font-h5)',
  fontWeight: 600,
  color: 'var(--color-bold)',
  lineHeight: 1.3,
  marginBottom: 'var(--space-xs)',
});

globalStyle('h6', {
  fontSize: 'var(--font-h6)',
  color: 'var(--color-sub)',
  fontWeight: 400,
  margin: 0,
});

globalStyle('p, aside', {
  fontSize: 'var(--font-body)',
  marginBottom: 'var(--space-sm)',
  lineHeight: 'var(--line-height-body)',
});

globalStyle('ul', {
  fontSize: 'var(--font-body)',
  listStyle: 'none',
  margin: '0 0 var(--space-md) 0',
  padding: 0,
});

globalStyle('ul li', {
  padding: '0.2rem 0 0.2rem 1.2rem',
  position: 'relative',
  lineHeight: 1.6,
});

globalStyle('ol li', {
  padding: '0.2rem 0 0.2rem 0.5rem',
  lineHeight: 1.6,
});

globalStyle('ul li:before', {
  color: 'var(--color-sub)',
  content: '"•"',
  display: 'inline-block',
  left: '0.2rem',
  position: 'absolute',
  fontWeight: 'bold',
});

globalStyle('a', {
  color: 'var(--color-primary)',
  transition: 'color 0.2s ease, text-decoration-color 0.2s ease',
  textDecoration: 'underline',
  textDecorationThickness: '1px',
  textUnderlineOffset: '3px',
  fontWeight: 500,
});

globalStyle('a:hover', {
  color: 'var(--color-primary-hover)',
});

globalStyle('*, *::before, *::after', {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animationDuration: '0.01ms !important',
      animationIterationCount: '1 !important',
      scrollBehavior: 'auto',
      transitionDuration: '0.01ms !important',
    },
  },
});

globalStyle('.icon a, a svg:only-child', {
  textDecoration: 'none',
});

globalStyle('a:focus-visible, button:focus-visible', {
  outline: '2px solid var(--color-primary)',
  outlineOffset: '2px',
  borderRadius: '4px',
});

globalStyle('code:not(pre code)', {
  fontFamily: 'var(--font-family-code), monospace !important',
  fontFeatureSettings: '"liga" 1, "calt" 1',
  backgroundColor: 'var(--color-inline-bg)',
  padding: '0.12em 0.35em',
  borderRadius: '4px',
  fontSize: '0.875em',
  color: 'var(--color-inline-code)',
});

globalStyle('.badge', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '9999px',
  fontSize: '0.8125rem',
  fontWeight: 500,
  padding: '0.3rem 0.7rem',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  letterSpacing: '-0.01em',
});

globalStyle('.badge.primary', {
  background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  color: 'var(--color-primary)',
});

globalStyle('.badge.green', {
  backgroundColor: 'rgba(52, 199, 89, 0.1)',
  color: '#1a7532',
});

globalStyle('html.dark .badge.green', {
  backgroundColor: 'rgba(48, 209, 88, 0.15)',
  color: '#30d158',
});

globalStyle('.badge.orange', {
  backgroundColor: 'rgba(255, 149, 0, 0.1)',
  color: '#ab6400',
});

globalStyle('html.dark .badge.orange', {
  backgroundColor: 'rgba(255, 159, 10, 0.15)',
  color: '#ff9f0a',
});

globalStyle('.badge.sub', {
  background: 'color-mix(in srgb, var(--color-sub) 8%, transparent)',
  color: 'var(--color-sub)',
});

globalStyle('.badge.android', {
  backgroundColor: 'rgba(61, 220, 132, 0.1)',
  color: '#1e8048',
});

globalStyle('html.dark .badge.android', {
  backgroundColor: 'rgba(61, 220, 132, 0.15)',
  color: '#3ddc84',
});

globalStyle('.badge.ios', {
  backgroundColor: 'rgba(0, 122, 255, 0.1)',
  color: '#007aff',
});

globalStyle('html.dark .badge.ios', {
  backgroundColor: 'rgba(10, 132, 255, 0.15)',
  color: '#0a84ff',
});

globalStyle('.badge.macos', {
  backgroundColor: 'rgba(255, 149, 0, 0.1)',
  color: '#ab6400',
});

globalStyle('html.dark .badge.macos', {
  backgroundColor: 'rgba(255, 159, 10, 0.15)',
  color: '#ff9f0a',
});

globalStyle('.badge.web', {
  backgroundColor: 'rgba(255, 59, 48, 0.1)',
  color: '#d62d20',
});

globalStyle('html.dark .badge.web', {
  backgroundColor: 'rgba(255, 69, 58, 0.15)',
  color: '#ff453a',
});

globalStyle('pre', {
  fontFamily: 'var(--font-family-code), monospace !important',
  fontFeatureSettings: '"liga" 1, "calt" 1',
  backgroundColor: 'var(--color-code-bg)',
  border: '1px solid var(--color-bg-divider)',
  borderRadius: '6px',
  padding: 'var(--space-sm)',
  margin: 'var(--space-md) 0',
  overflowX: 'auto',
  overflowY: 'hidden',
  lineHeight: 1.6,
  fontSize: '0.9em',
});

globalStyle('pre code', {
  backgroundColor: 'transparent !important',
  border: 'none',
  padding: 0,
  margin: 0,
  fontSize: '1em',
  color: 'inherit',
});

globalStyle('blockquote', {
  borderLeft: '3px solid var(--color-quoted-border)',
  color: 'var(--color-quoted)',
  margin: 'var(--space-sm) 0',
  padding: 'var(--space-xs) var(--space-sm)',
  lineHeight: 1.7,
});

globalStyle('article img', {
  maxWidth: '100%',
  maxHeight: '60vh',
  height: 'auto',
  objectFit: 'contain',
});

globalStyle('::-webkit-scrollbar', {
  backgroundColor: 'var(--color-scroll-track)',
  border: 'solid 1px var(--color-scroll-border)',
  margin: '1px',
  width: '10px',
});

globalStyle('::-webkit-scrollbar-track', {
  border: 'solid 3px transparent',
  boxShadow: 'inset 0 0 10px 10px var(--color-scroll-track)',
});

globalStyle('::-webkit-scrollbar-thumb', {
  borderRadius: '10px',
  border: 'solid 3px transparent',
  boxShadow: 'inset 0 0 10px 10px var(--color-scroll-thumb)',
});

globalStyle('.pc-tablet-only', {
  display: 'block',
  '@media': {
    '(max-width: 576px)': {
      display: 'none',
    },
  },
});

globalStyle('.tablet-mobile-only', {
  display: 'none',
  '@media': {
    '(max-width: 960px)': {
      display: 'block',
    },
  },
});

globalStyle('.mobile-only', {
  display: 'none',
  '@media': {
    '(max-width: 576px)': {
      display: 'block',
    },
  },
});

globalStyle('.glass-effect', {
  background: 'var(--glass-bg)',
  border: 'var(--glass-border)',
  WebkitBackdropFilter: 'saturate(140%) blur(20px) !important',
  backdropFilter: 'saturate(140%) blur(20px) !important',
});

globalStyle('.wrapper', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  minWidth: 0,
  width: '100%',
  '@media': {
    print: {
      paddingBottom: '0 !important',
      minHeight: '0 !important',
    },
  },
});

globalStyle('.wrapper:not(.is-admin)', {
  '@media': {
    '(max-width: 960px)': {
      paddingBottom: 'calc(64px + env(safe-area-inset-bottom))',
    },
  },
});

globalStyle('.content-wrapper', {
  display: 'flex',
  justifyContent: 'center',
  flexGrow: 1,
  minWidth: 0,
  width: '100%',
});

globalStyle('main.content', {
  width: '800px',
  maxWidth: '100%',
  minWidth: 0,
  padding: '2rem',

  '@media': {
    '(max-width: 576px)': {
      padding: '1rem',
    },
    '(min-width: 1024px)': {
      width: '900px',
    },
    '(min-width: 1280px)': {
      width: '1000px',
    },
    '(min-width: 1536px)': {
      width: '1200px',
    },
    print: {
      maxWidth: 'none !important',
      padding: '0 !important',
      width: '100% !important',
    },
  },
});

globalStyle('main.content.is-project', {
  paddingTop: '0 !important',
});

globalStyle('.footer-wrapper', {
  '@media': {
    print: {
      display: 'none !important',
    },
  },
});

globalStyle('.skip-link', {
  position: 'absolute',
  top: '-40px',
  left: 0,
  background: 'var(--color-primary-bg)',
  color: 'white',
  padding: '8px 16px',
  textDecoration: 'none',
  zIndex: 100,
  borderRadius: '0 0 4px 0',
});

globalStyle('.skip-link:focus', {
  top: 0,
  outline: '3px solid var(--color-primary)',
  outlineOffset: '2px',
});
