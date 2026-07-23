import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', {
  '@media': {
    '(max-width: 576px)': {
      fontSize: '16px',
    },
  },
});
