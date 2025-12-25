import { style } from '@vanilla-extract/css';

export const card = style({
  backgroundColor: 'var(--md-sys-color-surface)',
  borderRadius: 'var(--md-sys-shape-corner-large, 16px)',
  border: '1px solid var(--md-sys-color-outline-variant)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

export const cardHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '20px 24px',
  borderBottom: '1px solid var(--md-sys-color-outline-variant)',
});

export const cardHeaderContent = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const cardTitle = style({
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.3,
  color: 'var(--md-sys-color-on-surface)',
  margin: 0,
});

export const cardSubtitle = style({
  fontSize: '14px',
  lineHeight: 1.5,
  color: 'var(--md-sys-color-on-surface-variant)',
  margin: 0,
});

export const cardActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
});

export const cardContent = style({
  padding: '24px',
  flex: 1,
  minHeight: 0,
  
  '@media': {
    '(max-width: 959px)': {
      padding: '20px',
    },
  },
});
