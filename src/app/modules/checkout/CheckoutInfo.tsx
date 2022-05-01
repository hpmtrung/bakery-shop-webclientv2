import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { ValidatedCheck } from 'src/app/components/form/ValidatedCheck';
import { ValidatedForm } from 'src/app/components/form/ValidatedForm';
import { ValidatedInput } from 'src/app/components/form/ValidatedInput';
import { useConfirm } from 'src/app/components/notification';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import React from 'react';
import NumberFormat from 'react-number-format';
import { checkOutCart } from './checkout.reducer';
import { defaultCheckoutInit, ICheckoutInit } from './model/checkout-init.model';

const CheckoutInfo = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();

  const { isAuthenticated, account } = useAppSelector(state => state.authentication);
  const { items: cartItems } = useAppSelector(state => state.cart);

  const [toggleEditInfo, setToggleEditInfo] = React.useState(!isAuthenticated);
  const [checkoutInfo, setCheckoutInfo] = React.useState<ICheckoutInit>(defaultCheckoutInit);

  React.useEffect(() => {
    setCheckoutInfo({
      ...defaultCheckoutInit,
      address: account.address,
      phone: account.phone,
    });
  }, [account]);

  React.useEffect(() => {
    setToggleEditInfo(!isAuthenticated);
  }, [isAuthenticated]);

  const handleCheckoutForm = (data: ICheckoutInit) => {
    confirm({ title: 'Thông báo', content: 'Xác nhận thanh toán?' }).then(() => dispatch(checkOutCart(data)));
  };

  const handleCheckoutDefault = () => {
    handleCheckoutForm({
      ...defaultCheckoutInit,
      address: account.address,
      phone: account.phone,
    });
  };

  const TotalInfo = React.useMemo(() => {
    const total = cartItems.map(item => item.quantity * item.unitPrice).reduce((a, b) => a + b, 0);
    return (
      <>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight={500} gutterBottom>
            Tạm tính
          </Typography>
          <Typography variant="body2" color="text.primary" textAlign="right">
            <NumberFormat value={total} thousandSeparator={true} prefix="$" inputMode="numeric" displayType={'text'} />
          </Typography>
        </Stack>
        <Divider flexItem sx={{ my: 1 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={500} gutterBottom>
            Tổng tiền
          </Typography>
          <Typography variant="h6" color="primary" textAlign="right">
            <NumberFormat value={total} thousandSeparator={true} prefix="$" inputMode="numeric" displayType={'text'} />
          </Typography>
        </Stack>
      </>
    );
  }, [cartItems]);

  return (
    <ValidatedForm onSubmit={handleCheckoutForm} defaultValues={checkoutInfo}>
      <Stack direction="column" spacing={1}>
        {cartItems.length > 0 && (
          <Paper elevation={0} sx={{ p: 2 }}>
            {toggleEditInfo ? (
              <Stack direction="column" spacing={1.5}>
                {isAuthenticated ? (
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Nhập thông tin giao hàng</Typography>
                    <Button type="button" size="small" variant="text" onClick={() => setToggleEditInfo(false)}>
                      Quay lại
                    </Button>
                  </Stack>
                ) : (
                  <Typography variant="subtitle1">Nhập thông tin giao hàng</Typography>
                )}
                <ValidatedInput
                  type="text"
                  name="address"
                  label="Address"
                  rules={{ required: 'Address is required' }}
                  fullWidth
                  autoFocus
                />
                <ValidatedInput
                  type="text"
                  name="phone"
                  label="Phone"
                  rules={{ required: 'Phone is required', pattern: { value: /^[\d]{10}$/, message: 'Phone is invalid' } }}
                  fullWidth
                />
                <ValidatedInput type="textarea" name="note" label="Note" fullWidth />
                <ValidatedCheck type="checkbox" name="paidByCash" label="Thanh toán tiền mặt" size="small" />
              </Stack>
            ) : (
              <Stack direction="column" spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">Thông tin giao hàng</Typography>
                  <Button type="button" size="small" variant="text" onClick={() => setToggleEditInfo(true)}>
                    Thay đổi
                  </Button>
                </Stack>
                <div>
                  <Typography variant="body2" component="span" fontWeight={500}>
                    Họ tên:
                  </Typography>
                  &nbsp;
                  <Typography variant="body2" component="span">
                    {account.firstName + ' ' + account.lastName}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" component="span" fontWeight={500}>
                    Di động:
                  </Typography>
                  &nbsp;
                  <Typography variant="body2" component="span">
                    {account.phone}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" component="span" fontWeight={500}>
                    Địa chỉ:
                  </Typography>
                  &nbsp;
                  <Typography variant="body2" component="span">
                    {account.address}
                  </Typography>
                </div>
              </Stack>
            )}
          </Paper>
        )}
        <Paper elevation={0} sx={{ p: 2 }}>
          <Stack direction="column" spacing={1.5}>
            {TotalInfo}
            {toggleEditInfo ? (
              <Button variant="contained" type="submit" color="primary" size="large" disabled={cartItems.length === 0}>
                Mua hàng
              </Button>
            ) : (
              <Button
                variant="contained"
                type="button"
                color="primary"
                size="large"
                disabled={cartItems.length === 0}
                onClick={handleCheckoutDefault}
              >
                Mua hàng
              </Button>
            )}
          </Stack>
        </Paper>
      </Stack>
    </ValidatedForm>
  );
};

export default CheckoutInfo;
