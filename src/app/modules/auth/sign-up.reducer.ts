import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'src/app/shared/reducers/reducer.utils';
import { IAccountSignUp } from './model/sign-up.model';

const initialState = {
  loading: false,
  signUpSuccess: false,
  message: null,
};

// Actions

export const handleSignUp = createAsyncThunk(
  'signUp/create_account',
  async (data: IAccountSignUp) => axios.post<any>('api/register', data),
  { serializeError: serializeAxiosError }
);

export const SignUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(handleSignUp.pending, state => {
        state.loading = true;
      })
      .addCase(handleSignUp.rejected, (state, action) => {
        state.loading = false;
        state.signUpSuccess = false;
        state.message = action.error.message;
      })
      .addCase(handleSignUp.fulfilled, state => {
        state.loading = false;
        state.signUpSuccess = true;
        state.message = 'register.messages.success';
      });
  },
});

export const { reset } = SignUpSlice.actions;

// Reducer
export default SignUpSlice.reducer;
