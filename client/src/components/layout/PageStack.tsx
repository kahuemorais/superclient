import type { PropsWithChildren } from "react";
import { Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type PageStackProps = PropsWithChildren<{
  maxWidth?: number;
  spacing?: number;
  sx?: SxProps<Theme>;
}>;

export default function PageStack({
  maxWidth = 900,
  spacing = 3,
  sx,
  children,
}: PageStackProps) {
  return (
    <Stack
      spacing={spacing}
      sx={[
        {
          width: "100%",
          maxWidth,
          mx: "auto",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ].filter(Boolean)}
    >
      {children}
    </Stack>
  );
}
