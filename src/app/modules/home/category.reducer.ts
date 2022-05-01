import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICategory } from 'src/app/modules/home/model/category.model';
import { IProduct } from 'src/app/modules/home/model/product.model';
import axios from 'axios';

export interface CategoryState {
  loading: boolean;
  errorMessage: string | null | undefined;
  categories: ReadonlyArray<ICategory>;
  showProductDetalDialog: boolean;
  selectedProductId: IProduct['id'];
}

const initialState: CategoryState = {
  loading: false,
  errorMessage: null,
  categories: [],
  showProductDetalDialog: false,
  selectedProductId: -1,
};

// Actions

export const getAllCategories = createAsyncThunk('category/get_all_categories', async () => {
  const requestURL = '/api/public/categories';
  return axios.get<ICategory[]>(requestURL);
});

// Slice

export const CategorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setShowProductDetailDialog(state, action: PayloadAction<{ show: boolean; productId?: IProduct['id'] }>) {
      const { show, productId } = action.payload;
      state.showProductDetalDialog = show;
      if (productId) state.selectedProductId = productId;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllCategories.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      });
  },
});

// Reducer

export const { setShowProductDetailDialog } = CategorySlice.actions;

export default CategorySlice.reducer;
