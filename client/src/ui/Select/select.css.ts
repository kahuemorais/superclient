import { style } from "@vanilla-extract/css";

export const selectRoot = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "56px",
  minHeight: "56px",
  borderRadius: "var(--sc-input-border-radius, 12px)",
  border: "1px solid var(--sc-input-border-color, rgba(230, 237, 243, 0.2))",
  backgroundColor: "var(--sc-input-bg, rgba(230, 237, 243, 0.05))",
  transition: "all 150ms ease",
  cursor: "pointer",
  ":hover": {
    borderColor: "var(--sc-input-border-color-hover, rgba(230, 237, 243, 0.35))",
  },
  ":focus-within": {
    borderColor: "var(--sc-input-border-color-focus, var(--md-sys-color-primary, #22c9a6))",
    backgroundColor: "var(--sc-input-bg-focus, rgba(230, 237, 243, 0.08))",
    boxShadow: "0 0 0 4px color-mix(in srgb, var(--md-sys-color-primary, #22c9a6) 20%, transparent)",
  },
  selectors: {
    "&[data-disabled='true']": {
      cursor: "not-allowed",
      opacity: 0.5,
      pointerEvents: "none",
    },
  },
});

export const selectElement = style({
  flex: 1,
  height: "100%",
  minWidth: 0,
  padding: "0 40px 0 16px",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "var(--sc-input-text-color, #e6edf3)",
  fontSize: "16px",
  lineHeight: "1.5",
  cursor: "pointer",
  appearance: "none",
  ":disabled": {
    cursor: "not-allowed",
  },
  "::placeholder": {
    color: "var(--sc-input-placeholder-color, rgba(230, 237, 243, 0.5))",
  },
  selectors: {
    "&::-ms-expand": {
      display: "none",
    },
  },
});

export const selectIcon = style({
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  color: "var(--sc-input-text-color, #e6edf3)",
  transition: "transform 150ms ease",
  selectors: {
    "[data-disabled='true'] &": {
      opacity: 0.5,
    },
  },
});
