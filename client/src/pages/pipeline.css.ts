import { style } from "@vanilla-extract/css";

export const filtersRow = style({
  display: "flex",
  gap: "16px",
  alignItems: "center",
  minWidth: 0,
  flexWrap: "wrap",
  "@media": {
    "(min-width: 960px)": {
      flexWrap: "nowrap",
    },
  },
});

export const searchWrap = style({
  flex: "1 1 420px",
  minWidth: "240px",
  "@media": {
    "(min-width: 960px)": {
      maxWidth: "520px",
    },
  },
});

export const filterWrap = style({
  flex: "0 1 280px",
  minWidth: "240px",
  "@media": {
    "(min-width: 960px)": {
      maxWidth: "320px",
    },
  },
});
