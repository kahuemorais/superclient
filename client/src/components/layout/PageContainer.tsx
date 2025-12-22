import type { PropsWithChildren } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type PageContainerProps = PropsWithChildren<{
  sx?: SxProps<Theme>;
}>;

export default function PageContainer({ sx, children }: PageContainerProps) {
  return (
    <Box
      sx={[
        {
          maxWidth: 1200,
          mx: "auto",
          width: "100%",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ].filter(Boolean)}
    >
      {children}
    </Box>
  );
}
