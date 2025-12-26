import { Button, Tooltip } from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

type SettingsIconButtonProps = {
  title?: string;
  onClick: () => void;
  size?: "small" | "medium";
  disabled?: boolean;
};

export default function SettingsIconButton({
  title = "Configura\u00e7\u00f5es",
  onClick,
  size = "medium",
  disabled = false,
}: SettingsIconButtonProps) {
  const iconFontSize = "small";
  const minHeight = size === "small" ? 30 : 36;
  return (
    <Tooltip title={title} placement="bottom">
      <span>
        <Button
          onClick={event => {
            (event.currentTarget as HTMLElement).blur();
            onClick();
          }}
          disabled={disabled}
          size={size}
          variant="outlined"
          sx={{
            minWidth: 0,
            px: 1.75,
            minHeight,
          }}
        >
          <SettingsRoundedIcon fontSize={iconFontSize} />
        </Button>
      </span>
    </Tooltip>
  );
}
