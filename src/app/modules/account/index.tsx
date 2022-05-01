import ErrorBoundaryWrapper from 'src/app/components/error-boundary/ErrorBoundaryWrapper';
import React from 'react';
import { Route, Routes } from 'react-router';
import AccountPageLayout from './AccountPageLayout';
import AccountOrderDetailPage from './orders/AccountOrderDetailPage';
import AccountOrdersPage from './orders/AccountOrdersPage';
import Password from './password-change/PasswordChangePage';
import Settings from './settings/AccountSettingsPage';

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<AccountPageLayout />}>
        <Route path={'settings'} element={<ErrorBoundaryWrapper ele={<Settings />} />} />
        <Route path={'orders'} element={<ErrorBoundaryWrapper ele={<AccountOrdersPage />} />} />
        <Route path={'orders/:orderId'} element={<ErrorBoundaryWrapper ele={<AccountOrderDetailPage />} />} />
        <Route path={'change-password'} element={<ErrorBoundaryWrapper ele={<Password />} />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
