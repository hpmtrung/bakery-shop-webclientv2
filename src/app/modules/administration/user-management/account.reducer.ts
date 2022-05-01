import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IQueryParams } from 'src/app/shared/reducers/reducer.utils';
import { getTotalItemsFromHeaders } from 'src/app/shared/util/pagination-utils';
import axios from 'axios';
import { IManagedAccount } from './account.model';

interface AccountManagementState {
  status: 'idle' | 'loading' | 'failed';
  errorMessage: string;
  accounts: IManagedAccount[];
  total: number;
  selectedAccount: {
    status: 'idle' | 'loading';
    errorMessage: string;
    accountId: IManagedAccount['id'];
    showDialog: boolean;
  };
}

const initialState: AccountManagementState = {
  status: 'idle',
  errorMessage: null,
  accounts: [],
  total: 0,
  selectedAccount: {
    status: 'idle',
    errorMessage: null,
    accountId: null,
    showDialog: false,
  },
};

const apiURL = '/api/admin/accounts';
const SLICE_NAME = 'account_management';

export const getAccounts = createAsyncThunk(`${SLICE_NAME}/get_accounts`, async ({ page, size }: IQueryParams) => {
  return axios.get<AccountManagementState['accounts']>(`${apiURL}/?page=${page}&size=${size}`);
});

const AccountManagementSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setAccountsState(state, action: PayloadAction<AccountManagementState['status']>) {
      state.status = action.payload;
    },
    showAccountDetailDialog(state, action: PayloadAction<IManagedAccount['id']>) {
      state.selectedAccount.accountId = action.payload;
      state.selectedAccount.showDialog = true;
    },
    setShowAccountDetailDialog(state, action: PayloadAction<boolean>) {
      state.selectedAccount.showDialog = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAccounts.pending, state => {
        state = { ...initialState, status: 'loading' };
      })
      .addCase(getAccounts.fulfilled, (state, action) => {
        const { headers, data } = action.payload;

        state.status = 'idle';
        state.accounts = data;
        state.total = getTotalItemsFromHeaders(headers);
      })
      .addCase(getAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.error.message;
      });
  },
});

export const { setAccountsState, setShowAccountDetailDialog, showAccountDetailDialog } = AccountManagementSlice.actions;

export default AccountManagementSlice.reducer;
