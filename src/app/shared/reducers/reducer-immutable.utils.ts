import { ActionReducerMapBuilder, createSlice, SliceCaseReducers, ValidateSliceCaseReducers } from '@reduxjs/toolkit';
import { isAnyRejectedAction } from './reducer.utils';

export interface ImmutableEntityState<T> {
  loading: boolean;
  errorMessage: string | null;
  entities: ReadonlyArray<T>;
  entity: T;
  links?: any;
  totalItems?: number;
}

export const createImmutableEntitySlice = <T, Reducers extends SliceCaseReducers<ImmutableEntityState<T>>>({
  name = '',
  initialState,
  reducers,
  extraReducers,
  skipRejectionHandling,
}: {
  name: string;
  initialState: ImmutableEntityState<T>;
  reducers?: ValidateSliceCaseReducers<ImmutableEntityState<T>, Reducers>;
  extraReducers?: (builder: ActionReducerMapBuilder<ImmutableEntityState<T>>) => void;
  skipRejectionHandling?: boolean;
}) => {
  return createSlice({
    name,
    initialState,
    reducers,
    extraReducers(builder) {
      extraReducers(builder);
      /*
       * Common rejection logic is handled here.
       * If you want to add your own rejcetion logic, pass `skipRejectionHandling: true`
       * while calling `createEntitySlice`
       * */
      if (!skipRejectionHandling) {
        builder.addMatcher(isAnyRejectedAction, (state, action) => {
          state.loading = false;
          state.errorMessage = action.error.message;
        });
      }
    },
  });
};
