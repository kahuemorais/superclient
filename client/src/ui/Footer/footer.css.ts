import { style } from '@vanilla-extract/css';

export const footerContainer = style({
  padding: 'var(--sc-footer-py-mobile, 32px) var(--sc-footer-px-mobile, 16px)',
  borderTop: '1px solid color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent)',
  backgroundColor: 'var(--md-sys-color-surface)',
  
  '@media': {
    '(min-width: 960px)': {
      padding: 'var(--sc-footer-py-desktop, 32px) var(--sc-footer-px-desktop, 48px)',
    },
  },
});

export const footerInner = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 'var(--sc-footer-gap, 16px)',
  flexDirection: 'column',
  
  '@media': {
    '(min-width: 960px)': {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
});

export const footerCopyright = style({
  fontSize: '14px',
  lineHeight: 1.5,
  color: 'var(--md-sys-color-on-surface-variant)',
});

export const footerLinks = style({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--sc-footer-links-gap, 16px)',
  flexWrap: 'wrap',
});

export const footerLink = style({
  fontSize: '14px',
  lineHeight: 1.5,
  color: 'var(--md-sys-color-on-surface-variant)',
  textDecoration: 'none',
  transition: 'color 120ms ease',
  
  ':hover': {
    textDecoration: 'underline',
  },
});
