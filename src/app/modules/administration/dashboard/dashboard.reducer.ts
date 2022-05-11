import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { IAdminDashboard } from './dashboard.model';

interface DashboardState {
  loading: boolean;
  data: IAdminDashboard;
  errorMessage: string | null;
}

const initialState: DashboardState = {
  loading: true,
  data: null,
  errorMessage: null,
};

const apiURL = '/api/admin/home';

// Actions
export const getDashboardData = createAsyncThunk('dashboard/get_data', async () => {
  return axios.get<IAdminDashboard>(apiURL);
});

// Slice
export const DashboardSlice = createSlice({
  name: 'dashboard',
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
      .addCase(getDashboardData.pending, state => {
        state.loading = true;
        state.data = null;
        state.errorMessage = null;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset } = DashboardSlice.actions;

export default DashboardSlice.reducer;
