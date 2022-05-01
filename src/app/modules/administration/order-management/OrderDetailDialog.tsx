import { DoneAllOutlined, LocalShippingOutlined, LoopOutlined } from '@mui/icons-material';
import { Button, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { BootstrapDialog } from 'src/app/components/BootstrapDialog';
import CustomPaginationTable from 'src/app/components/CustomPaginationTable';
import StatusButton, { StatusButtonProps } from 'src/app/components/StatusButton';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { IPaginationBaseState } from 'src/app/shared/util/pagination-utils';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { setSelectedOrderStatus, setShowOrderDetailDialog, updateOrderStatus, cancelOrder } from './admin-order.reducer';
import { ORDER_STATUSES } from './constant';
import { useConfirm } from 'src/app/components/notification';

const statuses: StatusButtonProps['statuses'] = [
  {
    statusId: ORDER_STATUSES[0].id,
    icon: <LoopOutlined />,
    content: ORDER_STATUSES[0].name,
    style: {
      backgroundColor: '#0da012',
    },
  },
  {
    statusId: ORDER_STATUSES[1].id,
    icon: <LocalShippingOutlined />,
    content: ORDER_STATUSES[1].name,
    style: {
      backgroundColor: '#4c82af',
    },
  },
  {
    statusId: ORDER_STATUSES[2].id,
    icon: <DoneAllOutlined />,
    content: ORDER_STATUSES[2].name,
    style: {
      backgroundColor: '#af4c8e',
    },
  },
];

const OrderDetailDialog = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const { order, showDialog, status, errorMessage } = useAppSelector(state => state.orderManagement.selectedOrder);
  const [pagination, setPagination] = React.useState<IPaginationBaseState>({ activePage: 0, itemsPerPage: 3, order: 'id', sort: 'DESC' });
  const { activePage, itemsPerPage } = pagination;

  useEffect(() => {
    let trigger = false;
    if (status === 'updateSucceed') {
      enqueueSnackbar('Cập nhật trạng thái đơn hàng thành công', { variant: 'success' });
      trigger = true;
    } else if (status === 'failed') {
      enqueueSnackbar(errorMessage, { variant: 'error' });
      trigger = true;
    }
    if (trigger) {
      dispatch(setSelectedOrderStatus('idle'));
    }
  }, [dispatch, status, errorMessage, enqueueSnackbar]);

  if (!order) return null;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPagination({ ...pagination, activePage: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPagination({ ...pagination, itemsPerPage: parseInt(event.target.value, 10) });
  };

  const handleClose = () => {
    dispatch(setShowOrderDetailDialog(false));
  };

  const handleUpdateStatus = () => {
    dispatch(updateOrderStatus(order.id));
  };

  const handleCancel = async () => {
    try {
      await confirm({ title: 'Xác nhận', content: 'Bạn muốn hủy đơn hàng?' });
      dispatch(cancelOrder(order.id));
    } catch (e) {
      return;
    }
  };

  const slicedDetails = order.details.slice(activePage * itemsPerPage, (activePage + 1) * itemsPerPage);

  return (
    <BootstrapDialog open={showDialog} titleContent={'Chi tiết đơn hàng #' + order.id} onClose={handleClose} maxWidth="md" fullWidth>
      <Stack direction="column" spacing={2}>
        <CustomPaginationTable
          rowsPerPageOptions={[3, 5]}
          head={{
            row: {
              cells: [
                { content: 'Tên sản phẩm' },
                { content: 'Loại', cellProps: { align: 'center' } },
                { content: 'Số lượng mua', cellProps: { align: 'center' } },
                { content: 'Đơn giá', cellProps: { align: 'center' } },
                { content: 'Thành tiền', cellProps: { align: 'right' } },
              ],
            },
          }}
          body={{
            rows: slicedDetails.map(detail => ({
              rowProps: { hover: true, role: 'checkbox', tabIndex: -1 },
              cells: [
                { content: detail.productName, cellProps: { component: 'th', scope: 'row' } },
                { content: detail.typeName, cellProps: { align: 'center' } },
                { content: detail.quantity, cellProps: { align: 'center' } },
                { content: detail.unitPrice, cellProps: { align: 'center' } },
                { content: detail.quantity * detail.unitPrice, cellProps: { align: 'right' } },
              ],
            })),
          }}
          pagination={{ page: pagination.activePage, rowsPerPage: pagination.itemsPerPage, totalRows: order.details.length }}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <Typography variant="body2" color="text.primary" fontWeight={600} alignSelf="flex-end">
          Tổng tiền: {order.total}
        </Typography>
        <Grid container direction="column" gap={2}>
          <Grid container item alignItems="center">
            <Grid item xs={2}>
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                Tên khách hàng:{' '}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.primary">
                {order.customerName}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                Trạng thái:{' '}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              {order.statusId === 4 ? (
                <Chip label="Đã hủy" color="error" />
              ) : (
                <StatusButton
                  statuses={statuses}
                  currentStatusId={order.statusId}
                  handleUpdateStatus={handleUpdateStatus}
                  size="small"
                  disabled={status === 'updating'}
                />
              )}
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={2}>
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                Ngày mua:{' '}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.primary">
                {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                Phương thức TT:{' '}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.primary">
                {order.paidByCash ? 'Tiền mặt' : 'Thẻ'}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              Thông tin giao hàng
            </Typography>
          </Grid>
          <Grid container item spacing={2}>
            <Grid item xs>
              <TextField
                variant="filled"
                label="Địa chỉ"
                multiline
                maxRows={3}
                fullWidth
                value={order.receiverInfo.address}
                size="medium"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                variant="filled"
                label="Điện thoại"
                fullWidth
                value={order.receiverInfo.phone}
                size="medium"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                variant="filled"
                label="Ghi chú"
                multiline
                maxRows={3}
                fullWidth
                value={order.receiverInfo.note}
                size="medium"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
          {order.canCancel && (
            <Grid item xs={12} alignSelf="flex-end">
              <Button variant="contained" color="error" size="small" disabled={status === 'updating'} onClick={handleCancel}>
                Hủy đơn hàng
              </Button>
            </Grid>
          )}
        </Grid>
      </Stack>
    </BootstrapDialog>
  );
};

export default OrderDetailDialog;
