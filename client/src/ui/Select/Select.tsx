import { FormControl, InputLabel, MenuItem, Select as MuiSelect } from "@mui/material";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  placeholder?: string;
  label?: string;
  options: SelectOption[];
  disabled?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  size?: 'small' | 'medium';
};

export function Select({
  value,
  onChange,
  placeholder = "",
  label,
  options,
  disabled = false,
  fullWidth = false,
  ariaLabel,
  size = 'small',
}: SelectProps) {
  const displayLabel = label || placeholder;
  
  return (
    <FormControl fullWidth={fullWidth} disabled={disabled} size={size}>
      {displayLabel && <InputLabel>{displayLabel}</InputLabel>}
      <MuiSelect
        value={value}
        onChange={(e) => onChange({ target: { value: e.target.value as string } })}
        label={displayLabel}
        aria-label={ariaLabel || displayLabel}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
