import { AccountCircleOutlined, Lock } from '@mui/icons-material';
import { Grid, Paper } from '@mui/material';
import { CustomSection } from 'src/app/components/CustomSection';
import RouterBreadcrumbs, { BreadcrumbNameMapType } from 'src/app/components/RouterBreadcrumbs';
import SelectedList from 'src/app/components/SelectedList';
import InvoiceSvgIcon from 'src/app/components/svg/InvoiceSvgIcon';
import React from 'react';
import { Outlet } from 'react-router-dom';

const SideBar = () => (
  <Paper variant="outlined">
    <SelectedList
      dense
      items={[
        { icon: <AccountCircleOutlined />, content: 'Thông tin tài khoản', contentKey: 'key', to: '/account/settings' },
        { icon: <InvoiceSvgIcon />, content: 'Quản lý đơn hàng', contentKey: 'key', to: '/account/orders' },
        { icon: <Lock />, content: 'Thay đổi mật khẩu', contentKey: 'key', to: '/account/change-password' },
      ]}
    />
  </Paper>
);

const breadcrumbNameMap: BreadcrumbNameMapType = {
  '/account/settings': 'Thông tin tài khoản',
  '/account/orders': 'Quản lý đơn hàng',
  '/account/change-password': 'Thay đổi mật khẩu',
};

const AccountPageLayout = () => {
  return (
    <CustomSection even>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <RouterBreadcrumbs breadcrumbNameMap={breadcrumbNameMap} />
        </Grid>
        <Grid container item spacing={2}>
          <Grid item xs={3}>
            <SideBar />
          </Grid>
          <Grid item xs>
            <Outlet />
          </Grid>
        </Grid>
      </Grid>
    </CustomSection>
  );
};

export default AccountPageLayout;
