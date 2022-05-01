import { BootstrapDialog } from 'src/app/components/BootstrapDialog';
import SwipeablePanel from 'src/app/components/SwipeablePanel';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { setShowModalLogin } from './authentication.reducer';
import LoginForm from './LoginForm';
import PasswordResetForm from './PasswordResetForm';
import SignUpForm from './SignUpForm';

export interface ILoginModalProps {
  showModal: boolean;
  handleClose: () => void;
}

type DialogTitleType = {
  titleContent: string;
  titleKey?: string;
};

const DIALOG_TITLES: ReadonlyArray<DialogTitleType> = [
  { titleKey: 'reset.request.title', titleContent: 'Reset your password' },
  { titleKey: undefined, titleContent: 'Login' },
  { titleKey: undefined, titleContent: 'Sign up' },
];

const LoginModal = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector(state => state.authentication.showModalLogin);

  const [panelIndex, setPanelIndex] = React.useState(1);
  const [dialogTitle, setDialogTitle] = React.useState(DIALOG_TITLES[panelIndex]);

  const handleClose = React.useCallback(() => {
    dispatch(setShowModalLogin(false));
  }, [dispatch]);

  const onPanelChange = (selectedPanelIndex: number) => {
    setPanelIndex(selectedPanelIndex);
    setDialogTitle(DIALOG_TITLES[selectedPanelIndex]);
  };

  const maxWidth = panelIndex === 2 ? 700 : 500;

  return (
    <BootstrapDialog
      open={open}
      onClose={handleClose}
      sx={{ maxWidth, mx: 'auto' }}
      titleKey={dialogTitle.titleKey}
      titleContent={dialogTitle.titleContent}
    >
      <SwipeableViews axis={'x'} index={panelIndex}>
        <SwipeablePanel value={panelIndex} index={0}>
          <PasswordResetForm onToLogin={() => onPanelChange(1)} />
        </SwipeablePanel>
        <SwipeablePanel value={panelIndex} index={1}>
          <LoginForm onToResetPassword={() => onPanelChange(0)} onToSignUp={() => onPanelChange(2)} />
        </SwipeablePanel>
        <SwipeablePanel value={panelIndex} index={2}>
          <SignUpForm onToLogin={() => onPanelChange(1)} />
        </SwipeablePanel>
      </SwipeableViews>
    </BootstrapDialog>
  );
};

export default LoginModal;
