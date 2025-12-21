import { alpha, type Theme } from "@mui/material/styles";

export const interactiveCardSx = (theme: Theme) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(
    ["background-color", "border-color"],
    { duration: theme.transitions.duration.short }
  ),
  "&:hover": {
    backgroundColor: alpha(theme.palette.text.primary, 0.08),
  },
  "&:active": {
    backgroundColor: alpha(theme.palette.text.primary, 0.12),
  },
});
