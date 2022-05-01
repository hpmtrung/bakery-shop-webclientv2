import { LoadingButton } from '@mui/lab';
import { Grid, Link } from '@mui/material';
import { ValidatedCheck } from 'src/app/components/form/ValidatedCheck';
import { ValidatedForm } from 'src/app/components/form/ValidatedForm';
import { ValidatedInput } from 'src/app/components/form/ValidatedInput';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { translate } from 'src/app/shared/language/Translate';
import React from 'react';
import { login } from './authentication.reducer';
import { defaultAccountLogin, IAccountLogin } from './model/login.model';
import { Alert } from '@mui/material';
import Translate from 'src/app/shared/language/Translate';

const LoginErrorAlert = () => {
  const loginError = useAppSelector(state => state.authentication.loginError);

  return (
    loginError && (
      <Alert color="error">
        <Translate contentKey="login.messages.error.authentication">
          <strong>Failed to sign in!</strong> Please check your credentials and try again.
        </Translate>
      </Alert>
    )
  );
};

const LoginForm = ({ onToResetPassword, onToSignUp }) => {
  const dispatch = useAppDispatch();

  const authenticateLoading = useAppSelector(state => state.authentication.loading);

  const handleLogin = React.useCallback(
    ({ email, password, rememberMe }: IAccountLogin) => {
      dispatch(login(email, password, rememberMe));
    },
    [dispatch]
  );

  return (
    <ValidatedForm onSubmit={handleLogin} defaultValues={defaultAccountLogin}>
      <Grid container spacing={1.5} p={1}>
        <Grid item xs={12}>
          <ValidatedInput
            name="email"
            type="email"
            label={translate('global.form.email.label')}
            rules={{ required: 'Email cannot be empty!' }}
            size="medium"
            fullWidth
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <ValidatedInput
            name="password"
            type="password"
            label={translate('login.form.password')}
            rules={{ required: 'Password cannot be empty!' }}
            size="medium"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <ValidatedCheck type="checkbox" name="rememberMe" label="Remember me" />
        </Grid>
        <Grid item xs={12}>
          <LoginErrorAlert />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            type="submit"
            loading={authenticateLoading}
            loadingIndicator="Just a moment..."
            variant="contained"
            fullWidth
            sx={{ mt: 0.5 }}
          >
            Sign in
          </LoadingButton>
        </Grid>
        <Grid container item>
          <Grid item xs>
            <Link component="button" type="button" variant="body2" onClick={onToResetPassword}>
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link component="button" type="button" variant="body2" onClick={onToSignUp}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </ValidatedForm>
  );
};

export default LoginForm;
