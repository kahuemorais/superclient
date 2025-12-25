import { type InputHTMLAttributes, type ReactNode, useId } from 'react';
import {
  textFieldContainer,
  textFieldContainerInline,
  label as labelClass,
  labelRequired,
  inputWrapper,
  inputWrapperError,
  inputWrapperDisabled,
  input,
  icon,
  helperText as helperTextClass,
  errorText as errorTextClass,
} from './textField.css';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
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
  id: providedId,
  ...inputProps
}: TextFieldProps) {
  const autoId = useId();
  const id = providedId || autoId;
  const hasError = Boolean(errorText);
  
  const wrapperClasses = [
    inputWrapper,
    hasError && inputWrapperError,
    disabled && inputWrapperDisabled,
  ].filter(Boolean).join(' ');
  
  const containerClasses = [
    textFieldContainer,
    !fullWidth && textFieldContainerInline,
  ].filter(Boolean).join(' ');
  
  const labelClasses = [
    labelClass,
    required && labelRequired,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      <div className={wrapperClasses}>
        {startIcon && <span className={icon}>{startIcon}</span>}
        <input
          id={id}
          className={input}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={errorText ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...inputProps}
        />
        {endIcon && <span className={icon}>{endIcon}</span>}
      </div>
      {errorText && (
        <p id={`${id}-error`} className={errorTextClass} role="alert">
          {errorText}
        </p>
      )}
      {!errorText && helperText && (
        <p id={`${id}-helper`} className={helperTextClass}>
          {helperText}
        </p>
      )}
    </div>
  );
}
