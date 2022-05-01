import { Alert, Paper, Stack, Typography } from '@mui/material';
import { CustomSection } from 'src/app/components/CustomSection';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import Translate from 'src/app/shared/language/Translate';
import { getUrlParameter } from 'src/app/shared/util/url-utils';
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { activateAction, reset } from './activate.reducer';

const successAlert = (
  <Alert color="success">
    <Translate contentKey="activate.messages.success">
      <strong>Your user account has been activated.</strong> Please
    </Translate>
    <Link to="/" className="alert-link">
      <Translate contentKey="global.messages.info.authenticated.link">sign in</Translate>
    </Link>
  </Alert>
);

const failureAlert = (
  <Alert color="error">
    <Translate contentKey="activate.messages.error">
      <strong>Your user could not be activated.</strong> Please use the registration form to sign up.
    </Translate>
  </Alert>
);

export const ActivatePage = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const key = getUrlParameter('key', location.search);
    dispatch(activateAction(key));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, location.search]);

  const { activationSuccess, activationFailure } = useAppSelector(state => state.activate);

  return (
    <CustomSection>
      <Paper elevation={0} sx={{ py: 5, px: 10, maxWidth: 500, mx: 'auto' }}>
        <Stack spacing={2} direction="column" justifyContent="center" alignItems="center">
          <Typography variant="h5" textAlign="center">
            <Translate contentKey="activate.title">Activation</Translate>
          </Typography>
          {activationSuccess ? successAlert : undefined}
          {activationFailure ? failureAlert : undefined}
        </Stack>
      </Paper>
    </CustomSection>
  );
};

export default ActivatePage;
