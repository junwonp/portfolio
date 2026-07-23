import { style } from '@vanilla-extract/css';

import { projectItem } from './ProjectItem.css';

export const badge = style({
  alignSelf: 'center',
  background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
  borderRadius: '6px',
  color: 'var(--color-primary)',
  fontSize: '0.72rem',
  fontWeight: 700,
  lineHeight: 1,
  padding: '0.35rem 0.5rem',
  whiteSpace: 'nowrap',
});

export const linkMock = style({
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--color-primary)',
  display: 'inline-flex',
  alignItems: 'center',
  width: 'fit-content',

  selectors: {
    '[data-project-link-card="true"]:hover &': {
      textDecoration: 'underline',
    },
  },

  '@media': {
    '(max-width: 768px)': {
      alignSelf: 'flex-start',
    },
  },
});

export const skills = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
  minWidth: 0,
  marginTop: '0.25rem',
});

export const moreChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  color: 'var(--color-sub)',
  fontSize: '0.8125rem',
  fontWeight: 550,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  padding: '0.15rem 0.25rem',
  fontFamily: 'inherit',

  selectors: {
    'html.dark &': {
      color: 'var(--color-bold)',
    },
  },
});

export const spotlightContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  minWidth: 0,
  width: '100%',
});

export const header = style({
  alignItems: 'flex-start',
  display: 'flex',
  gap: '1rem',
  justifyContent: 'space-between',
  minWidth: 0,

  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
      gap: '0.5rem',
    },
  },
});

export const titleGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  minWidth: 0,
  flexWrap: 'wrap',
});

export const title = style({
  color: 'var(--color-bold)',
  fontSize: 'var(--font-h3)',
  fontWeight: 750,
  lineHeight: 1.25,
  margin: 0,
  overflowWrap: 'anywhere',
});

export const description = style({
  color: 'var(--color-main)',
  fontSize: '0.95rem',
  lineHeight: 1.55,
  margin: 0,
  overflowWrap: 'anywhere',
});

export const metrics = style({
  display: 'grid',
  gap: '0.5rem',
  gridTemplateColumns: 'repeat(var(--metric-count), minmax(0, 1fr))',
  margin: 0,

  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const resumeContent = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const resumeHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '1rem 0',
  width: '100%',

  selectors: {
    [`${projectItem} &`]: {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
    },
    '&[role="button"]': {
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    '&[role="button"]:hover': {
      backgroundColor: 'var(--color-surface-hover)',
    },
  },

  ':focus-visible': {
    outline: '2px solid var(--color-primary)',
    outlineOffset: '-2px',
  },

  '@media': {
    '(max-width: 576px)': {
      padding: '0.875rem 0',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.5rem',

      selectors: {
        [`${projectItem} &`]: {
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
        },
      },
    },
  },
});

export const titleGroupInline = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  flexWrap: 'wrap',
  minWidth: 0,
  flex: 1,

  '@media': {
    '(max-width: 576px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.35rem',
      width: '100%',
    },
  },
});

export const titleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  minWidth: 0,

  '@media': {
    '(max-width: 576px)': {
      width: '100%',
      flexWrap: 'wrap',
    },
  },
});

export const metaRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  minWidth: 0,

  '@media': {
    '(max-width: 576px)': {
      width: '100%',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
  },
});

export const resumeTitle = style({
  color: 'var(--color-bold)',
  fontSize: 'var(--font-h3)',
  fontWeight: 600,
  margin: 0,
  overflowWrap: 'anywhere',

  '@media': {
    '(max-width: 576px)': {
      fontSize: '1.15rem',
      lineHeight: 1.4,
    },
  },
});

export const resumePeriod = style({
  color: 'var(--color-sub)',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',

  '@media': {
    '(max-width: 576px)': {
      fontSize: '0.8125rem',
    },
  },
});

export const resumeLinkArea = style({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,

  '@media': {
    '(max-width: 576px)': {
      marginTop: '0.25rem',
      width: '100%',
      justifyContent: 'flex-start',
    },
  },
});

export const resumeBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '0 0 1.25rem 0',
  minWidth: 0,

  selectors: {
    [`${projectItem} &`]: {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
    },
  },

  '@media': {
    '(max-width: 576px)': {
      padding: '0 0 1.25rem 0',

      selectors: {
        [`${projectItem} &`]: {
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
        },
      },
    },
  },
});

export const resumeDescription = style({
  color: 'var(--color-sub)',
  fontSize: '0.9375rem',
  margin: 0,
  lineHeight: 1.5,
  minWidth: 0,
  overflowWrap: 'anywhere',
});

export const descSeparator = style({
  opacity: 0.5,
  margin: '0 0.4rem',
});

export const mainSkills = style({
  color: 'var(--color-sub)',
});

export const resumeMetrics = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(var(--metric-count), minmax(0, 1fr))',
  gap: '10px',
  marginTop: '0.5rem',
  width: '100%',

  '@media': {
    '(max-width: 480px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
});

export const detailGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const detailRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
});

export const detailLabel = style({
  width: 'fit-content',
});

export const labelPill = style({
  background: 'var(--color-bg-subdivider)',
  borderRadius: '6px',
  color: 'var(--color-sub)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  padding: '0.3rem 0.6rem',
  display: 'inline-block',
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
});

export const detailText = style({
  color: 'var(--color-main)',
  fontSize: '1rem',
  lineHeight: 1.6,
  flex: 1,
  minWidth: 0,
  overflowWrap: 'anywhere',
});
