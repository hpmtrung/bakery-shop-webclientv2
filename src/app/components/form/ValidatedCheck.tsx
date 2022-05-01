import { Checkbox, CheckboxProps, FormControlLabel, Radio, Switch, SxProps } from '@mui/material';
import React from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

export interface CheckProps {
  type?: 'checkbox' | 'radio' | 'switch';
  name: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  size?: CheckboxProps['size'];
  sx?: SxProps;
  rules?: RegisterOptions;
}

export const ValidatedCheck = ({ type, name, label, rules, disabled = false, readOnly = false, size, sx }: CheckProps) => {
  const { control } = useFormContext();
  const required = rules?.required ? true : false;
  const id = 'id-' + name;
  const props: any = {
    id,
    label,
    size,
  };

  const inputProps = { disabled, readOnly, required };

  let CheckComponent: typeof Checkbox = null;
  if (type === 'checkbox') {
    CheckComponent = Checkbox;
  } else if (type === 'radio') {
    CheckComponent = Radio;
  } else if (type === 'switch') {
    CheckComponent = Switch;
  }
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onBlur, onChange, ...other } }) => (
        <FormControlLabel
          sx={sx}
          disabled={disabled}
          label={label}
          control={
            <CheckComponent
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value to hook form
              checked={value}
              required={required}
              disabled={readOnly}
              inputProps={inputProps}
              {...props}
              {...other}
            />
          }
        />
      )}
    />
  );
};
