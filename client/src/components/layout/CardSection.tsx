import type { ComponentProps, PropsWithChildren } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import AppCard from "./AppCard";

type CardSectionSize = "compact" | "xs" | "sm" | "md" | "lg" | "flush";

type CardSectionProps = PropsWithChildren<{
  size?: CardSectionSize;
  sx?: SxProps<Theme>;
}> &
  Omit<ComponentProps<typeof AppCard>, "children" | "sx">;

const paddingBySize: Record<CardSectionSize, SxProps<Theme>> = {
  compact: { p: 1.5 },
  xs: { p: 2 },
  sm: { p: { xs: 2, md: 2.5 } },
  md: { p: { xs: 2, md: 3 } },
  lg: { p: { xs: 3, md: 4 } },
  flush: { p: 0 },
};

export default function CardSection({
  size = "md",
  sx,
  children,
  ...props
}: CardSectionProps) {
  return (
    <AppCard
      {...props}
      sx={[paddingBySize[size], ...(Array.isArray(sx) ? sx : [sx])].filter(
        Boolean
      )}
    >
      {children}
    </AppCard>
  );
}
