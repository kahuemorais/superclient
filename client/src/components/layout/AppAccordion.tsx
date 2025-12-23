import type { PropsWithChildren, ReactNode } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import type { AccordionProps } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import type { SxProps, Theme } from "@mui/material/styles";

type AppAccordionProps = PropsWithChildren<
  (
    | {
        title: ReactNode;
        subtitle?: ReactNode;
        summary?: never;
      }
    | {
        summary: ReactNode;
        title?: never;
        subtitle?: never;
      }
  ) & {
    sx?: SxProps<Theme>;
  }
> &
  Omit<AccordionProps, "children" | "sx">;

export default function AppAccordion({
  title,
  subtitle,
  summary,
  sx,
  children,
  ...props
}: AppAccordionProps) {
  return (
    <Accordion
      {...props}
      sx={[
        {
          overflow: "hidden",
          "& .MuiAccordionSummary-root": {
            px: { xs: 2, md: 3 },
            py: 0.5,
            transition: (theme: Theme) =>
              theme.transitions.create(["background-color"]),
            "&:hover": {
              backgroundColor: "action.hover",
            },
          },
          "& .MuiAccordionDetails-root": {
            px: { xs: 2, md: 3 },
            pb: { xs: 2, md: 3 },
            pt: 0,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ].filter(Boolean)}
    >
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
        {summary ? (
          summary
        ) : (
          <Stack spacing={subtitle ? 0.25 : 0}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {subtitle}
              </Typography>
            ) : null}
          </Stack>
        )}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
