import { type ReactNode } from 'react';
import { TextField as MuiTextField, InputAdornment } from '@mui/material';

export interface TextFieldProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  value?: string;
  defaultValue?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function TextField({
  label,
  helperText,
  errorText,
  startIcon,
  endIcon,
  fullWidth = true,
  disabled,
  required,
  id,
  value,
  defaultValue,
  name,
  type,
  placeholder,
  autoComplete,
  autoFocus,
  onChange,
  onFocus,
  onBlur,
}: TextFieldProps) {
  const hasError = Boolean(errorText);
  
  return (
    <MuiTextField
      id={id}
      name={name}
      type={type}
      label={label}
      placeholder={placeholder}
      helperText={errorText || helperText}
      error={hasError}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
      value={value}
      defaultValue={defaultValue}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      slotProps={{
        input: {
          startAdornment: startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : undefined,
          endAdornment: endIcon ? (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
