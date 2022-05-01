import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { ICategory } from 'src/app/modules/home/model/category.model';
import { defaultValue, IProduct } from 'src/app/modules/home/model/product.model';
import { IQueryParams } from 'src/app/shared/reducers/reducer.utils';
import { loadMoreDataWhenScrolled } from 'src/app/shared/util/pagination-utils';
import { parseHeaderForLinks } from 'src/app/shared/util/url-utils';
import axios from 'axios';

const initialState = {
  loading: false,
  errorMessage: null,
  products: [],
  product: defaultValue,
  links: { next: 0 },
  totalItems: 0,
  productsNotFound: false,
};

// Actions

export const getProductsOfCategory = createAsyncThunk(
  'product/get_products_of_category',
  async ({ categoryId, params: { page, size } }: { categoryId: ICategory['id']; params?: IQueryParams }) => {
    const requestUrl = `/api/public/categories/${categoryId}/products${page !== undefined && `?page=${page}&size=${size}`}`;
    return axios.get<IProduct[]>(requestUrl);
  }
);

export const ProductSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isPending(getProductsOfCategory), state => {
        state.loading = true;
        state.errorMessage = null;
        state.productsNotFound = false;
      })
      .addMatcher(isFulfilled(getProductsOfCategory), (state, action) => {
        const { data, headers } = action.payload;
        const links = parseHeaderForLinks(headers.link);
        const totalItems = parseInt(headers['x-total-count'], 10);
        return {
          ...state,
          loading: false,
          links,
          products: loadMoreDataWhenScrolled(state.products, data, links),
          totalItems,
          productsNotFound: totalItems === 0,
        };
      })
      .addMatcher(isRejected(getProductsOfCategory), (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

// Reducers
export const { reset } = ProductSlice.actions;

export default ProductSlice.reducer;
