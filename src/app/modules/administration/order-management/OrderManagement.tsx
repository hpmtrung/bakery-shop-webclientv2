import { Link, Paper } from '@mui/material';
import CircularLoadingIndicator from 'src/app/components/CircularLoadingIndicator';
import CustomPaginationTable from 'src/app/components/CustomPaginationTable';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { getSortState } from 'src/app/shared/util/pagination-utils';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { getOverviewOrders, setOrdersStatus, showOrderDetailDialog } from './admin-order.reducer';
import { ORDER_STATUSES } from './constant';
import { IAdminOverviewOrder } from './model';
import { useLocation } from 'react-router-dom';

const ALLOW_ROWS_PER_PAGE = [5, 10];

const OrderManagement = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { status, errorMessage, orders, total } = useAppSelector(state => state.orderManagement);

  const [pagination, setPagination] = React.useState(getSortState(location, ALLOW_ROWS_PER_PAGE[0], 'id'));
  const { activePage, itemsPerPage } = pagination;

  useEffect(() => {
    if (status === 'failed') {
      enqueueSnackbar(errorMessage, { variant: 'error' });
      dispatch(setOrdersStatus('idle'));
    }
  }, [dispatch, status, errorMessage, enqueueSnackbar]);

  useEffect(() => {
    dispatch(
      getOverviewOrders({
        page: activePage,
        size: itemsPerPage,
      })
    );
  }, [dispatch, activePage, itemsPerPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPagination({ ...pagination, activePage: newPage });
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPagination({ ...pagination, itemsPerPage: parseInt(e.target.value, 10) });
  };

  const handleShowOrderDetails = (orderId: IAdminOverviewOrder['id']) => {
    dispatch(showOrderDetailDialog(orderId));
  };

  return status === 'loading' ? (
    <CircularLoadingIndicator />
  ) : orders.length === 0 ? (
    <Paper elevation={0} sx={{ p: 1, width: '100%', textAlign: 'center' }}>
      Không có hóa đơn
    </Paper>
  ) : (
    <Paper elevation={0} sx={{ p: 1 }}>
      <CustomPaginationTable
        rowsPerPageOptions={ALLOW_ROWS_PER_PAGE}
        head={{
          row: {
            cells: [
              { content: 'Mã HĐ' },
              { content: 'Tên KH', cellProps: { align: 'center' } },
              { content: 'Trạng thái', cellProps: { align: 'center' } },
              { content: 'Ngày', cellProps: { align: 'center' } },
              { content: 'Tiền thanh toán', cellProps: { align: 'right' } },
            ],
          },
        }}
        body={{
          rows: orders.map(order => ({
            rowProps: { hover: true, role: 'checkbox', tabIndex: -1 },
            cells: [
              {
                content: (
                  <Link component="button" color="primary" onClick={() => handleShowOrderDetails(order.id)}>
                    {order.id}
                  </Link>
                ),
                cellProps: { component: 'th', scope: 'row' },
              },
              { content: order.customerName, cellProps: { align: 'center' } },
              { content: ORDER_STATUSES.find(s => s.id === order.statusId).name, cellProps: { align: 'center' } },
              { content: dayjs(order.createdAt).format('DD/MM/YYYY HH:mm'), cellProps: { align: 'center' } },
              { content: order.total, cellProps: { align: 'right' } },
            ],
          })),
        }}
        pagination={{ page: pagination.activePage, rowsPerPage: pagination.itemsPerPage, totalRows: total }}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default OrderManagement;
