import { Paper } from "@mui/material";
import type { PaperProps } from "@mui/material";

export default function AppCard({ sx, ...props }: PaperProps) {
  return (
    <Paper
      elevation={0}
      {...props}
      sx={[
        {
          border: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ].filter(Boolean)}
    />
  );
}
