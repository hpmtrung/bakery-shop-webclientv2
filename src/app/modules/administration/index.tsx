import ErrorBoundaryWrapper from 'src/app/components/error-boundary/ErrorBoundaryWrapper';
import React from 'react';
import { Route, Routes } from 'react-router';
import AdminPageLayout from './AdminPageLayout';
import AdminDashboard from './dashboard/AdminDashboard';
import Docs from './docs/docs';
import OrderManagement from './order-management/OrderManagement';
import ProductManagement from './product-management/ProductManagement';
import AccountManagement from './user-management/AccountManagement';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminPageLayout />}>
        <Route path={'dashboard'} element={<ErrorBoundaryWrapper ele={<AdminDashboard />} />} />
        <Route path={'product-management'} element={<ErrorBoundaryWrapper ele={<ProductManagement />} />} />
        <Route path={'order-management'} element={<ErrorBoundaryWrapper ele={<OrderManagement />} />} />
        <Route path={'user-management'} element={<ErrorBoundaryWrapper ele={<AccountManagement />} />} />
        <Route path={'docs'} element={<ErrorBoundaryWrapper ele={<Docs />} />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
