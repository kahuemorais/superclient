import { IconButton, InputAdornment } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TextField } from "../TextField";

export type SearchFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  fullWidth?: boolean;
  onClear?: () => void;
  endIcon?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
};

export function SearchField({
  value,
  onChange,
  placeholder,
  fullWidth = false,
  onClear,
  endIcon,
  ariaLabel,
  className,
}: SearchFieldProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && onClear) {
      event.preventDefault();
      onClear();
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  const showClearButton = value.length > 0;

  const clearButtonAdornment = showClearButton ? (
    endIcon || (
      <InputAdornment position="end">
        <IconButton
          size="small"
          onClick={handleClear}
          aria-label="Limpar busca"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </InputAdornment>
    )
  ) : (
    <span style={{ width: 48, height: 24 }} aria-hidden="true" />
  );

  return (
    <TextField
      label={placeholder || "Buscar"}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      fullWidth={fullWidth}
      endIcon={clearButtonAdornment}
      aria-label={ariaLabel || placeholder}
      className={className}
    />
  );
}
