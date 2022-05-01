import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'src/app/shared/reducers/reducer.utils';
import { IPasswordChange } from './model/password-change.model';

const initialState = {
  loading: false,
  errorMessage: null,
  successMessage: null,
  updateSuccess: false,
};

export type PasswordState = Readonly<typeof initialState>;

const apiUrl = 'api/account';

// Actions

export const savePassword = createAsyncThunk(
  'password/update_password',
  async (password: IPasswordChange) => axios.post(`${apiUrl}/change-password`, password),
  { serializeError: serializeAxiosError }
);

export const PasswordSlice = createSlice({
  name: 'password',
  initialState: initialState as PasswordState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(savePassword.pending, state => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
        state.updateSuccess = false;
      })
      .addCase(savePassword.fulfilled, state => {
        state.loading = false;
        state.updateSuccess = true;
        state.successMessage = 'password.messages.success';
      })
      .addCase(savePassword.rejected, state => {
        state.loading = false;
        state.errorMessage = 'password.messages.error';
      });
  },
});

export const { reset } = PasswordSlice.actions;

// Reducer
export default PasswordSlice.reducer;
