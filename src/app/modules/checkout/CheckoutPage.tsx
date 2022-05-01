import { Delete, DeleteOutlined, DeleteOutlineSharp } from '@mui/icons-material';
import { Box, Checkbox, Grid, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import CircularLoadingIndicator from 'src/app/components/CircularLoadingIndicator';
import { useConfirm, useSnackbar } from 'src/app/components/notification';
import { CustomSection } from 'src/app/components/CustomSection';
import NumberInput from 'src/app/components/number-input/NumberInput';
import RouterBreadcrumbs, { BreadcrumbNameMapType } from 'src/app/components/RouterBreadcrumbs';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import React from 'react';
import NumberFormat from 'react-number-format';
import { removeCartItems, updateCartItem } from './checkout.reducer';
import CheckoutInfo from './CheckoutInfo';
import { ICartItem } from './model/cart.model';

const CartDetailsRow = ({ iconCheckAll, elementContent, elementUnitPrice, elementQuantity, elementTotal, iconRemoveAll }) => {
  return (
    <Grid container alignItems="center">
      <Grid item xs>
        <Stack direction="row" spacing={2} alignItems="center">
          {iconCheckAll}
          {elementContent}
        </Stack>
      </Grid>
      <Grid container item xs={5} alignItems="center" textAlign="center">
        <Grid item xs>
          {elementUnitPrice}
        </Grid>
        <Grid item xs>
          {elementQuantity}
        </Grid>
        <Grid item xs>
          {elementTotal}
        </Grid>
      </Grid>
      <Grid item xs={1} textAlign="center">
        {iconRemoveAll}
      </Grid>
    </Grid>
  );
};

const MemoCartDetailRow = React.memo(CartDetailsRow);

const breadcrumbNameMap: BreadcrumbNameMapType = {
  '/checkout': 'Giỏ hàng',
};

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  const { items: cartItems, loading: cartLoading } = useAppSelector(state => state.cart);
  const checkOutSuccessInfo = useAppSelector(state => state.cart.checkOutSuccessInfo);

  const [checkedArray, setCheckedArray] = React.useState<boolean[]>(Array(cartItems.length).fill(false));
  const [checkedAll, setCheckedAll] = React.useState(false);

  React.useEffect(() => {
    setCheckedArray(Array(cartItems.length).fill(false));
    setCheckedAll(false);
  }, [cartItems.length]);

  React.useEffect(() => {
    if (checkedArray.length > 0) {
      let checkedCount = 0;
      checkedArray.forEach(item => item && checkedCount++);
      setCheckedAll(checkedCount === checkedArray.length);
    }
  }, [checkedArray]);

  React.useEffect(() => {
    if (checkOutSuccessInfo) {
      snackbar.success({ content: 'Cảm ơn bạn đã mua hàng. Mã hóa đơn của bạn là ' + checkOutSuccessInfo.orderId });
    }
  }, [snackbar, checkOutSuccessInfo]);

  const handleToggleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedAll(!checkedAll);
    setCheckedArray(checkedArray.slice().fill(!checkedAll));
  };

  const handleToggleCheck = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const copy = checkedArray.slice();
    copy[index] = !copy[index];
    setCheckedArray(copy);
  };

  const handleDecrease = async (itemIndex: number) => {
    const updatedQuantity = cartItems[itemIndex].quantity - 1;
    if (updatedQuantity === 0) {
      try {
        await confirm({ title: 'Xác nhận', description: 'Xóa sản phẩm khỏi giỏ hàng?' });
      } catch (e) {
        return;
      }
    }
    dispatch(
      updateCartItem({
        variantId: cartItems[itemIndex].variantId,
        quantity: updatedQuantity,
      })
    );
  };

  const handleIncrease = (itemIndex: number) => {
    dispatch(
      updateCartItem({
        variantId: cartItems[itemIndex].variantId,
        quantity: cartItems[itemIndex].quantity + 1,
      })
    );
  };

  const handleRemoveSelectedItems = () => {
    if (checkedArray.length === 0) {
      snackbar.error({ content: 'Giỏ hàng rỗng' });
      return;
    }
    if (checkedArray.map(i => (i === true ? 1 : 0)).reduce((a, b) => a + b, 0) === 0) {
      snackbar.info({ content: 'Bạn chưa chọn sản phẩm nào để xóa' });
      return;
    }
    confirm({ title: 'Xác nhận', content: 'Bạn có muốn xóa các mục đã chọn không?' }).then(() =>
      dispatch(removeCartItems(cartItems.filter((_, index) => checkedArray[index]).map(item => item.variantId)))
    );
  };

  const handleRemoveItem = (itemIndex: number) => {
    confirm({ title: 'Xác nhận', content: 'Bạn có muốn xóa mục đã chọn không?' }).then(() =>
      dispatch(
        updateCartItem({
          variantId: cartItems[itemIndex].variantId,
          quantity: 0,
        })
      )
    );
  };

  return (
    <CustomSection>
      <Grid container spacing={2}>
        {/* Breadcrumbs */}
        <Grid item xs={12} mb={1}>
          <RouterBreadcrumbs breadcrumbNameMap={breadcrumbNameMap} />
        </Grid>
        {/* Cart details and customer info */}
        <Grid item xs={12}>
          <Grid container item spacing={1}>
            <Grid item xs={12} lg={9}>
              <Stack direction="column" spacing={1}>
                {/* Header */}
                <Paper elevation={0} sx={{ p: 1 }}>
                  <MemoCartDetailRow
                    iconCheckAll={<Checkbox size="small" checked={checkedAll} onChange={e => handleToggleCheckAll(e)} />}
                    elementContent={<Typography variant="subtitle2">Tất cả ({cartItems.length} sản phẩm)</Typography>}
                    elementUnitPrice={<Typography variant="subtitle2">Đơn giá</Typography>}
                    elementQuantity={<Typography variant="subtitle2">Số lượng</Typography>}
                    elementTotal={<Typography variant="subtitle2">Thành tiền</Typography>}
                    iconRemoveAll={
                      <Tooltip title="Xóa mục đã chọn">
                        <IconButton onClick={handleRemoveSelectedItems}>
                          <Delete fontSize="medium" sx={{ color: 'text.secondary' }} />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                </Paper>
                {/* Body */}
                <Paper elevation={0} sx={{ px: 1, py: 3 }}>
                  {cartLoading ? (
                    <CircularLoadingIndicator />
                  ) : checkedArray.length > 0 ? (
                    <Stack direction="column" spacing={2}>
                      {cartItems.map((item: ICartItem, index) => (
                        <MemoCartDetailRow
                          key={item.variantId}
                          iconCheckAll={<Checkbox size="small" checked={checkedArray[index]} onChange={e => handleToggleCheck(e, index)} />}
                          elementContent={
                            <Stack direction="row" spacing={1.5}>
                              <Box component="img" src={item.imageUrl} alt="Cart item image" sx={{ height: 70, width: 'auto' }} />
                              <Stack direction="column" spacing={1}>
                                <Typography variant="body2" fontWeight={500}>
                                  {item.productName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item.typeName}
                                </Typography>
                              </Stack>
                            </Stack>
                          }
                          elementUnitPrice={
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: '400' }}>
                              <NumberFormat
                                value={item.unitPrice}
                                thousandSeparator={true}
                                prefix="$"
                                inputMode="numeric"
                                displayType={'text'}
                              />
                            </Typography>
                          }
                          elementQuantity={
                            <NumberInput
                              value={item.quantity}
                              handleDecrease={() => handleDecrease(index)}
                              handleIncrease={() => handleIncrease(index)}
                            />
                          }
                          elementTotal={
                            <Typography variant="body2" color="primary">
                              <strong>
                                <NumberFormat
                                  value={item.unitPrice * item.quantity}
                                  thousandSeparator={true}
                                  prefix="$"
                                  inputMode="numeric"
                                  displayType={'text'}
                                />
                              </strong>
                            </Typography>
                          }
                          iconRemoveAll={
                            <IconButton onClick={() => handleRemoveItem(index)}>
                              <Delete fontSize="medium" sx={{ color: 'text.secondary' }} />
                            </IconButton>
                          }
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Box py={5} textAlign="center">
                      <Typography variant="body1" color="text.secondary">
                        Giỏ hàng rỗng
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Stack>
            </Grid>
            <Grid item xs={12} lg={3}>
              <CheckoutInfo />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CustomSection>
  );
};

export default CheckoutPage;
