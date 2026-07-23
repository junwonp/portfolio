import { globalStyle } from '@vanilla-extract/css';

/* Gruvbox Light Theme (Default) */
globalStyle('code[class*="language-"], pre[class*="language-"]', {
  color: '#3c3836',
  fontFamily: "Consolas, Monaco, 'Andale Mono', monospace",
  direction: 'ltr',
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  lineHeight: 1.5,
  tabSize: 4,
  hyphens: 'none',
});

globalStyle(
  'pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection, code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection',
  {
    color: '#282828',
    background: '#a89984',
  }
);

globalStyle(
  'pre[class*="language-"]::selection, pre[class*="language-"] ::selection, code[class*="language-"]::selection, code[class*="language-"] ::selection',
  {
    color: '#282828',
    background: '#a89984',
  }
);

globalStyle('pre[class*="language-"]', {
  padding: '1em',
  margin: '0.5em 0',
  overflow: 'auto',
});

globalStyle('pre[class*="language-"] code, pre[class*="language-"] code *', {
  backgroundColor: 'transparent !important',
});

globalStyle(':not(pre) > code[class*="language-"], pre[class*="language-"]', {
  background: '#f9f5d7',
});

globalStyle(':not(pre) > code[class*="language-"]', {
  padding: '0.1em',
  borderRadius: '0.3em',
});

globalStyle('.token.comment, .token.prolog, .token.cdata', {
  color: '#7c6f64',
});

globalStyle(
  '.token.delimiter, .token.boolean, .token.keyword, .token.selector, .token.important, .token.atrule',
  {
    color: '#9d0006',
  }
);

globalStyle('.token.operator, .token.punctuation, .token.attr-name', {
  color: '#7c6f64',
});

globalStyle('.token.tag, .token.tag .punctuation, .token.doctype, .token.builtin', {
  color: '#b57614',
});

globalStyle('.token.entity, .token.number, .token.symbol', {
  color: '#8f3f71',
});

globalStyle('.token.property, .token.constant, .token.variable', {
  color: '#9d0006',
});

globalStyle('.token.string, .token.char', {
  color: '#797403',
});

globalStyle('.token.attr-value, .token.attr-value .punctuation', {
  color: '#7c6f64',
});

globalStyle('.token.url', {
  color: '#797403',
  textDecoration: 'underline',
});

globalStyle('.token.function', {
  color: '#b57614',
});

globalStyle('.token.regex', {
  background: '#797403',
});

globalStyle('.token.bold', {
  fontWeight: 'bold',
});

globalStyle('.token.italic', {
  fontStyle: 'italic',
});

globalStyle('.token.inserted', {
  background: '#7c6f64',
});

globalStyle('.token.deleted', {
  background: '#9d0006',
});

/* Gruvbox Dark Theme (html.dark) */
globalStyle('html.dark code[class*="language-"], html.dark pre[class*="language-"]', {
  color: '#ebdbb2',
});

globalStyle(
  'html.dark pre[class*="language-"]::-moz-selection, html.dark pre[class*="language-"] ::-moz-selection, html.dark code[class*="language-"]::-moz-selection, html.dark code[class*="language-"] ::-moz-selection',
  {
    color: '#fbf1c7',
    background: '#7c6f64',
  }
);

globalStyle(
  'html.dark pre[class*="language-"]::selection, html.dark pre[class*="language-"] ::selection, html.dark code[class*="language-"]::selection, html.dark code[class*="language-"] ::selection',
  {
    color: '#fbf1c7',
    background: '#7c6f64',
  }
);

globalStyle('html.dark :not(pre) > code[class*="language-"], html.dark pre[class*="language-"]', {
  background: '#1d2021',
});

globalStyle(
  'html.dark .token.comment, html.dark .token.prolog, html.dark .token.cdata',
  {
    color: '#a89984',
  }
);

globalStyle(
  'html.dark .token.delimiter, html.dark .token.boolean, html.dark .token.keyword, html.dark .token.selector, html.dark .token.important, html.dark .token.atrule',
  {
    color: '#fb4934',
  }
);

globalStyle('html.dark .token.operator, html.dark .token.punctuation', {
  color: '#a89984',
});

globalStyle('html.dark .token.attr-name', {
  color: '#8ec07c',
});

globalStyle(
  'html.dark .token.tag, html.dark .token.tag .punctuation, html.dark .token.doctype, html.dark .token.builtin',
  {
    color: '#fabd2f',
  }
);

globalStyle('html.dark .token.entity, html.dark .token.number, html.dark .token.symbol', {
  color: '#d3869b',
});

globalStyle(
  'html.dark .token.property, html.dark .token.constant',
  {
    color: '#fb4934',
  }
);

globalStyle('html.dark .token.variable', {
  color: '#ebdbb2',
});

globalStyle('html.dark .token.string, html.dark .token.char', {
  color: '#b8bb26',
});

globalStyle(
  'html.dark .token.attr-value, html.dark .token.attr-value .punctuation',
  {
    color: '#b8bb26',
  }
);

globalStyle('html.dark .token.url', {
  color: '#b8bb26',
});

globalStyle('html.dark .token.function', {
  color: '#fabd2f',
});

globalStyle('html.dark .token.regex', {
  color: '#b8bb26',
});

globalStyle('html.dark .token.inserted', {
  color: '#a89984',
});

globalStyle('html.dark .token.deleted', {
  color: '#fb4934',
});
