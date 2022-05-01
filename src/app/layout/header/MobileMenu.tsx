import { AccountCircleOutlined, Logout, MenuOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { Badge } from '@mui/material';
import NavMenu from 'src/app/components/menu/NavMenu';
import NavMenuItem from 'src/app/components/menu/NavMenuItem';
import { useAppSelector } from 'src/app/config/store';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminManagementMenu from './menu/AdminManagementMenu';
import LogoutMenu from './menu/LogoutMenu';

const MobileMenu = ({ isAuthenticated, isAdmin }: { isAuthenticated: boolean; isAdmin: boolean }) => {
  const navigate = useNavigate();

  const cartItemsCount = useAppSelector(state => state.cart.items.length);

  return (
    <NavMenu tooltipText="More" icon={<MenuOutlined fontSize="medium" sx={{ color: 'text.secondary' }} />}>
      <NavMenuItem
        content="Shopping cart"
        icon={
          <Badge badgeContent={cartItemsCount} max={10} showZero color="primary" overlap="circular">
            <ShoppingCartOutlined fontSize="small" />
          </Badge>
        }
        onClick={() => navigate('/checkout')}
      />
      {isAuthenticated && (
        <NavMenuItem
          content="Account settings"
          icon={<AccountCircleOutlined fontSize="small" />}
          divider
          onClick={() => navigate('/account/settings')}
        />
      )}
      {isAuthenticated && isAdmin && <AdminManagementMenu collapse />}

      <LogoutMenu />
    </NavMenu>
  );
};

export default MobileMenu;
