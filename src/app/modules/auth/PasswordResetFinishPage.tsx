import { LoadingButton } from '@mui/lab';
import { Alert, Paper, Stack, Typography } from '@mui/material';
import { CustomSection } from 'src/app/components/CustomSection';
import { FormRefObject, ValidatedForm } from 'src/app/components/form/ValidatedForm';
import { ValidatedInput } from 'src/app/components/form/ValidatedInput';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { setShowModalLogin } from 'src/app/modules/auth/authentication.reducer';
import Translate, { translate } from 'src/app/shared/language/Translate';
import { getUrlParameter } from 'src/app/shared/util/url-utils';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { handlePasswordResetFinish, reset } from './password-reset.reducer';

const ResetPasswordFinishAlert = () => {
  const { resetPasswordFinishSuccess, message } = useAppSelector(state => state.passwordReset);
  let shownMessage;
  if (resetPasswordFinishSuccess) {
    shownMessage = 'Đặt lại mật khẩu thành công';
  } else {
    shownMessage = 'Đặt lại mật khẩu không thành công. Tự động về trang chủ sau 5 giây!';
  }
  return (
    message && (
      <Alert severity={resetPasswordFinishSuccess ? 'success' : 'error'} sx={{ width: '100%' }}>
        {shownMessage}
      </Alert>
    )
  );
};

export const PasswordResetFinishPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { loading, resetPasswordFinishSuccess } = useAppSelector(state => state.passwordReset);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (resetPasswordFinishSuccess) {
      setTimeout(() => {
        navigate('/', { replace: true });
        dispatch(setShowModalLogin(true));
      }, 5000);
    }
  }, [dispatch, navigate, resetPasswordFinishSuccess]);

  const formRef = React.useRef<FormRefObject>(null);

  const [key] = useState(getUrlParameter('key', location.search));

  if (!key) {
    navigate('/', { replace: true });
  }

  const handleSubmit = data => {
    const { newPassword } = data;
    dispatch(handlePasswordResetFinish({ key, newPassword }));
  };

  const validatePasswordMatch = (confirmPassword: string) => {
    if (!formRef.current) throw Error('formRef is not assigned');

    const password = formRef.current.watchFields('newPassword');
    return password === confirmPassword;
  };

  return (
    <CustomSection>
      <Paper elevation={0} sx={{ py: 5, px: 10, maxWidth: 500, mx: 'auto' }}>
        <ValidatedForm ref={formRef} onSubmit={handleSubmit} defaultValues={{ newPassword: '', confirmPassword: '' }}>
          <Stack spacing={2} direction="column" justifyContent="center" alignItems="center">
            <Typography variant="h5" textAlign="center">
              <Translate contentKey="reset.finish.title">Reset password</Translate>
            </Typography>
            <ValidatedInput
              name="newPassword"
              label={translate('global.form.newpassword.label')}
              placeholder={translate('global.form.newpassword.placeholder')}
              type="password"
              rules={{
                required: { value: true, message: translate('global.messages.validate.newpassword.required') },
                minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
                maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
              }}
              size="medium"
              fullWidth
            />
            <ValidatedInput
              name="confirmPassword"
              label={translate('global.form.confirmpassword.label')}
              placeholder={translate('global.form.confirmpassword.placeholder')}
              type="password"
              rules={{
                required: { value: true, message: translate('global.messages.validate.confirmpassword.required') },
                minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
                maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
                validate: v => validatePasswordMatch(v) || translate('global.messages.error.dontmatch'),
              }}
              size="medium"
              fullWidth
            />
            <ResetPasswordFinishAlert />
            <LoadingButton type="submit" loading={loading} loadingIndicator="Just a moment..." variant="contained" fullWidth>
              <Translate contentKey="reset.finish.form.button">Validate new password</Translate>
            </LoadingButton>
          </Stack>
        </ValidatedForm>
      </Paper>
    </CustomSection>
  );
};

export default PasswordResetFinishPage;
