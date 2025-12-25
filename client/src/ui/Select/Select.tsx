import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import * as styles from "./select.css";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  className?: string;
};

export function Select({
  value,
  onChange,
  placeholder = "",
  options,
  disabled = false,
  fullWidth = false,
  ariaLabel,
  className,
}: SelectProps) {
  return (
    <div
      className={`${styles.selectRoot} ${className || ""}`}
      style={fullWidth ? { width: "100%" } : undefined}
      data-disabled={disabled}
    >
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel || placeholder}
        className={styles.selectElement}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className={styles.selectIcon}>
        <KeyboardArrowDownRoundedIcon fontSize="small" />
      </div>
    </div>
  );
}
