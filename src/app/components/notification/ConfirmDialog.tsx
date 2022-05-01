import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogProps } from '@mui/material/Dialog';
import { DialogTitleProps } from '@mui/material/DialogTitle';
import { DialogContentProps } from '@mui/material/DialogContent';
import { ButtonProps } from '@mui/material/Button';

export interface ConfirmOptions {
  title?: React.ReactNode;
  titleProps?: DialogTitleProps;
  description?: React.ReactNode;
  content?: React.ReactNode | null;
  contentProps?: DialogContentProps;
  confirmationText?: React.ReactNode;
  cancellationText?: React.ReactNode;
  dialogProps?: Omit<DialogProps, 'open'>;
  confirmationButtonProps?: ButtonProps;
  cancellationButtonProps?: ButtonProps;
  allowClose?: boolean;
}

export interface ConfirmDialogProps {
  open: boolean;
  options: ConfirmOptions;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => any;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => any;
  onClose: DialogProps['onClose'];
}

const ConfirmDialog = ({ open, options, onCancel, onConfirm, onClose }: ConfirmDialogProps) => {
  const {
    title,
    description,
    content,
    confirmationText,
    cancellationText,
    dialogProps,
    confirmationButtonProps,
    cancellationButtonProps,
    titleProps,
    contentProps,
    allowClose,
  } = options;

  return (
    <Dialog fullWidth {...dialogProps} open={open} onClose={allowClose ? onClose : null}>
      {title && <DialogTitle {...titleProps}>{title}</DialogTitle>}
      {content ? (
        <DialogContent {...contentProps}>{content}</DialogContent>
      ) : (
        description && (
          <DialogContent {...contentProps}>
            <DialogContentText>{description}</DialogContentText>
          </DialogContent>
        )
      )}
      <DialogActions>
        <Button {...cancellationButtonProps} onClick={onCancel}>
          {cancellationText}
        </Button>
        <Button color="primary" {...confirmationButtonProps} onClick={onConfirm}>
          {confirmationText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
