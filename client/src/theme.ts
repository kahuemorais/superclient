import { createTheme } from "@mui/material/styles";

const theme = createTheme({
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
});

export default theme;
