import { style } from '@vanilla-extract/css';

export const textFieldContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '100%',
});

export const textFieldContainerInline = style({
  width: 'auto',
});

export const label = style({
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: 'var(--sc-input-label-color)',
  marginBottom: '2px',
});

export const labelRequired = style({
  ':after': {
    content: '" *"',
    color: 'var(--sc-input-error-color)',
  },
});

export const inputWrapper = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'var(--sc-input-bg)',
  border: '1px solid var(--sc-input-border-default)',
  borderRadius: 'var(--sc-input-radius)',
  padding: '0 var(--sc-input-padding-x)',
  transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  
  ':hover': {
    borderColor: 'var(--sc-input-border-hover)',
  },
  
  ':focus-within': {
    borderColor: 'var(--sc-input-border-focus)',
    boxShadow: '0 0 0 3px var(--sc-input-focus-ring)',
  },
});

export const inputWrapperError = style({
  borderColor: 'var(--sc-input-border-error)',
  
  ':hover': {
    borderColor: 'var(--sc-input-border-error)',
  },
  
  ':focus-within': {
    borderColor: 'var(--sc-input-border-error)',
    boxShadow: '0 0 0 3px color-mix(in srgb, var(--sc-input-error-color) 20%, transparent)',
  },
});

export const inputWrapperDisabled = style({
  borderColor: 'var(--sc-input-border-disabled)',
  opacity: 'var(--sc-input-disabled-alpha)',
  cursor: 'not-allowed',
  
  ':hover': {
    borderColor: 'var(--sc-input-border-disabled)',
  },
});

export const input = style({
  flex: 1,
  minWidth: 0,
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'var(--sc-input-text-color)',
  fontSize: '14px',
  lineHeight: 1.5,
  padding: 'var(--sc-input-padding-y) 0',
  
  '::placeholder': {
    color: 'var(--sc-input-placeholder-color)',
  },
  
  ':disabled': {
    cursor: 'not-allowed',
  },
});

export const icon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--sc-input-label-color)',
  flexShrink: 0,
});

export const helperText = style({
  fontSize: '12px',
  lineHeight: 1.4,
  color: 'var(--sc-input-helper-color)',
  margin: 0,
});

export const errorText = style({
  fontSize: '12px',
  lineHeight: 1.4,
  color: 'var(--sc-input-error-color)',
  margin: 0,
});
