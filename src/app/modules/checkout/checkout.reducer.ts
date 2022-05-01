import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from 'src/app/config/store';
import { serializeAxiosError } from 'src/app/shared/reducers/reducer.utils';
import { Storage } from 'src/app/shared/util/storage-utils';
import axios from 'axios';
import { ICartItem, IUserCart } from './model/cart.model';
import { ICheckoutFinish } from './model/checkout-finish.model';
import { ICheckoutInit, IUnAuthCheckoutInit } from './model/checkout-init.model';

export interface CartState {
  loading: boolean;
  errorMessage: string | null; // errors from server side
  items: ICartItem[];
  showAddItemNotification: boolean;
  notificationMessage: string;
  storeMethod: 'local' | 'persistence';
  checkOutSuccessInfo: ICheckoutFinish | null;
}

const initialState: CartState = {
  loading: false,
  errorMessage: null,
  items: [],
  showAddItemNotification: false,
  notificationMessage: null,
  storeMethod: 'local',
  checkOutSuccessInfo: null,
};

const apiURL = '/api/account/cart';

// Actions

export const getAccountCart = createAsyncThunk('cart/get_account_cart', async () => {
  return axios.get<IUserCart>(apiURL);
});

export const addCartItem: (item: ICartItem) => AppThunk = item => async (dispatch, getState) => {
  const { isAuthenticated } = getState().authentication;
  const { variantId, quantity } = item;

  const { items } = getState().cart;
  const existingItem = items.find(i => i.variantId === variantId);

  if (isAuthenticated) {
    try {
      await dispatch(
        saveAccountCartItem({
          variantId,
          quantity: existingItem ? existingItem.quantity + quantity : 1,
        })
      );
    } catch (e) {
      return;
    }
  }

  if (existingItem) {
    dispatch(updateItemQuantity({ variantId, quantity: existingItem.quantity + quantity }));
  } else {
    dispatch(addItem(item));
  }
  dispatch(saveToLocal());
};

export const updateCartItem: ({ variantId, quantity }: { variantId: ICartItem['variantId']; quantity: number }) => AppThunk =
  ({ variantId, quantity }) =>
  async (dispatch, getState) => {
    const { isAuthenticated } = getState().authentication;

    if (isAuthenticated) {
      try {
        await dispatch(
          saveAccountCartItem({
            variantId,
            quantity,
          })
        );
      } catch (e) {
        return;
      }
    }
    if (quantity === 0) {
      dispatch(removeItem(variantId));
    } else {
      dispatch(updateItemQuantity({ variantId, quantity }));
    }
    dispatch(saveToLocal());
  };

export const removeCartItems: (deletedIds: ICartItem['variantId'][]) => AppThunk = deletedIds => async (dispatch, getState) => {
  const { isAuthenticated } = getState().authentication;
  if (isAuthenticated) {
    for (const id of deletedIds) {
      try {
        await dispatch(
          saveAccountCartItem({
            variantId: id,
            quantity: 0,
          })
        );
      } catch (e) {
        return;
      }
    }
  }
  dispatch(removeItems(deletedIds));
  dispatch(saveToLocal());
};

const saveAccountCartItem = createAsyncThunk(
  'cart/save_cart_item',
  async ({ variantId, quantity }: { variantId: ICartItem['variantId']; quantity: number }) => {
    const requestURL = `${apiURL}/item/${variantId}/${quantity}`;
    return axios.post(requestURL);
  },
  { serializeError: serializeAxiosError }
);

export const checkOutCart: (checkoutInfo: ICheckoutInit) => AppThunk = checkoutInfo => async (dispatch, getState) => {
  const { isAuthenticated } = getState().authentication;
  try {
    if (isAuthenticated) {
      await dispatch(
        checkOutAccountCart({
          checkoutInfo,
        })
      );
    } else {
      const items = getState().cart.items;
      const cartDetails: IUnAuthCheckoutInit['cartDetails'] = [];
      items.forEach(item => cartDetails.push({ variantId: item.variantId, quantity: item.quantity }));
      await dispatch(
        checkOutUnAuthUserCart({
          ...checkoutInfo,
          cartDetails,
        })
      );
    }
  } catch (e) {
    return;
  }
  dispatch(resetCart());
  dispatch(saveToLocal());
};

const checkOutAccountCart = createAsyncThunk(
  'cart/check_out_account',
  async ({ checkoutInfo }: { checkoutInfo: ICheckoutInit }) => {
    const requestURL = `${apiURL}/checkout`;
    return await axios.post<ICheckoutFinish>(requestURL, checkoutInfo);
  },
  {
    serializeError: serializeAxiosError,
  }
);

const checkOutUnAuthUserCart = createAsyncThunk(
  'cart/check_out_unauth',
  async (checkoutInfo: IUnAuthCheckoutInit) => {
    const requestURL = `/api/public/checkout`;
    return await axios.post<ICheckoutFinish>(requestURL, checkoutInfo);
  },
  {
    serializeError: serializeAxiosError,
  }
);

// Slice

export const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCart(state, action: PayloadAction<IUserCart['items']>) {
      if (action.payload) {
        state.items = action.payload;
      }
    },
    addItem(state, action: PayloadAction<ICartItem>) {
      state.items.push({ ...action.payload, quantity: 1 });
    },
    updateItemQuantity(state, action: PayloadAction<{ variantId: ICartItem['variantId']; quantity: number }>) {
      const { variantId, quantity } = action.payload;
      state.items.find(item => item.variantId === variantId).quantity = quantity;
    },
    removeItem(state, action: PayloadAction<ICartItem['variantId']>) {
      const variantId = action.payload;
      return {
        ...state,
        items: state.items.slice().filter(item => item.variantId !== variantId),
      };
    },
    removeItems(state, action: PayloadAction<ICartItem['variantId'][]>) {
      const deletedIds = action.payload;
      return {
        ...state,
        items: state.items.slice().filter(item => !deletedIds.includes(item.variantId)),
      };
    },
    clearAllItems(state) {
      state.items = [];
    },
    setShowAddItemNotification(state, action) {
      state.showAddItemNotification = action.payload;
    },
    saveToLocal(state) {
      if (state.storeMethod === 'local') {
        Storage.local.set('cart', state.items);
      }
    },
    resetCheckOutSuccessInfo(state) {
      state.checkOutSuccessInfo = null;
    },
    resetCart() {
      return {
        ...initialState,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAccountCart.fulfilled, (state, action) => {
        state.items = action.payload?.data?.items;
        state.storeMethod = 'persistence';
        Storage.local.remove('cart');
      })
      .addMatcher(isPending(getAccountCart, saveAccountCartItem, checkOutAccountCart, checkOutUnAuthUserCart), state => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(checkOutAccountCart, checkOutUnAuthUserCart), (state, action) => {
        state.checkOutSuccessInfo = action.payload.data;
      })
      .addMatcher(isFulfilled(getAccountCart, saveAccountCartItem, checkOutAccountCart, checkOutUnAuthUserCart), state => {
        state.loading = false;
      })
      .addMatcher(isRejected(getAccountCart, saveAccountCartItem, checkOutAccountCart, checkOutUnAuthUserCart), (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const {
  updateCart,
  addItem,
  updateItemQuantity,
  removeItem,
  removeItems,
  clearAllItems,
  setShowAddItemNotification,
  saveToLocal,
  resetCart,
} = CartSlice.actions;

export default CartSlice.reducer;
