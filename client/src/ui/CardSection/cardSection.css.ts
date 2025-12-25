import { style } from '@vanilla-extract/css';

export const cardSection = style({
  backgroundColor: 'var(--md-sys-color-surface-container-low)',
  borderRadius: 'var(--md-sys-shape-corner-medium, 12px)',
  border: '1px solid var(--md-sys-color-outline-variant)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  
  ':hover': {
    backgroundColor: 'var(--md-sys-color-surface-container)',
    borderColor: 'var(--md-sys-color-outline)',
  },
});

export const cardSectionInteractive = style({
  cursor: 'pointer',
  
  ':hover': {
    backgroundColor: 'var(--md-sys-color-surface-container)',
    borderColor: 'var(--md-sys-color-primary)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px color-mix(in srgb, var(--md-sys-color-shadow) 16%, transparent)',
  },
  
  ':active': {
    transform: 'translateY(0)',
    backgroundColor: 'var(--md-sys-color-surface-container-high)',
  },
  
  ':focus-visible': {
    outline: '2px solid var(--md-sys-color-primary)',
    outlineOffset: '2px',
  },
});

export const cardSectionCompact = style({
  padding: '12px',
  minHeight: '64px',
});
