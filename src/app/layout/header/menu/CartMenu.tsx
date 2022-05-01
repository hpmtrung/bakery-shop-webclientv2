import { ShoppingCartOutlined } from '@mui/icons-material';
import { Badge, IconButton, Tooltip } from '@mui/material';
import NavMenu from 'src/app/components/menu/NavMenu';
import { useAppSelector } from 'src/app/config/store';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartMenu = () => {
  const navigate = useNavigate();
  const updateCartItemsCount = useAppSelector(state => state.cart.items.length);

  const [cartItemsCount, setCartItemsCount] = React.useState(updateCartItemsCount);

  React.useEffect(() => {
    setCartItemsCount(updateCartItemsCount);
  }, [updateCartItemsCount]);

  return (
    <Tooltip title="Shopping cart">
      <IconButton size="large" onClick={() => navigate('/checkout')}>
        <Badge badgeContent={cartItemsCount} max={10} showZero color="primary">
          <ShoppingCartOutlined />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default CartMenu;
