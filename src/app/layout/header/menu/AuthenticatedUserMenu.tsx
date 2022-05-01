import { AccountCircleOutlined, Lock } from '@mui/icons-material';
import NavMenu from 'src/app/components/menu/NavMenu';
import NavMenuItem from 'src/app/components/menu/NavMenuItem';
import InvoiceSvgIcon from 'src/app/components/svg/InvoiceSvgIcon';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutMenu from './LogoutMenu';

export const AuthenticatedUserMenu = () => {
  const navigate = useNavigate();

  return (
    <NavMenu icon={<AccountCircleOutlined />} tooltipText="Account Settings">
      <NavMenuItem
        icon={<AccountCircleOutlined fontSize="small" />}
        content="Tài khoản của tôi"
        onClick={() => navigate('/account/settings')}
      />
      <NavMenuItem icon={<InvoiceSvgIcon fontSize="small" />} content="Đơn hàng của tôi" onClick={() => navigate('/account/orders')} />
      <NavMenuItem icon={<Lock fontSize="small" />} content="Đổi mật khẩu" onClick={() => navigate('/account/change-password')} />
      <LogoutMenu />
    </NavMenu>
  );
};

export default AuthenticatedUserMenu;
