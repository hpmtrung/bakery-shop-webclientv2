import { Alert, Button, Grid, Typography } from '@mui/material';
import { ValidatedForm } from 'src/app/components/form/ValidatedForm';
import { ValidatedInput } from 'src/app/components/form/ValidatedInput';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import Translate, { translate } from 'src/app/shared/language/Translate';
import { isEmail } from 'src/app/shared/util/validate-utils';
import React, { useEffect } from 'react';
import { handlePasswordResetInit, reset } from '../../../auth/password-reset.reducer';

export const PasswordResetInit = () => {
  const dispatch = useAppDispatch();

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [dispatch]
  );

  const handleValidSubmit = ({ email }) => {
    dispatch(handlePasswordResetInit(email));
  };

  const successMessage = useAppSelector(state => state.passwordReset.message);

  return (
    <div>
      <Grid container>
        <Grid item md={8}>
          <Typography variant="h1">
            <Translate contentKey="reset.request.title">Reset your password</Translate>
          </Typography>
          <Alert color="warning">
            <p>
              <Translate contentKey="reset.request.messages.info">Enter the email address you used to register</Translate>
            </p>
          </Alert>
          <ValidatedForm onSubmit={handleValidSubmit}>
            <ValidatedInput
              name="email"
              type="email"
              label={translate('global.form.email.label')}
              placeholder={translate('global.form.email.placeholder')}
              rules={{
                required: { value: true, message: translate('global.messages.validate.email.required') },
                minLength: { value: 5, message: translate('global.messages.validate.email.minlength') },
                maxLength: { value: 254, message: translate('global.messages.validate.email.maxlength') },
                validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
              }}
            />
            <Button color="primary" type="submit" data-cy="submit">
              <Translate contentKey="reset.request.form.button">Reset password</Translate>
            </Button>
          </ValidatedForm>
        </Grid>
      </Grid>
    </div>
  );
};

export default PasswordResetInit;
