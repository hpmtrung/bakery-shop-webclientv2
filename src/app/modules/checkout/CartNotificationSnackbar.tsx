import { Alert, Button, Snackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { setShowAddItemNotification } from 'src/app/modules/checkout/checkout.reducer';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartNotificationSnackbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const showAddItemNotification = useAppSelector(state => state.cart.showAddItemNotification);
  const open = Boolean(showAddItemNotification);

  const handleClose = () => {
    dispatch(setShowAddItemNotification(false));
  };

  const handleNavigateToCart = () => {
    handleClose();
    navigate('/account/checkout');
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      sx={{ mt: 5 }}
    >
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        Thêm sản phẩm vào giỏ hàng thành công!
        <Button variant="outlined" size="small" disableElevation onClick={handleNavigateToCart} sx={{ ml: 2 }}>
          Xem và thanh toán
        </Button>
      </Alert>
    </Snackbar>
  );
};

export default CartNotificationSnackbar;
