import {
	createAsyncThunk,
	createSlice,
	isFulfilled,
	isPending,
	isRejected,
	PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { IQueryParams } from "src/app/shared/reducers/reducer.utils";
import { getTotalItemsFromHeaders } from "src/app/shared/util/pagination-utils";
import {
	IAdminOrder,
	IAdminOverviewOrder,
	IResponseAfterUpdateStatus,
} from "./model";

interface OrderManagementState {
	status: "idle" | "loading" | "failed";
	errorMessage: string | null;
	orders: IAdminOverviewOrder[];
	total: number;
	selectedOrder: {
		status: "idle" | "loading" | "updating" | "updateSucceed" | "failed";
		errorMessage: string | null;
		order: IAdminOrder;
		showDialog: boolean;
	};
}

const initialState: OrderManagementState = {
	status: "idle",
	errorMessage: null,
	orders: [],
	total: 0,
	selectedOrder: {
		status: "idle",
		errorMessage: null,
		order: null,
		showDialog: false,
	},
};

const apiURL = "/api/admin/orders";
const SLICE_NAME = "order_management";

// Action

export const getOverviewOrders = createAsyncThunk(
	`${SLICE_NAME}/get_overview_orders`,
	async ({ page, size }: IQueryParams) => {
		return axios.get<IAdminOverviewOrder[]>(
			`${apiURL}/?page=${page}&size=${size}`
		);
	}
);

export const showOrderDetailDialog = createAsyncThunk(
	`${SLICE_NAME}/get_order_details`,
	async (orderId: IAdminOverviewOrder["id"]) => {
		return axios.get<IAdminOrder>(`${apiURL}/${orderId}`);
	}
);

export const updateOrderStatus = createAsyncThunk(
	`${SLICE_NAME}/udpate_status`,
	async (orderId: IAdminOrder["id"]) => {
		return axios.put<IResponseAfterUpdateStatus>(
			`${apiURL}/${orderId}/status/update`
		);
	}
);

export const cancelOrder = createAsyncThunk(
	`${SLICE_NAME}/cancel_order`,
	async (orderId: IAdminOrder["id"]) => {
		return axios.put<IResponseAfterUpdateStatus>(`${apiURL}/${orderId}/cancel`);
	}
);

// Slice
const OrderManagementSlice = createSlice({
	name: SLICE_NAME,
	initialState,
	reducers: {
		setOrdersStatus(
			state,
			action: PayloadAction<OrderManagementState["status"]>
		) {
			state.status = action.payload;
		},
		setSelectedOrderStatus(
			state,
			action: PayloadAction<OrderManagementState["selectedOrder"]["status"]>
		) {
			state.selectedOrder.status = action.payload;
		},
		setShowOrderDetailDialog(state, action: PayloadAction<boolean>) {
			state.selectedOrder.showDialog = action.payload;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getOverviewOrders.pending, () => {
				return { ...initialState, status: "loading" };
			})
			.addCase(getOverviewOrders.fulfilled, (state, action) => {
				const { headers, data } = action.payload;
				state.status = "idle";
				state.orders = data;
				state.total = getTotalItemsFromHeaders(headers);
			})
			//
			.addCase(showOrderDetailDialog.pending, (state) => {
				state.selectedOrder = {
					...initialState.selectedOrder,
					status: "loading",
				};
			})
			.addCase(showOrderDetailDialog.fulfilled, (state, action) => {
				state.selectedOrder = {
					...state.selectedOrder,
					status: "idle",
					order: action.payload.data,
					showDialog: true,
				};
			})
			//
			.addMatcher(isPending(updateOrderStatus, cancelOrder), (state) => {
				state.selectedOrder = {
					...state.selectedOrder,
					status: "updating",
					errorMessage: null,
				};
			})
			.addMatcher(
				isFulfilled(updateOrderStatus, cancelOrder),
				(state, action) => {
					const data = action.payload.data;

					state.selectedOrder.status = "updateSucceed";
					const selectedOrder = state.selectedOrder.order;
					if (selectedOrder.id === data.orderId) {
						selectedOrder.canCancel = data.canCancel;
						selectedOrder.statusId = data.updatedStatusId;
					}
				}
			)
			//
			.addMatcher(isRejected(getOverviewOrders), (state, action) => {
				state.status = "failed";
				state.errorMessage = action.error.message;
			})
			.addMatcher(
				isRejected(showOrderDetailDialog, updateOrderStatus, cancelOrder),
				(state, action) => {
					state.selectedOrder = {
						...state.selectedOrder,
						status: "failed",
						errorMessage: action.error.message,
					};
				}
			);
	},
});

export const {
	setOrdersStatus,
	setSelectedOrderStatus,
	setShowOrderDetailDialog,
} = OrderManagementSlice.actions;

export default OrderManagementSlice.reducer;
