import { AnyAction, AsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

/**
 * Model for redux actions with pagination
 */
export type IQueryParams = { query?: string; page?: number; size?: number; sort?: string };

/**
 * Useful types for working with actions
 */
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
export type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

export function isSliceRejectedAction(sliceName: string) {
  return (action: AnyAction) => action.type.startsWith(sliceName + '/') && isAnyRejectedAction(action);
}

export function isSlicePendingAction(sliceName: string) {
  return (action: AnyAction) => action.type.startsWith(sliceName + '/') && isAnyPendingAction(action);
}

export function isSliceFulfilledAction(sliceName: string) {
  return (action: AnyAction) => action.type.startsWith(sliceName + '/') && isAnyFulfilledAction(action);
}

/**
 * Check if the async action type is rejected
 */
export function isAnyRejectedAction(action: AnyAction) {
  return action.type.endsWith('/rejected');
}

/**
 * Check if the async action type is pending
 */
export function isAnyPendingAction(action: AnyAction) {
  return action.type.endsWith('/pending');
}

/**
 * Check if the async action type is completed
 */
export function isAnyFulfilledAction(action: AnyAction) {
  return action.type.endsWith('/fulfilled');
}

const commonErrorProperties: Array<keyof SerializedError> = ['name', 'message', 'stack', 'code'];

/**
 * serialize function used for async action errors,
 * since the default function from Redux Toolkit strips useful info from axios errors
 */
export const serializeAxiosError = (value: any): AxiosError | SerializedError => {
  if (typeof value === 'object' && value !== null) {
    if (value.isAxiosError) {
      return value;
    } else {
      const simpleError: SerializedError = {};
      for (const property of commonErrorProperties) {
        if (typeof value[property] === 'string') {
          simpleError[property] = value[property];
        }
      }

      return simpleError;
    }
  }
  return { message: String(value) };
};
