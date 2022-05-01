import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { AppThunk } from 'src/app/config/store';
import { getSession } from 'src/app/modules/auth/authentication.reducer';
import { IUserAccount } from 'src/app/modules/auth/model/account.model';
import { serializeAxiosError } from 'src/app/shared/reducers/reducer.utils';
import { Storage } from 'src/app/shared/util/storage-utils';
import axios from 'axios';

const initialState = {
  loading: false,
  errorMessage: null,
  successMessage: null,
  updateSuccess: false,
  updateFailure: false,
};

export type SettingsState = Readonly<typeof initialState>;

// Actions
const apiURL = 'api/account';

export const saveAccountSettings: ({ account, formData }: { account: IUserAccount; formData?: FormData }) => AppThunk =
  ({ account, formData }) =>
  dispatch => {
    const promises = [];

    if (formData) {
      promises.push(dispatch(saveAccountImage(formData)));
    }

    promises.push(dispatch(saveAccountInfo(account)));

    Promise.all(promises).then(() => {
      if (Storage.session.get(`locale`)) {
        Storage.session.remove(`locale`);
      }

      // Refresh
      dispatch(getSession());
    });
  };

export const saveAccountInfo = createAsyncThunk(
  'settings/save_account_info',
  async (account: IUserAccount) => axios.put(`${apiURL}/info`, account),
  {
    serializeError: serializeAxiosError,
  }
);

export const saveAccountImage = createAsyncThunk(
  'settings/save_account_image',
  async (formData: FormData) => axios.put(`${apiURL}/image`, formData),
  {
    serializeError: serializeAxiosError,
  }
);

export const SettingsSlice = createSlice({
  name: 'settings',
  initialState: initialState as SettingsState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isPending(saveAccountInfo, saveAccountImage), state => {
        state.loading = true;
        state.errorMessage = null;
        state.updateSuccess = false;
      })
      .addMatcher(isFulfilled(saveAccountInfo, saveAccountImage), state => {
        state.loading = false;
        state.updateSuccess = true;
        state.updateFailure = false;
        state.successMessage = 'settings.messages.success';
      })
      .addMatcher(isRejected(saveAccountInfo, saveAccountImage), (state, action) => {
        state.loading = false;
        state.updateFailure = true;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset } = SettingsSlice.actions;

// Reducer
export default SettingsSlice.reducer;
