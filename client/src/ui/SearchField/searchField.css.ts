import { style } from "@vanilla-extract/css";

export const clearButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  padding: 0,
  margin: 0,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'var(--sc-input-label-color)',
  cursor: 'pointer',
  flexShrink: 0,
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  boxShadow: 'none',
  
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
  },
  
  ':active': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export const clearButtonGhost = style({
  width: '48px',
  height: '48px',
  flexShrink: 0,
  display: 'inline-block',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  boxShadow: 'none',
  padding: 0,
  margin: 0,
});
