import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from 'src/app/config/store';
import { IQueryParams, serializeAxiosError } from 'src/app/shared/reducers/reducer.utils';
import { getTotalItemsFromHeaders } from 'src/app/shared/util/pagination-utils';
import axios, { AxiosResponse } from 'axios';
import { IAdminOverviewProduct, IAdminProduct, IAdminVariant, IProductImage } from './model';
import { cleanEntity } from 'src/app/shared/util/entity-utils';

interface ProductManagementState {
  productList: {
    status: 'idle' | 'loading' | 'inserting' | 'insertSucceed' | 'failed';
    errorMessage: string | null;
    products: IAdminOverviewProduct[];
    total: number;
  };
  selectedProduct: {
    status: 'idle' | 'loading' | 'updating' | 'updateSucceed' | 'failed';
    errorMessage: string | null;
    product: IAdminProduct;
    showDialog: boolean;
    variants: {
      status:
        | 'idle'
        | 'loading'
        | 'loaded'
        | 'inserting'
        | 'insertSucceed'
        | 'updating'
        | 'updateSucceed'
        | 'deleting'
        | 'deleteSucceed'
        | 'failed';
      errorMessage: string | null;
      variants: IAdminVariant[];
    };
    images: {
      status: 'idle' | 'loading' | 'loaded' | 'updating' | 'updateSucceed' | 'failed';
      errorMessage: string | null;
      images: IProductImage[];
    };
  };
}

const initialState: ProductManagementState = {
  productList: {
    status: 'idle',
    errorMessage: null,
    products: [],
    total: 0,
  },
  selectedProduct: {
    status: 'idle',
    errorMessage: null,
    product: null,
    showDialog: false,
    variants: {
      status: 'idle',
      errorMessage: null,
      variants: [],
    },
    images: {
      status: 'idle',
      errorMessage: null,
      images: [],
    },
  },
};

const apiURL = '/api/admin/products';
const SLICE_NAME = 'managed_products';

// Actions

export const getOverviewProducts = createAsyncThunk(`${SLICE_NAME}/get_overview_products`, async ({ page, size }: IQueryParams) => {
  return axios.get<IAdminOverviewProduct[]>(`${apiURL}/?page=${page}&size=${size}`);
});

export const showProductDetailDialog = createAsyncThunk(
  `${SLICE_NAME}/get_product_detail`,
  async (productId: IAdminOverviewProduct['id']) => {
    return axios.get<IAdminProduct>(`${apiURL}/${productId}`);
  }
);

export const getProductImages = createAsyncThunk(`${SLICE_NAME}/get_product_images`, async (productId: IAdminOverviewProduct['id']) => {
  return axios.get<IProductImage[]>(`${apiURL}/${productId}/images`);
});

export const insertProduct = createAsyncThunk(`${SLICE_NAME}/insert_product`, async (product: IAdminProduct) => {
  return axios.post(`${apiURL}`, product);
});

export const updateProduct: (product: IAdminProduct) => AppThunk = product => async (dispatch, getState) => {
  try {
    await dispatch(updateProductThunk(product));
    dispatch(updateSelectedProductReducer(product));

    const categories = getState().category.categories;

    dispatch(
      updateProductInProductList({
        id: product.id,
        categoryName: categories.find(category => category.id === product.categoryId).name,
        name: product.name,
        ingredients: product.ingredients,
      })
    );
  } catch (e) {
    console.error(e);
  }
};

export const updateProductThunk = createAsyncThunk(
  `${SLICE_NAME}/update_product`,
  async (product: IAdminProduct) => {
    return axios.put(`${apiURL}/info`, product);
  },
  { serializeError: serializeAxiosError }
);

export const getVariantsOfProduct = createAsyncThunk(`${SLICE_NAME}/get_variants`, async (productId: number) => {
  return axios.get<IAdminVariant[]>(`${apiURL}/variants/${productId}`);
});

export const insertVariant: (variant: IAdminVariant) => AppThunk = variant => async dispatch => {
  try {
    const result = await dispatch(insertVariantThunk(variant));
    dispatch(insertVariantReducer({ ...variant, id: (result.payload as AxiosResponse<IAdminVariant['id']>).data }));
    return result;
  } catch (e) {
    console.error(e);
  }
};

export const updateVariant: (variant: IAdminVariant) => AppThunk = variant => async dispatch => {
  try {
    await dispatch(updateVariantThunk(variant));
    dispatch(updateVariantReducer(variant));
  } catch (e) {
    console.error(e);
  }
};

