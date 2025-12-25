import { IconButton, InputAdornment } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import * as styles from "./searchField.css";

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
  placeholder = "",
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

  return (
    <div
      className={`${styles.searchFieldRoot} ${className || ""}`}
      style={fullWidth ? { width: "100%" } : undefined}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        className={styles.searchFieldInput}
      />
      <div className={styles.searchFieldEndSlot}>
        {showClearButton ? (
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
          <span className={styles.searchFieldEndSlotGhost} aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
