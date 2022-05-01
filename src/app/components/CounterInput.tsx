import { Button, Stack, TextField, TextFieldProps } from '@mui/material';
import React from 'react';

// export interface CounterInputProps extends TextFieldProps {

// }

const CounterInput = ({ onChange, value }: TextFieldProps) => {
  const [number, setNumber] = React.useState<number>(parseInt(value as string, 10));

  const handleDecrease = () => {
    setNumber(number - 1);
  };

  const handleIncrease = () => {
    setNumber(number + 1);
  };

  return (
    <Stack direction="row">
      <Button variant="outlined" size="small" onClick={handleIncrease}>
        +
      </Button>
      <TextField
        id="standard-number"
        label="Number"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        size="small"
        variant="outlined"
        value={number}
        onChange={onChange}
      />
      <Button variant="outlined" size="small" onClick={handleDecrease}>
        -
      </Button>
    </Stack>
  );
};

export default CounterInput;
