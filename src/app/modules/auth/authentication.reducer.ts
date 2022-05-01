import { createAsyncThunk, createSlice, isPending, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from 'src/app/config/store';
import { getAccountCart } from 'src/app/modules/checkout/checkout.reducer';
import { IUserAccount } from 'src/app/modules/auth/model/account.model';
import { setLocale } from 'src/app/shared/reducers/locale';
import { serializeAxiosError } from 'src/app/shared/reducers/reducer.utils';
import { Storage } from 'src/app/shared/util/storage-utils';
import axios, { AxiosResponse } from 'axios';
import { isEmpty } from 'lodash';

const AUTH_TOKEN_KEY = 'jhi-authenticationToken';

export const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  showModalLogin: false,
  account: {} as IUserAccount,
  errorMessage: null as unknown as string, // Errors returned from server side
  redirectMessage: null as unknown as string,
  sessionHasBeenFetched: false,
  logoutURL: null as unknown as string,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Actions

export const getSession: () => AppThunk = () => async (dispatch, getState) => {
  await dispatch(getAccount());

  const { account } = getState().authentication;

  if (!isEmpty(account)) {
    dispatch(getAccountCart());
    if (account.langKey) {
      const langKey = Storage.session.get('locale', account.langKey);
      dispatch(setLocale(langKey));
    }
  }
};

export const getAccount = createAsyncThunk('authentication/get_account', async () => axios.get<IUserAccount>('api/account'), {
  serializeError: serializeAxiosError,
});

interface IAuthParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const authenticate = createAsyncThunk(
  'authentication/login',
  // async (auth: IAuthParams) => axios.post<any>('api/authenticate', auth),
  async (auth: IAuthParams) => axios.post('api/authenticate', auth),
  {
    serializeError: serializeAxiosError,
  }
);

export const login: (email: string, password: string, rememberMe?: boolean) => AppThunk =
  (email, password, rememberMe = false) =>
  async dispatch => {
    const result = await dispatch(authenticate({ email, password, rememberMe }));
    const response = result.payload as AxiosResponse;
    const bearerToken = response?.headers?.authorization;
    if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
      const jwt = bearerToken.slice(7, bearerToken.length);
      if (rememberMe) {
        Storage.local.set(AUTH_TOKEN_KEY, jwt);
      } else {
        Storage.session.set(AUTH_TOKEN_KEY, jwt);
      }
    }
    dispatch(getSession());
  };

/**
 * Clear expired authentication token
 */
export const clearAuthToken = () => {
  if (Storage.local.get(AUTH_TOKEN_KEY)) {
    Storage.local.remove(AUTH_TOKEN_KEY);
  }
  if (Storage.session.get(AUTH_TOKEN_KEY)) {
    Storage.session.remove(AUTH_TOKEN_KEY);
  }
};

export const logout: () => AppThunk = () => dispatch => {
  clearAuthToken();
  dispatch(logoutSession());
};

export const clearAuthentication = messageKey => dispatch => {
  clearAuthToken();
  dispatch(authError(messageKey));
  dispatch(clearAuth());
};

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState: initialState as AuthenticationState,
  reducers: {
    logoutSession() {
      return {
        ...initialState,
        showModalLogin: true, // show login modal after logout
      };
    },
    authError(state, action) {
      return {
        ...state,
        // showModalLogin: true,
        redirectMessage: action.payload,
      };
    },
    clearAuth(state) {
      return {
        ...state,
        loading: false,
        // showModalLogin: true,
        isAuthenticated: false,
      };
    },
    setShowModalLogin(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        showModalLogin: action.payload,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(authenticate.rejected, (state, action) => ({
        ...initialState,
        errorMessage: action.error.message,
        showModalLogin: true,
        loginError: true,
      }))
      .addCase(authenticate.fulfilled, state => ({
        ...state,
        isAuthenticated: true,
        loading: false,
        loginError: false,
        showModalLogin: false,
        loginSuccess: true,
      }))
      .addCase(getAccount.rejected, (state, action) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
        // showModalLogin: true,
        // showModalLogin: false,
        errorMessage: action.error.message,
      }))
      .addCase(getAccount.fulfilled, (state, action) => {
        const isAuthenticated = action.payload?.data?.activated;
        const account = action.payload.data;
        if (account && !account.address) {
          account.address = '';
        }
        return {
          ...state,
          isAuthenticated,
          loading: false,
          sessionHasBeenFetched: true,
          account,
        };
      })
      .addMatcher(isPending(authenticate, getAccount), state => {
        state.loading = true;
      });
    // .addCase(authenticate.pending, state => {
    // })
    // .addCase(getAccount.pending, state => {
    //   state.loading = true;
    // });
  },
});

export const { logoutSession, authError, clearAuth, setShowModalLogin } = AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;
