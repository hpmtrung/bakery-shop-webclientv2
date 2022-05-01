import axios from 'axios';
import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'src/app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  resetPasswordInitSuccess: false,
  resetPasswordFinishSuccess: false,
  message: null,
};

export type PasswordResetState = Readonly<typeof initialState>;

const apiUrl = 'api/reset-password';
// Actions

export const handlePasswordResetInit = createAsyncThunk(
  'passwordReset/reset_password_init',
  // If the content-type isn't set that way, axios will try to encode the body and thus modify the data sent to the server.
  async (mail: string) => axios.post(`${apiUrl}/init`, mail, { headers: { ['Content-Type']: 'text/plain' } }),
  { serializeError: serializeAxiosError }
);

export const handlePasswordResetFinish = createAsyncThunk(
  'passwordReset/reset_password_finish',
  async (data: { key: string; newPassword: string }) => axios.post(`${apiUrl}/finish`, data),
  { serializeError: serializeAxiosError }
);

export const PasswordResetSlice = createSlice({
  name: 'passwordReset',
  initialState: initialState as PasswordResetState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(handlePasswordResetInit.fulfilled, () => ({
        ...initialState,
        loading: false,
        resetPasswordInitSuccess: true,
        message: 'reset.request.messages.success',
      }))
      .addCase(handlePasswordResetFinish.fulfilled, () => ({
        ...initialState,
        loading: false,
        resetPasswordFinishSuccess: true,
        message: 'reset.finish.messages.success',
      }))
      .addCase(handlePasswordResetInit.rejected, (state, action) => {
        state.loading = false;
        state.resetPasswordInitSuccess = false;
        state.message = action.error.message;
      })
      .addCase(handlePasswordResetFinish.rejected, (state, action) => {
        state.loading = false;
        state.resetPasswordFinishSuccess = false;
        state.message = action.error.message;
      })
      .addMatcher(isPending(handlePasswordResetInit, handlePasswordResetFinish), state => {
        state.loading = true;
        state.resetPasswordInitSuccess = false;
        state.resetPasswordFinishSuccess = false;
        state.message = null;
      });
  },
});

export const { reset } = PasswordResetSlice.actions;

// Reducer
export default PasswordResetSlice.reducer;
