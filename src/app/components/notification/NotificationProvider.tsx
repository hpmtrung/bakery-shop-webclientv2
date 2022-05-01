import { AlertProps } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import ConfirmDialog, { ConfirmOptions } from './ConfirmDialog';
import CustomSnackbar, { SnackbarOptions } from './CustomSnackbar';
import NotificationContext from './NotificationContext';

const CONFIRM_DEFAULT_OPTIONS: ConfirmOptions = {
  title: 'Are you sure?',
  description: '',
  content: null,
  confirmationText: 'Ok',
  cancellationText: 'Cancel',
  dialogProps: {},
  confirmationButtonProps: {},
  cancellationButtonProps: {},
  titleProps: {},
  contentProps: {},
  allowClose: true,
};

const SNACKBAR_DEFAULT_OPTIONS: SnackbarOptions = {
  closeReason: 'clickaway',
  snackbarProps: {
    anchorOrigin: { vertical: 'top', horizontal: 'center' },
    autoHideDuration: 6000,
    sx: { mt: 5 },
  },
  alertProps: {
    severity: 'info',
    sx: { width: '100%' },
  },
  content: 'Thông báo',
  allowClose: true,
};

const buildConfirmOptions = (defaultOptions: ConfirmOptions, options: ConfirmOptions) => {
  const dialogProps = {
    ...(defaultOptions.dialogProps || CONFIRM_DEFAULT_OPTIONS.dialogProps),
    ...(options.dialogProps || {}),
  };
  const confirmationButtonProps = {
    ...(defaultOptions.confirmationButtonProps || CONFIRM_DEFAULT_OPTIONS.confirmationButtonProps),
    ...(options.confirmationButtonProps || {}),
  };
  const cancellationButtonProps = {
    ...(defaultOptions.cancellationButtonProps || CONFIRM_DEFAULT_OPTIONS.cancellationButtonProps),
    ...(options.cancellationButtonProps || {}),
  };
  const titleProps = {
    ...(defaultOptions.titleProps || CONFIRM_DEFAULT_OPTIONS.titleProps),
    ...(options.titleProps || {}),
  };
  const contentProps = {
    ...(defaultOptions.contentProps || CONFIRM_DEFAULT_OPTIONS.contentProps),
    ...(options.contentProps || {}),
  };

  return {
    ...CONFIRM_DEFAULT_OPTIONS,
    ...defaultOptions,
    ...options,
    dialogProps,
    confirmationButtonProps,
    cancellationButtonProps,
    titleProps,
    contentProps,
  };
};

export interface NotificationProviderProps {
  children: React.ReactNode | React.ReactNode[];
  defaultOptions?: {
    confirmOptions?: ConfirmOptions;
    snackbarOptions?: SnackbarOptions;
  };
}

const NotificationProvider = ({ children, defaultOptions = { confirmOptions: {}, snackbarOptions: {} } }: NotificationProviderProps) => {
  const [confirmOptions, setConfirmOptions] = useState({ ...CONFIRM_DEFAULT_OPTIONS, ...defaultOptions.confirmOptions });
  const [snackbarOptions, setSnackbarOptions] = useState({ ...SNACKBAR_DEFAULT_OPTIONS, ...defaultOptions.snackbarOptions });

  const [resolveReject, setResolveReject] = useState([]);
  const [resolve, reject] = resolveReject;

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const confirm = useCallback(
    (options = {}) => {
      return new Promise((_resolve, _reject) => {
        setConfirmOptions(buildConfirmOptions(defaultOptions.confirmOptions, options));
        setResolveReject([_resolve, _reject]);
      });
    },
    [defaultOptions.confirmOptions]
  );

  const snackbarCreator = useCallback(
    (severity: AlertProps['severity']) =>
      (options: SnackbarOptions = {}) => {
        setSnackbarOptions({
          ...SNACKBAR_DEFAULT_OPTIONS,
          ...defaultOptions.snackbarOptions,
          ...options,
          alertProps: { ...options.alertProps, severity },
        });
        setOpenSnackbar(true);
      },
    [defaultOptions.snackbarOptions]
  );

  const snackbar = useMemo(
    () => ({
      success: snackbarCreator('success'),
      info: snackbarCreator('info'),
      warning: snackbarCreator('warning'),
      error: snackbarCreator('error'),
    }),
    [snackbarCreator]
  );

  const handleCloseConfirm = useCallback(() => {
    setResolveReject([]);
  }, []);

  const handleCancelConfirm = useCallback(() => {
    if (reject) {
      reject();
      handleCloseConfirm();
    }
  }, [reject, handleCloseConfirm]);

  const handleConfirm = useCallback(() => {
    if (resolve) {
      resolve();
      handleCloseConfirm();
    }
  }, [resolve, handleCloseConfirm]);

  const handleCloseSnackbar = useCallback(() => {
    setOpenSnackbar(false);
  }, []);

  return (
    <>
      <NotificationContext.Provider value={{ confirm, snackbar }}>{children}</NotificationContext.Provider>
      <ConfirmDialog
        open={resolveReject.length === 2}
        options={confirmOptions}
        onClose={handleCloseConfirm}
        onCancel={handleCancelConfirm}
        onConfirm={handleConfirm}
      />
      <CustomSnackbar open={openSnackbar} options={snackbarOptions} onClose={handleCloseSnackbar} />
    </>
  );
};

export default NotificationProvider;
