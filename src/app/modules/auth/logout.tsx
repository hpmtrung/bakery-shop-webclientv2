import React, { useLayoutEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { logout } from './authentication.reducer';

export const Logout = () => {
  const logoutUrl = useAppSelector(state => state.authentication.logoutURL);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(logout());
    if (logoutUrl) {
      window.location.href = logoutUrl;
    }
  });

  return (
    <div className="p-5">
      <h4>Logged out successfully!</h4>
    </div>
  );
};

export default Logout;
