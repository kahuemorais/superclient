import { style } from '@vanilla-extract/css';

export const pageContainer = style({
  maxWidth: 'var(--sc-page-max-width, 1200px)',
  margin: '0 auto',
  width: '100%',
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: 'var(--sc-page-py-mobile, 16px) var(--sc-page-px-mobile, 16px)',
  
  '@media': {
    '(min-width: 960px)': {
      padding: 'var(--sc-page-py-desktop, 24px) var(--sc-page-px-desktop, 24px)',
    },
  },
});

export const pageHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 'var(--sc-page-py-mobile, 16px)',
  gap: 'var(--md-sys-spacing-16, 16px)',
  
  '@media': {
    '(min-width: 960px)': {
      marginBottom: 'var(--sc-page-py-desktop, 24px)',
    },
  },
});

export const pageTitle = style({
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 1.2,
  color: 'var(--md-sys-color-on-surface)',
  margin: 0,
});

export const pageActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--md-sys-spacing-8, 8px)',
});

export const pageContent = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});
