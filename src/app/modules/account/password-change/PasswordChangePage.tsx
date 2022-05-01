import { LoadingButton } from '@mui/lab';
import { Grid, Paper } from '@mui/material';
import { FormRefObject, ValidatedForm } from 'src/app/components/form/ValidatedForm';
import { ValidatedInput } from 'src/app/components/form/ValidatedInput';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import Translate, { translate } from 'src/app/shared/language/Translate';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { defaultPasswordChange } from './model/password-change.model';
import { reset, savePassword } from './password.reducer';

export const PasswordChangePage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const { loading, successMessage, errorMessage } = useAppSelector(state => state.password);

  const formRef = React.useRef<FormRefObject>(null);

  const validatePasswordMatch = (confirmPassword: string) => {
    if (!formRef.current) throw Error('formRef is not assigned');

    const password = formRef.current.watchFields('newPassword');
    return password === confirmPassword;
  };

  const handleSubmit = data => {
    const { currentPassword, newPassword } = data;
    dispatch(savePassword({ currentPassword, newPassword }));
  };

  useEffect(() => {
    if (successMessage) {
      enqueueSnackbar(translate(successMessage), { variant: 'success' });
    } else if (errorMessage) {
      enqueueSnackbar(translate(errorMessage), { variant: 'error' });
    }
  }, [successMessage, errorMessage, enqueueSnackbar]);

  return (
    <Paper elevation={0} sx={{ p: 1 }}>
      <ValidatedForm ref={formRef} onSubmit={handleSubmit} defaultValues={{ ...defaultPasswordChange, confirmPassword: '' }}>
        <Grid container spacing={2} justifyContent="center" my={3} mx="auto" maxWidth={400}>
          <Grid item xs={12}>
            <ValidatedInput
              type="password"
              name="currentPassword"
              label={translate('global.form.currentpassword.label')}
              rules={{
                required: { value: true, message: 'Your password is required' },
                minLength: { value: 4, message: 'Your password is required to be at least 4 characters.' },
                maxLength: { value: 50, message: 'Your password cannot be longer than 50 characters.' },
              }}
              size="medium"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <ValidatedInput
              type="password"
              name="newPassword"
              label={translate('global.form.newpassword.label')}
              placeholder={translate('global.form.newpassword.placeholder')}
              rules={{
                required: { value: true, message: translate('global.messages.validate.newpassword.required') },
                minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
                maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
              }}
              size="medium"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            {/* <PasswordStrengthBar password={password} /> */}
            <ValidatedInput
              type="password"
              name="confirmPassword"
              label={translate('global.form.confirmpassword.label')}
              placeholder={translate('global.form.confirmpassword.placeholder')}
              rules={{
                required: { value: true, message: translate('global.messages.validate.confirmpassword.required') },
                minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
                maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
                validate: v => validatePasswordMatch(v) || translate('global.messages.error.dontmatch'),
              }}
              size="medium"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton type="submit" loading={loading} loadingIndicator="Just a moment..." variant="contained" fullWidth>
              <Translate contentKey="password.form.button">Save</Translate>
            </LoadingButton>
          </Grid>
        </Grid>
      </ValidatedForm>
    </Paper>
  );
};

export default PasswordChangePage;