export const insertVariantThunk = createAsyncThunk(`${SLICE_NAME}/insert_variant`, async (variant: IAdminVariant) => {
  return axios.post<IAdminVariant['id']>('/api/admin/variants', cleanEntity(variant));
});

const updateVariantThunk = createAsyncThunk(
  `${SLICE_NAME}/update_variant`,
  async (variant: IAdminVariant) => {
    return axios.put('/api/admin/variants', variant);
  },
  { serializeError: serializeAxiosError }
);

export const deleteVariant = createAsyncThunk(
  `${SLICE_NAME}/delete_variant`,
  async (variantId: IAdminVariant['id'], { dispatch }) => {
    const result = await axios.delete(`/api/admin/variants/${variantId}`);
    dispatch(deleteVariantReducer(variantId));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const addProductImages: (formData: FormData) => AppThunk = formData => async (dispatch, getState) => {
  try {
    const productId = getState().productManagement.selectedProduct.product.id;
    await dispatch(addProductImagesThunk({ productId, formData }));
    // refresh
    await dispatch(getProductImages(productId));
  } catch (e) {
    console.error(e);
  }
};

export const deleteProductImages: (deletedImageIds: number[]) => AppThunk = deletedImageIds => async (dispatch, getState) => {
  try {
    const productId = getState().productManagement.selectedProduct.product.id;
    await dispatch(deleteProductImagesThunk({ productId, deletedImageIds }));
    // refresh
    await dispatch(getProductImages(productId));
  } catch (e) {
    console.error(e);
  }
};

export const addProductImagesThunk = createAsyncThunk(
  `${SLICE_NAME}/add_images`,
  async ({ productId, formData }: { productId: number; formData: FormData }) => {
    return axios.post(`${apiURL}/${productId}/images`, formData);
  }
);

export const deleteProductImagesThunk = createAsyncThunk(
  `${SLICE_NAME}/delete_images`,
  async ({ productId, deletedImageIds }: { productId: number; deletedImageIds: number[] }) => {
    return axios.delete(`${apiURL}/${productId}/images`, { data: { deletedImageIds } });
  }
);

// Slice
const ManagedProductSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    reset() {
      return { ...initialState };
    },
    setStatusProductList(state, action: PayloadAction<ProductManagementState['productList']['status']>) {
      state.productList.status = action.payload;
    },
    setStatusSelectedProduct(state, action: PayloadAction<ProductManagementState['selectedProduct']['status']>) {
      state.selectedProduct.status = action.payload;
    },
    setStatusVariants(state, action: PayloadAction<ProductManagementState['selectedProduct']['variants']['status']>) {
      state.selectedProduct.variants.status = action.payload;
    },
    resetSelectedProductReducer(state) {
      state.selectedProduct = initialState.selectedProduct;
    },
    setShowProductDetailDialogReducer(state, action: PayloadAction<boolean>) {
      state.selectedProduct.showDialog = action.payload;
    },
    addProductReducer(state, action) {},
    updateProductInProductList(state, action: PayloadAction<IAdminOverviewProduct>) {
      const product = action.payload;
      const index = state.productList.products.findIndex(p => p.id === product.id);
      state.productList.products[index] = product;
    },
    updateSelectedProductReducer(state, action: PayloadAction<IAdminProduct>) {
      state.selectedProduct.product = action.payload;
    },
    deleteSelectedProductReducer(state, action) {},
    //
    insertVariantReducer(state, action: PayloadAction<IAdminVariant>) {
      state.selectedProduct.variants.variants.push(action.payload);
    },
    updateVariantReducer(state, action: PayloadAction<IAdminVariant>) {
      const variant = action.payload;
      const index = state.selectedProduct.variants.variants.findIndex(v => v.id === variant.id);
      state.selectedProduct.variants.variants[index] = variant;
    },
    deleteVariantReducer(state, action: PayloadAction<IAdminVariant['id']>) {
      const deletedId = action.payload;
      state.selectedProduct.variants.variants = state.selectedProduct.variants.variants.filter(variant => variant.id !== deletedId);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getOverviewProducts.pending, state => {
        state = initialState;
      })
      .addCase(getOverviewProducts.fulfilled, (state, action) => {
        const { headers, data } = action.payload;
        state.productList = {
          ...state.productList,
          status: 'idle',
          products: data,
          total: getTotalItemsFromHeaders(headers),
        };
      })
      //
      .addCase(showProductDetailDialog.pending, state => {
        state.selectedProduct = initialState.selectedProduct;
      })
      .addCase(showProductDetailDialog.fulfilled, (state, action) => {
        state.selectedProduct = {
          ...state.selectedProduct,
          status: 'idle',
          product: action.payload.data,
          showDialog: true,
        };
      })
      //
      .addCase(getProductImages.pending, state => {
        state.selectedProduct.images = { ...state.selectedProduct.images, status: 'loading' };
      })
      .addCase(getProductImages.fulfilled, (state, action) => {
        state.selectedProduct.images = {
          ...state.selectedProduct.images,
          status: 'loaded',
          images: action.payload.data,
        };
      })
      //
      .addCase(insertProduct.pending, state => {
        state.productList = { ...state.productList, status: 'inserting', errorMessage: null };
      })
      .addCase(insertProduct.fulfilled, state => {
        state.productList = { ...state.productList, status: 'insertSucceed' };
      })
      //
      .addCase(updateProductThunk.pending, state => {
        state.selectedProduct = { ...state.selectedProduct, status: 'updating', errorMessage: null };
      })
      .addCase(updateProductThunk.fulfilled, state => {
        state.selectedProduct = { ...state.selectedProduct, status: 'updateSucceed' };
      })
      //
      .addCase(getVariantsOfProduct.pending, state => {
        state.selectedProduct.variants = { ...state.selectedProduct.variants, status: 'loading' };
      })
      .addCase(getVariantsOfProduct.fulfilled, (state, action) => {
        state.selectedProduct.variants = {
          ...state.selectedProduct.variants,
          status: 'loaded',
          variants: action.payload.data,
        };
      })
      .addCase(getVariantsOfProduct.rejected, (state, action) => {
        state.selectedProduct.variants = {
          ...state.selectedProduct.variants,
          status: 'failed',
          errorMessage: action.error.message,
        };
      })
      //
      .addCase(insertVariantThunk.pending, state => {
        state.selectedProduct.variants = {
          ...state.selectedProduct.variants,
          status: 'inserting',
          errorMessage: null,
        };
      })
      .addCase(insertVariantThunk.fulfilled, state => {
        state.selectedProduct.variants = {
          ...state.selectedProduct.variants,
          status: 'insertSucceed',
        };
      })
      //
      .addCase(updateVariantThunk.pending, state => {
        state.selectedProduct.variants = {
          ...state.selectedProduct.variants,
          status: 'updating',
          errorMessage: null,
        };
      })
      .addCase(updateVariantThunk.fulfilled, state => {
        state.selectedProduct.variants = {
          ...state.selectedProduct.variants,
          status: 'updateSucceed',
        };
      })
      //
      .addCase(deleteVariant.pending, state => {
        state.selectedProduct.variants = {
          ...state.selectedProduct.variants,
          status: 'deleting',
          errorMessage: null,
        };
      })
      .addCase(deleteVariant.fulfilled, state => {
        state.selectedProduct.variants = {
          ...state.selectedProduct.variants,
          status: 'deleteSucceed',
        };
      })
      //
      .addMatcher(isPending(addProductImagesThunk, deleteProductImagesThunk), state => {
        state.selectedProduct.images = { ...state.selectedProduct.images, status: 'updating', errorMessage: null };
      })
      .addMatcher(isFulfilled(addProductImagesThunk, deleteProductImagesThunk), state => {
        state.selectedProduct.images = { ...state.selectedProduct.images, status: 'updateSucceed' };
      })
      //
      .addMatcher(isRejected(getOverviewProducts, insertProduct), (state, action) => {
        state.productList = { ...state.productList, status: 'failed', errorMessage: action.error.message };
      })
      .addMatcher(isRejected(showProductDetailDialog, updateProductThunk), (state, action) => {
        state.selectedProduct = { ...state.selectedProduct, status: 'failed', errorMessage: action.error.message };
      })
      .addMatcher(isRejected(updateVariantThunk, deleteVariant), (state, action) => {
        state.selectedProduct.variants = { ...state.selectedProduct.variants, status: 'failed', errorMessage: action.error.message };
      })
      .addMatcher(isRejected(getProductImages, addProductImagesThunk, deleteProductImagesThunk), (state, action) => {
        state.selectedProduct.images = { ...state.selectedProduct.images, status: 'failed', errorMessage: action.error.message };
      });
  },
});

export const {
  reset,
  setStatusProductList,
  setStatusSelectedProduct,
  setStatusVariants,
  resetSelectedProductReducer,
  setShowProductDetailDialogReducer,
  updateProductInProductList,
  updateSelectedProductReducer,
  insertVariantReducer,
  updateVariantReducer,
  deleteVariantReducer,
} = ManagedProductSlice.actions;
export default ManagedProductSlice.reducer;
