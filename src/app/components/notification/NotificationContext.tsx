import React from 'react';
import { ConfirmOptions } from './ConfirmDialog';
import { SnackbarOptions } from './CustomSnackbar';

const NotificationContext = React.createContext<{
  confirm: (options?: ConfirmOptions) => Promise<any>;
  snackbar: {
    success: (options?: SnackbarOptions) => void;
    info: (options?: SnackbarOptions) => void;
    warning: (options?: SnackbarOptions) => void;
    error: (options?: SnackbarOptions) => void;
  };
}>(null);

export default NotificationContext;
