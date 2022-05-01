// More: https://codesandbox.io/s/react-hook-form-material-ui-select-multiple-vcgry?file=/src/App.js:2395-2675
import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { CustomSelectProps } from './ValidatedSelect';

const MenuProps = {
  variant: 'menu',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  getContentAnchorEl: null,
};

export const ValidatedMultiSelect = ({
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
  const [isOpen, setOpen] = React.useState(false);

  const required = rules?.required ? true : false;
  const id = 'id-' + name;
  const props: any = {
    id,
    label,
    placeholder,
    autoFocus,
    multiple: true,
  };

  // Select input props
  const inputProps = {
    readOnly,
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onBlur, ...other }, fieldState: { invalid, error } }) => (
        <FormControl variant={variant} error={invalid} disabled={disabled} required={required} fullWidth={fullWidth} size={size} sx={sx}>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Select
            labelId={id}
            label={label}
            value={value}
            inputProps={inputProps}
            {...props}
            {...other}
            onClose={() => {
              onBlur();
              setOpen(false);
            }}
            open={isOpen}
            onOpen={() => setOpen(true)}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {options.map(option => (
              <MenuItem key={option.key} value={option.key}>
                <Checkbox checked={value.indexOf(option) >= 0} />
                <ListItemText primary={option.value} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{error?.message || ' '}</FormHelperText>
        </FormControl>
      )}
    />
  );
};
