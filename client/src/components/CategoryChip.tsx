import Chip, { type ChipProps } from "@mui/material/Chip";
import {
  alpha,
  darken,
  getContrastRatio,
  type SxProps,
  type Theme,
} from "@mui/material/styles";

import { resolveThemeColor } from "@/lib/resolveThemeColor";

type MuiPaletteKey =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "grey";

const parseMuiPaletteRef = (
  value: string
): { paletteKey: MuiPaletteKey; shade?: string } | null => {
  if (!value) {
    return null;
  }
  const [paletteKeyRaw, shade] = value.split(".");
  const paletteKey = paletteKeyRaw as MuiPaletteKey;
  if (
    paletteKey === "primary" ||
    paletteKey === "secondary" ||
    paletteKey === "success" ||
    paletteKey === "info" ||
    paletteKey === "warning" ||
    paletteKey === "error" ||
    paletteKey === "grey"
  ) {
    return { paletteKey, shade };
  }
  return null;
};

export type CategoryChipProps = Omit<ChipProps, "sx"> & {
  categoryColor: string;
  maxWidth?: number;
  sx?: SxProps<Theme>;
};

export const CategoryChip = ({
  categoryColor,
  maxWidth,
  sx,
  ...props
}: CategoryChipProps) => {
  const baseSx: SxProps<Theme> = (theme: Theme) => ({
    ...(() => {
      const parsed = parseMuiPaletteRef(categoryColor);
      const token = parsed
        ? parsed.shade
          ? `${parsed.paletteKey}.${parsed.shade}`
          : parsed.paletteKey
        : categoryColor;
      const candidateBg = resolveThemeColor(theme, token);

      // User requirement: chip text should use our "white".
      // In this app, `text.primary` is the intended near-white.
      const foreground = theme.palette.text.primary;

      // Ensure contrast between chip background and the foreground.
      // Target: 4.5:1 (normal text). If the chosen color is too light,
      // progressively darken it until it meets the threshold.
      const minRatio = 4.5;
      let background = candidateBg;
      if (getContrastRatio(foreground, background) < minRatio) {
        // Cap the adjustment to avoid excessive changes.
        for (const amount of [0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56]) {
          const next = darken(candidateBg, amount);
          background = next;
          if (getContrastRatio(foreground, background) >= minRatio) {
            break;
          }
        }
      }
      return {
        color: foreground,
        backgroundColor: background,
        "& .MuiChip-deleteIcon": {
          color: alpha(foreground, 0.85),
          "&:hover": { color: foreground },
        },
      };
    })(),
    ...(maxWidth ? { maxWidth } : null),
    "& .MuiChip-label": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      ...(maxWidth ? { maxWidth: Math.max(0, maxWidth - 20) } : null),
    },
  });

  const mergedSx: SxProps<Theme> = Array.isArray(sx)
    ? [baseSx, ...sx]
    : sx
      ? [baseSx, sx]
      : baseSx;

  return <Chip size="small" {...props} sx={mergedSx} />;
};

CategoryChip.displayName = "CategoryChip";
