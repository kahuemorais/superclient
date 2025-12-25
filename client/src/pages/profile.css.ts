import { style } from "@vanilla-extract/css";

export const arrayFieldRow = style({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  width: "100%",
  minWidth: 0,
});

export const arrayFieldInput = style({
  fontFamily: "var(--md-sys-typescale-body-large-font-family-name)",
  fontSize: "var(--md-sys-typescale-body-large-font-size)",
  lineHeight: "var(--md-sys-typescale-body-large-line-height)",
  fontWeight: "var(--md-sys-typescale-body-large-font-weight)",
  letterSpacing: "var(--md-sys-typescale-body-large-letter-spacing)",
});

export const iconButtonWrapper = style({
  width: "48px",
  height: "56px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});
