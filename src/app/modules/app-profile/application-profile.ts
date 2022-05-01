import axios from 'axios';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'src/app/shared/reducers/reducer.utils';

const initialState = {
  inProduction: true,
  isOpenAPIEnabled: false,
};

export type ApplicationProfileState = Readonly<typeof initialState>;

export const getAppProfile = createAsyncThunk('applicationProfile/get_profile', async () => axios.get<any>('management/info'), {
  serializeError: serializeAxiosError,
});

export const ApplicationProfileSlice = createSlice({
  name: 'applicationProfile',
  initialState: initialState as ApplicationProfileState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAppProfile.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.inProduction = data.activeProfiles.includes('prod');
      state.isOpenAPIEnabled = data.activeProfiles.includes('api-docs');
    });
  },
});

// Reducer
export default ApplicationProfileSlice.reducer;
