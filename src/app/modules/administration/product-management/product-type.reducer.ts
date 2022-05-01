import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { IProductType } from './model';

interface ProductTypeState {
  loading: boolean;
  errorMessage: string | null;
  productTypes: IProductType[];
}

const initialState: ProductTypeState = {
  loading: false,
  errorMessage: null,
  productTypes: [],
};

// Actions

export const getAllProductTypes = createAsyncThunk('product_type/get_all', async () => {
  return axios.get<IProductType[]>('/api/public/product-types');
});

const ProductTypeSlice = createSlice({
  name: 'product_type',
  initialState,
  reducers: {
    reset() {
      return { ...initialState };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllProductTypes.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getAllProductTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.productTypes = action.payload.data;
      })
      .addCase(getAllProductTypes.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset } = ProductTypeSlice.actions;

export default ProductTypeSlice.reducer;
