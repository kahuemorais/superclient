import type { ReactNode } from "react";
import { Box, Breadcrumbs } from "@mui/material";
import { usePageActionsContext } from "../contexts/PageActionsContext";

export default function AppBreadcrumbRow({
  breadcrumbItems,
}: {
  breadcrumbItems: ReactNode;
}) {
  const { actions } = usePageActionsContext();

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        width: "100%",
        display: { xs: "block", md: "flex" },
        alignItems: { md: "center" },
        justifyContent: { md: "space-between" },
        gap: { md: 2 },
        mb: 1,
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        separator="›"
        sx={{
          color: "text.secondary",
          display: "flex",
          width: { xs: "100%", md: "auto" },
          flex: { md: "1 1 auto" },
          minWidth: 0,
          justifyContent: "flex-start",
          alignItems: "center",
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
          "& .MuiBreadcrumbs-ol": {
            flexWrap: "nowrap",
            alignItems: "center",
            minWidth: 0,
          },
          "& .MuiBreadcrumbs-li": {
            display: "inline-flex",
            minWidth: 0,
          },
          "& .MuiBreadcrumbs-separator": {
            mx: 1,
            color: "text.secondary",
          },
        }}
      >
        {breadcrumbItems}
      </Breadcrumbs>

      {actions ? (
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "flex-end",
            flexWrap: "nowrap",
            minWidth: 0,
            flex: "0 0 auto",
          }}
        >
          {actions}
        </Box>
      ) : null}
    </Box>
  );
}
