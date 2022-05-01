import { Link, Paper } from '@mui/material';
import CircularLoadingIndicator from 'src/app/components/CircularLoadingIndicator';
import CustomPaginationTable from 'src/app/components/CustomPaginationTable';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { getSortState } from 'src/app/shared/util/pagination-utils';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { IManagedAccount } from './account.model';
import { getAccounts, setAccountsState, showAccountDetailDialog } from './account.reducer';
import { useLocation } from 'react-router-dom';

const ALLOW_ROWS_PER_PAGE = [5, 10];

const AccountManagement = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { status, errorMessage, accounts, total } = useAppSelector(state => state.accountManagement);

  const [pagination, setPagination] = useState(getSortState(location, ALLOW_ROWS_PER_PAGE[0], 'id'));
  const { activePage, itemsPerPage } = pagination;

  useEffect(() => {
    if (status === 'failed') {
      enqueueSnackbar(errorMessage, { variant: 'error' });
      dispatch(setAccountsState('idle'));
    }
  }, [dispatch, status, errorMessage, enqueueSnackbar]);

  useEffect(() => {
    dispatch(
      getAccounts({
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

  const handleShowAccountDetail = (accountId: IManagedAccount['id']) => {
    dispatch(showAccountDetailDialog(accountId));
  };

  return status === 'loading' ? (
    <CircularLoadingIndicator />
  ) : accounts.length === 0 ? (
    <Paper elevation={0} sx={{ p: 1, width: '100%', textAlign: 'center' }}>
      Không có tài khoản
    </Paper>
  ) : (
    <Paper elevation={0} sx={{ p: 1 }}>
      <CustomPaginationTable
        rowsPerPageOptions={ALLOW_ROWS_PER_PAGE}
        head={{
          row: {
            cells: [
              { content: 'Mã TK' },
              { content: 'Tên KH', cellProps: { align: 'center' } },
              { content: 'Địa chỉ email', cellProps: { align: 'center' } },
              { content: 'SĐT', cellProps: { align: 'center' } },
              { content: 'Địa chỉ', cellProps: { align: 'center' } },
              { content: 'Kích hoạt', cellProps: { align: 'center' } },
            ],
          },
        }}
        body={{
          rows: accounts.map(account => ({
            rowProps: { hover: true, role: 'checkbox', tabIndex: -1 },
            cells: [
              {
                content: (
                  <Link component="button" color="primary" onClick={() => handleShowAccountDetail(account.id)}>
                    {account.id}
                  </Link>
                ),
                cellProps: { component: 'th', scope: 'row' },
              },
              { content: account.firstName + ' ' + account.lastName, cellProps: { align: 'center' } },
              { content: account.email, cellProps: { align: 'left' } },
              { content: account.phone, cellProps: { align: 'center' } },
              { content: account.address, cellProps: { align: 'left' } },
              { content: account.activated ? 'Đã kích hoạt' : '', cellProps: { align: 'center' } },
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

export default AccountManagement;
