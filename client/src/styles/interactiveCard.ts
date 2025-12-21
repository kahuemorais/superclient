import type { Theme } from "@mui/material/styles";

export const interactiveCardSx = (theme: Theme) => ({
  transition: theme.transitions.create(
    ["background-color", "border-color", "box-shadow", "transform"],
    { duration: theme.transitions.duration.short }
  ),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.divider,
    boxShadow: theme.shadows[3],
  },
  "&:active": {
    backgroundColor: theme.palette.action.selected,
    borderColor: theme.palette.divider,
    boxShadow: theme.shadows[1],
    transform: "translateY(1px)",
  },
});
