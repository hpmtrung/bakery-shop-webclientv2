import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FilledInput,
  FormControl,
  FormControlProps,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputBaseProps,
  InputLabel,
  OutlinedInput,
  SxProps,
  TextField,
} from '@mui/material';
import React from 'react';
import { Controller, ControllerFieldState, ControllerRenderProps, FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';

const EMAIL_REGEXP =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

// https://react-hook-form.com/advanced-usage/#FormProviderPerformance
// we can use React.memo to prevent re-render except isDirty state changed
// const NestedInput = React.memo(
//   ({ register, formState: { isDirty } }) => (
//     <div>
//       <input {...register("test")} />
//       {isDirty && <p>This field is dirty</p>}
//     </div>
//   ),
//   (prevProps, nextProps) =>
//     prevProps.formState.isDirty === nextProps.formState.isDirty
// );

export interface InputProps {
  type: 'text' | 'textarea' | 'email' | 'number' | 'password';
  name: string;
  label: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  variant?: FormControlProps['variant'];
  size?: FormControlProps['size'];
  sx?: SxProps;
  maxRows?: InputBaseProps['maxRows'];
  rows?: InputBaseProps['rows'];
  rules?: RegisterOptions;
}

type VariantInputType = typeof Input | typeof OutlinedInput | typeof FilledInput;

const InputPassword = React.forwardRef(({ VariantInput, ...other }: { VariantInput: VariantInputType }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <VariantInput
      type={showPassword ? 'text' : 'password'}
      endAdornment={
        <InputAdornment position="end">
          <IconButton onClick={toggleVisibility} edge="end">
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      {...other}
    />
  );
});

export const ValidatedInput = ({
  type,
  name,
  label,
  variant = 'outlined',
  rules,
  size = 'small',
  placeholder,
  readOnly = false,
  disabled = false,
  fullWidth = true,
  autoFocus = false,
  maxRows,
  rows,
  sx,
}: InputProps) => {
  const { control } = useFormContext();
  const required = rules?.required ? true : false;
  const id = 'id-' + name;
  let inputProps: any = {
    id,
    label,
    placeholder,
    disabled,
    readOnly,
    autoFocus,
  };

  let VariantInput: VariantInputType = null;
  if (variant === 'standard') {
    VariantInput = Input;
  } else if (variant === 'outlined') {
    VariantInput = OutlinedInput;
  } else if (variant === 'filled') {
    VariantInput = FilledInput;
  }
  if (type === 'email') {
    rules = { ...rules, pattern: { value: EMAIL_REGEXP, message: 'Email is in incorrect format!' } };
  }

  if (type === 'textarea') {
    inputProps = { ...inputProps, multiline: true, maxRows, rows };
  } else if (type === 'number') {
    inputProps = { ...inputProps, type: 'number' };
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { invalid, error } }) => (
        <FormControl variant={variant} error={invalid} disabled={disabled} required={required} fullWidth={fullWidth} size={size} sx={sx}>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          {type === 'password' ? (
            <InputPassword VariantInput={VariantInput} {...inputProps} {...field} />
          ) : (
            <VariantInput {...inputProps} {...field} />
          )}
          <FormHelperText>{error?.message || ' '}</FormHelperText>
        </FormControl>
      )}
      rules={rules}
    />
  );
};
