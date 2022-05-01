import thunk from 'redux-thunk';
import axios from 'axios';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import register, { handleSignUp, reset } from './sign-up.reducer';
import TranslatorContext from 'src/app/shared/language/translator-context';

describe('Creating account tests', () => {
  const initialState = {
    loading: false,
    registrationSuccess: false,
    registrationFailure: false,
    errorMessage: null,
    successMessage: null,
  };

  beforeAll(() => {
    TranslatorContext.registerTranslations('vi', {});
  });

  it('should return the initial state', () => {
    expect(register(undefined, { type: '' })).toEqual({
      ...initialState,
    });
  });

  it('should detect a request', () => {
    expect(register(undefined, { type: handleSignUp.pending.type })).toEqual({
      ...initialState,
      loading: true,
    });
  });

  // it('should handle RESET', () => {
  //   expect(
  //     register({ loading: true, signUpSuccess: true, signUpFailure: true, errorMessage: '', successMessage: '' }, reset())
  //   ).toEqual({
  //     ...initialState,
  //   });
  // });

  it('should handle CREATE_ACCOUNT success', () => {
    expect(
      register(undefined, {
        type: handleSignUp.fulfilled.type,
        payload: 'fake payload',
      })
    ).toEqual({
      ...initialState,
      registrationSuccess: true,
      successMessage: 'register.messages.success',
    });
  });

  it('should handle CREATE_ACCOUNT failure', () => {
    const error = { message: 'fake error' };
    expect(
      register(undefined, {
        type: handleSignUp.rejected.type,
        error,
      })
    ).toEqual({
      ...initialState,
      registrationFailure: true,
      errorMessage: error.message,
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore({});
      axios.post = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches CREATE_ACCOUNT_PENDING and CREATE_ACCOUNT_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: handleSignUp.pending.type,
        },
        {
          type: handleSignUp.fulfilled.type,
          payload: resolvedObject,
        },
      ];
      // await store.dispatch(handleSignUp({ login: '', email: '', password: '' }));
      // expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      // expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
    });
    it('dispatches RESET actions', async () => {
      await store.dispatch(reset());
      expect(store.getActions()[0]).toMatchObject(reset());
    });
  });
});
