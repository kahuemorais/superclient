import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

import {
  CATEGORY_COLOR_OPTIONS,
  resolveThemeColor,
} from "@/lib/resolveThemeColor";
import { getInteractiveItemRadiusPx } from "@/styles/interactiveCard";

type CategoryColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  colors?: readonly string[];
  size?: number;
  sx?: SxProps<Theme>;
};

export function CategoryColorPicker({
  value,
  onChange,
  colors = CATEGORY_COLOR_OPTIONS,
  size = 28,
  sx,
}: CategoryColorPickerProps) {
  return (
    <Box
      sx={[
        {
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ].filter(Boolean)}
    >
      {colors.map(color => {
        const isSelected = value === color;
        return (
          <Box
            key={color}
            role="button"
            aria-pressed={isSelected}
            tabIndex={0}
            onClick={() => onChange(color)}
            onKeyDown={event => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onChange(color);
              }
            }}
            sx={theme => ({
              width: size,
              height: size,
              backgroundColor: resolveThemeColor(theme, color),
              borderRadius: getInteractiveItemRadiusPx(theme),
              border: "1px solid",
              borderColor: isSelected ? "primary.main" : "divider",
              outline: isSelected
                ? `2px solid ${theme.palette.primary.main}`
                : "none",
              outlineOffset: 1,
              cursor: "pointer",
              boxSizing: "border-box",
            })}
          />
        );
      })}
    </Box>
  );
}

CategoryColorPicker.displayName = "CategoryColorPicker";
