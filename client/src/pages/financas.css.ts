import { style } from "@vanilla-extract/css";

export const filtersRow = style({
  display: "flex",
  gap: "16px",
  alignItems: "center",
  width: "100%",
  minWidth: 0,
  "@media": {
    "(max-width: 959px)": {
      flexWrap: "wrap",
    },
    "(min-width: 960px)": {
      flexWrap: "nowrap",
    },
  },
});

export const searchWrap = style({
  flex: "1 1 420px",
  minWidth: "240px",
  boxSizing: "border-box",
  "@media": {
    "(min-width: 960px)": {
      maxWidth: "520px",
    },
  },
});

export const filterWrap = style({
  flex: "1 1 320px",
  minWidth: "240px",
  overflow: "hidden",
  boxSizing: "border-box",
  "@media": {
    "(min-width: 960px)": {
      maxWidth: "420px",
    },
  },
});

export const searchFill = style({
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
});

export const filterFill = style({
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
});
