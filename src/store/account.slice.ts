/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useMemo } from 'react';
import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './store';
import { Account } from '~/graphqls/schema/account.type';

export const accountSlice = createSlice({
  name: 'account',
  initialState: null as Account | null,
  reducers: {
    set: (state, action) => {
      return action.payload;
    }
  }
});

export function useAccount() {

  const dispatch = useAppDispatch();

  const get = useCallback(() => {
    return useAppSelector(state => state.account)
  }, []);

  const set = useCallback((account: Account) => {
    dispatch(accountSlice.actions.set(account))
  }, [dispatch]);
  
  return useMemo(() => ({ get, set }), [get, set]);
}
