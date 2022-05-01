import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogProps, DialogTitle, IconButton, styled } from '@mui/material';
import Translate from 'src/app/shared/language/Translate';
import * as React from 'react';

export const StyledBootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface BootstrapDialogTitleProps {
  children?: React.ReactNode;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

export const BootstrapDialogTitle = (props: BootstrapDialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export interface CustomDialogProps extends DialogProps {
  titleContent: string;
  titleKey?: string;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}

export const BootstrapDialog = ({ maxWidth, children, open, onClose, titleKey, titleContent, ...other }: CustomDialogProps) => (
  <StyledBootstrapDialog maxWidth={maxWidth} open={open} onClose={onClose} {...other}>
    <BootstrapDialogTitle onClose={onClose}>
      {titleKey ? <Translate contentKey={titleKey}>{titleContent}</Translate> : titleContent}
    </BootstrapDialogTitle>
    <DialogContent dividers>{children}</DialogContent>
  </StyledBootstrapDialog>
);
