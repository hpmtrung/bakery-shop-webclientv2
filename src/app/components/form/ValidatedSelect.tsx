import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps, SxProps } from '@mui/material';
import React from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

export interface CustomSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  checked?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  variant?: SelectProps['variant'];
  size?: SelectProps['size'];
  sx?: SxProps;
  options: { key: string | number; value: string }[];
  rules?: RegisterOptions;
}

export const ValidatedSelect = ({
  name,
  label,
  placeholder,
  readOnly = false,
  disabled = false,
  fullWidth = true,
  autoFocus = false,
  variant = 'outlined',
  size = 'small',
  sx,
  options,
  rules,
}: CustomSelectProps) => {
  const { control } = useFormContext();
  const required = rules?.required ? true : false;
  const id = 'id-' + name;
  const props: any = {
    id,
    label,
    placeholder,
    autoFocus,
  };

  // Select input props
  const inputProps = {
    readOnly,
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { invalid, error } }) => (
        <FormControl variant={variant} error={invalid} disabled={disabled} required={required} fullWidth={fullWidth} size={size} sx={sx}>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Select labelId={id} label={label} inputProps={inputProps} {...props} {...field}>
            {options.map(option => (
              <MenuItem key={option.key} value={option.key}>
                {option.value}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{error?.message || ' '}</FormHelperText>
        </FormControl>
      )}
    />
  );
};
