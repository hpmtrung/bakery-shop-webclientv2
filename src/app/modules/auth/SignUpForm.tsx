import { LoadingButton } from '@mui/lab';
import { Alert, Grid, Link } from '@mui/material';
import { FormRefObject, ValidatedForm } from 'src/app/components/form/ValidatedForm';
import { ValidatedInput } from 'src/app/components/form/ValidatedInput';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { translate } from 'src/app/shared/language/Translate';
import { keys, pick } from 'lodash';
import React from 'react';
import { defaultAccountSignUp, IAccountSignUp } from './model/sign-up.model';
import { handleSignUp, reset } from './sign-up.reducer';

const SignUpAlert = () => {
  const { message, signUpSuccess } = useAppSelector(state => state.signUp);
  const shownMessage = signUpSuccess ? 'Tạo tài khoản thành công' : 'Tạo tài khoản không thành công';
  return (
    message && (
      <Alert severity={signUpSuccess ? 'success' : 'error'} sx={{ textAlign: 'center' }}>
        {shownMessage}
      </Alert>
    )
  );
};

const SignUpForm = ({ onToLogin }) => {
  const dispatch = useAppDispatch();
  const { loading: signUpLoading, signUpSuccess } = useAppSelector(state => state.signUp);

  const formRef = React.useRef<FormRefObject>(null);

  React.useEffect(
    () => () => {
      dispatch(reset());
    },
    [dispatch]
  );

  React.useEffect(() => {
    if (signUpSuccess) {
      setTimeout(() => {
        onToLogin();
      }, 3000);
    }
  }, [signUpSuccess, onToLogin]);

  const validatePasswordMatch = (confirmPassword: string) => {
    if (!formRef.current) throw Error('formRef is not assigned');

    const password = formRef.current.watchFields('password');
    return password === confirmPassword;
  };

  const handleSubmit = data => {
    dispatch(handleSignUp(pick(data, keys(defaultAccountSignUp)) as IAccountSignUp));
  };

  return (
    <ValidatedForm ref={formRef} onSubmit={handleSubmit} defaultValues={{ ...defaultAccountSignUp, confirmPassword: '' }}>
      <Grid container spacing={1.5} p={1} pt={3}>
        <Grid item xs={6}>
          <ValidatedInput
            name="firstName"
            type="text"
            label="First name"
            rules={{ required: 'First name cannot be empty!' }}
            fullWidth
            autoFocus
          />
        </Grid>
        <Grid item xs={6}>
          <ValidatedInput name="lastName" type="text" label="Last name" rules={{ required: 'Last name cannot be empty!' }} fullWidth />
        </Grid>
        <Grid item xs={7}>
          <ValidatedInput
            name="email"
            type="email"
            label={translate('global.form.email.label')}
            rules={{ required: 'Email cannot be empty!' }}
            fullWidth
          />
        </Grid>
        <Grid item xs={5}>
          <ValidatedInput
            name="phone"
            type="text"
            label="Phone"
            rules={{ required: 'Phone is required', pattern: { value: /^[\d]{10}$/, message: 'Phone is invalid' } }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <ValidatedInput name="address" type="text" label="Address" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <ValidatedInput
            name="password"
            type="password"
            label={translate('global.form.newpassword.label')}
            placeholder={translate('global.form.newpassword.placeholder')}
            rules={{
              required: { value: true, message: translate('global.messages.validate.newpassword.required') },
              minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
              maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <ValidatedInput
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder={translate('global.form.confirmpassword.placeholder')}
            rules={{
              required: { value: true, message: translate('global.messages.validate.confirmpassword.required') },
              minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
              maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
              validate: v => validatePasswordMatch(v) || translate('global.messages.error.dontmatch'),
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <SignUpAlert />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton type="submit" loading={signUpLoading} loadingIndicator="Just a moment..." variant="contained" fullWidth>
            Sign up
          </LoadingButton>
        </Grid>
        <Grid item xs={12} justifyContent="flex-start" alignItems="center">
          <Link component="button" type="button" variant="body2" onClick={onToLogin}>
            Quay về đăng nhập
          </Link>
        </Grid>
      </Grid>
    </ValidatedForm>
  );
};

export default SignUpForm;
