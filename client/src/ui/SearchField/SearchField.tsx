import { IconButton, InputAdornment, TextField } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export type SearchFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  fullWidth?: boolean;
  onClear?: () => void;
  ariaLabel?: string;
};

export function SearchField({
  value,
  onChange,
  placeholder = "Buscar",
  fullWidth = false,
  onClear,
  ariaLabel,
}: SearchFieldProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && onClear) {
      event.preventDefault();
      onClear();
    }
  };

  return (
    <TextField
      label={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      fullWidth={fullWidth}
      type="text"
      size="medium"
      aria-label={ariaLabel || placeholder}
      InputProps={{
        endAdornment:
          onClear && value ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="Limpar busca"
                size="small"
                onClick={event => {
                  (event.currentTarget as HTMLElement).blur();
                  onClear();
                }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
    />
  );
}