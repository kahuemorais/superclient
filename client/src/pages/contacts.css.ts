import { style } from "@vanilla-extract/css";

export const filtersRow = style({
  display: "grid",
  gap: "var(--md-sys-spacing-16, 16px)",
  alignItems: "stretch",
  width: "100%",
  "@media": {
    "(max-width: 959px)": {
      gridTemplateColumns: "1fr",
    },
    "(min-width: 960px)": {
      gridTemplateColumns: "minmax(320px, 520px) minmax(240px, 420px)",
    },
  },
});

export const searchWrap = style({
  minWidth: 0,
  selectors: {
    "& > *": {
      width: "100%",
      minWidth: 0,
    },
  },
});

export const searchFieldStable = style({
  selectors: {
    "& input": {
      paddingRight: "48px",
    },
  },
});

export const categoryWrap = style({
  minWidth: 0,
  selectors: {
    "& > *": {
      width: "100%",
      minWidth: 0,
    },
  },
});
