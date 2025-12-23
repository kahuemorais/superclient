import { createTheme } from "@mui/material/styles";

import { APP_RADIUS_PX } from "./designTokens";

const theme = createTheme({
  shape: {
    borderRadius: APP_RADIUS_PX,
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#22c9a6",
    },
    secondary: {
      main: "#f59e0b",
    },
    background: {
      default: "#0b0f14",
      paper: "#0f1720",
    },
    text: {
      primary: "#e6edf3",
      secondary: "rgba(230, 237, 243, 0.68)",
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          [theme.breakpoints.down("sm")]: {
            margin: theme.spacing(2),
            width: `calc(100% - ${theme.spacing(4)})`,
            maxWidth: `calc(100% - ${theme.spacing(4)})`,
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          fontWeight: 600,
          borderRadius: theme.shape.borderRadius,
          paddingInline: theme.spacing(2.5),
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
        }),
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: "none",
          borderRadius: theme.shape.borderRadius,
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: () => ({
          minHeight: 56,
          backgroundColor: "transparent",
          "&.Mui-expanded": {
            minHeight: 56,
            backgroundColor: "transparent",
          },
        }),
        content: {
          margin: 0,
          "&.Mui-expanded": {
            margin: 0,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
        }),
        notchedOutline: ({ theme }) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
        }),
      },
    },
  },
});

export default theme;
