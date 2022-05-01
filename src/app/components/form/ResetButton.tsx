import { Button, ButtonProps } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const ResetButton = ({ children, ...other }: ButtonProps) => {
  const { reset } = useFormContext();
  return (
    <Button onClick={() => reset()} {...other}>
      {children}
    </Button>
  );
};

export default ResetButton;
