import type { ComponentProps } from "react";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";

type ToggleCheckboxProps = ComponentProps<typeof Checkbox>;

export default function ToggleCheckbox(props: ToggleCheckboxProps) {
  return (
    <Checkbox
      size="small"
      icon={<CheckBoxOutlineBlankRoundedIcon fontSize="small" />}
      checkedIcon={<CheckBoxRoundedIcon fontSize="small" />}
      {...props}
    />
  );
}
