import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IUserOrderWithDetail, IUserOverviewOrder } from 'src/app/modules/account/orders/model/order.model';
import { IQueryParams } from 'src/app/shared/reducers/reducer.utils';
import { getTotalItemsFromHeaders, loadMoreDataWhenScrolled } from 'src/app/shared/util/pagination-utils';
import { parseHeaderForLinks } from 'src/app/shared/util/url-utils';
import axios from 'axios';

export interface UserOrdersState {
  loading: boolean;
  errorMessage: string;
  orders: IUserOverviewOrder[];
  selectedOrder: IUserOrderWithDetail | null;
  links: { prev?: number; next?: number };
  totalItems: number;
}

const initialState: UserOrdersState = {
  loading: false,
  errorMessage: null,
  orders: [],
  selectedOrder: null,
  links: { next: 0 },
  totalItems: 0,
};

const apiURL = '/api/account/orders';

// Actions

export const getAllAccountOrders = createAsyncThunk('user_orders/get_orders', async ({ page, size }: IQueryParams) => {
  return axios.get<IUserOverviewOrder[]>(`${apiURL}/${page !== undefined && `?page=${page}&size=${size}`}`);
});

export const getAccountOrdersByStatus = createAsyncThunk(
  'user_orders/get_orders_by_status',
  async ({ statusId, params: { page, size } }: { statusId: number; params: IQueryParams }) => {
    return axios.get<IUserOverviewOrder[]>(`${apiURL}/status/${statusId}/${page !== undefined && `?page=${page}&size=${size}`}`);
  }
);

export const getAccountOrderDetails = createAsyncThunk('user_orders/get_order_detail', async (orderId: IUserOverviewOrder['id']) => {
  return axios.get<IUserOrderWithDetail>(`${apiURL}/${orderId}`);
});

// Slice

export const UserOrdersSlice = createSlice({
  name: 'user_orders',
  initialState,
  reducers: {
    reset() {
      return {
        ...initialState,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAccountOrderDetails.fulfilled, (state, action) => {
        state.selectedOrder = action.payload.data;
      })
      .addMatcher(isFulfilled(getAllAccountOrders, getAccountOrdersByStatus), (state, action) => {
        const { data, headers } = action.payload;
        state.links = parseHeaderForLinks(headers.link);
        state.orders = loadMoreDataWhenScrolled(state.orders, data, state.links);
        state.totalItems = getTotalItemsFromHeaders(headers);
      })
      .addMatcher(isPending(getAllAccountOrders, getAccountOrdersByStatus, getAccountOrderDetails), state => {
        state.loading = true;
        state.selectedOrder = null;
        state.errorMessage = null;
      })
      .addMatcher(isFulfilled(getAllAccountOrders, getAccountOrdersByStatus, getAccountOrderDetails), state => {
        state.loading = false;
      })
      .addMatcher(isRejected(getAllAccountOrders, getAccountOrdersByStatus, getAccountOrderDetails), (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

// Reducer
export const { reset } = UserOrdersSlice.actions;
export default UserOrdersSlice.reducer;
