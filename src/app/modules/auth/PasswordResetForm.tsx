import { LoadingButton } from '@mui/lab';
import { Alert, Grid, Link, Typography } from '@mui/material';
import { ValidatedForm } from 'src/app/components/form/ValidatedForm';
import { ValidatedInput } from 'src/app/components/form/ValidatedInput';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import Translate, { translate } from 'src/app/shared/language/Translate';
import React from 'react';
import { handlePasswordResetInit, reset } from './password-reset.reducer';
import { defaultAccountPasswordReset, IAccountPasswordReset } from './model/password-reset.model';

const PasswordResetAlert = () => {
  const { message, resetPasswordInitSuccess } = useAppSelector(state => state.passwordReset);
  let shownMessage;
  if (resetPasswordInitSuccess) {
    shownMessage = 'Kiểm tra email của bạn và làm theo hướng dẫn để đặt lại mật khẩu thành công';
  } else {
    shownMessage = 'Không thể đặt lại mật khẩu vì email không tồn tại';
  }
  return (
    message && (
      <Alert severity={resetPasswordInitSuccess ? 'success' : 'error'} sx={{ width: '100%' }}>
        {shownMessage}
      </Alert>
    )
  );
};

const PasswordResetForm = ({ onToLogin }) => {
  const dispatch = useAppDispatch();
  const { loading: resetPasswordLoading } = useAppSelector(state => state.passwordReset);

  React.useEffect(
    () => () => {
      dispatch(reset());
    },
    [dispatch]
  );

  const handlePasswordReset = ({ email }: IAccountPasswordReset) => {
    dispatch(handlePasswordResetInit(email));
  };

  return (
    <ValidatedForm onSubmit={handlePasswordReset} defaultValues={defaultAccountPasswordReset}>
      <Grid container spacing={1.5} p={1}>
        <Grid item xs={12}>
          <Typography variant="body2">
            <Translate contentKey="reset.request.messages.info">Enter the email address you used to register</Translate>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ValidatedInput
            name="email"
            type="email"
            label={translate('global.form.email.label')}
            rules={{ required: 'Email cannot be empty!' }}
            fullWidth
            autoFocus
            size="medium"
          />
        </Grid>
        <Grid item xs={12}>
          <PasswordResetAlert />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            type="submit"
            loading={resetPasswordLoading}
            loadingIndicator="Just a moment..."
            variant="contained"
            fullWidth
            sx={{ mt: 0.5 }}
          >
            <Translate contentKey="reset.request.form.button">Reset password</Translate>
          </LoadingButton>
        </Grid>
        <Grid item xs={12} textAlign="right">
          <Link component="button" type="button" variant="body2" onClick={onToLogin}>
            Quay về đăng nhập
          </Link>
        </Grid>
      </Grid>
    </ValidatedForm>
  );
};

export default PasswordResetForm;
