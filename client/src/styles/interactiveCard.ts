import { alpha, type Theme } from "@mui/material/styles";

// Standard interactive card with hover effects
export const interactiveCardSx = (theme: Theme) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["background-color", "border-color"], {
    duration: theme.transitions.duration.short,
  }),
  "&:hover": {
    backgroundColor: alpha(theme.palette.text.primary, 0.08),
  },
  "&:active": {
    backgroundColor: alpha(theme.palette.text.primary, 0.12),
  },
});

// Alias for backwards compatibility - same as interactiveCardSx
export const interactiveItemSx = interactiveCardSx;

// Static card: no hover effects
export const staticCardSx = (theme: Theme) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
});

// Alias for backwards compatibility - same as staticCardSx
export const staticItemSx = staticCardSx;

// Interactive card with hover (alias for interactiveCardSx)
export const clickableCardSx = interactiveCardSx;

// Keep this export for any code still using it
export const getInteractiveItemRadiusPx = (_theme: Theme) => {
  return 4; // MUI default
};
