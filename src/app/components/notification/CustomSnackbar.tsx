import { Alert, AlertProps, Snackbar, SnackbarCloseReason, SnackbarProps } from '@mui/material';
import React from 'react';

export interface SnackbarOptions {
  snackbarProps?: SnackbarProps;
  closeReason?: SnackbarCloseReason;
  alertProps?: AlertProps;
  content?: React.ReactNode;
  allowClose?: boolean;
}

export interface CustomSnackbarProps {
  open: boolean;
  options: SnackbarOptions;
  onClose: SnackbarProps['onClose'];
}

const CustomSnackbar = ({ open, options, onClose }: CustomSnackbarProps) => {
  const { snackbarProps, alertProps, content, allowClose, closeReason } = options;

  return (
    <Snackbar open={open} onClose={allowClose ? onClose : null} {...snackbarProps}>
      <Alert onClose={allowClose ? e => onClose(e, closeReason) : null} {...alertProps}>
        {content}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
