/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from 'react';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './store';
import { useGetConversions } from '~/graphqls/useGetConversions';

export const conversionsSlice = createSlice({
  name: 'conversions',
  initialState: {
    counter: 0,
    total: 0
  },
  reducers: {
    update(state, action: PayloadAction<{ counter: number, total: number }>) {
      return action.payload;
    }
  }
});

export function useConversions() {

  const dispatch = useAppDispatch();
  const getConversions = useGetConversions();
  
  return useMemo(() => ({

    get() {
      return useAppSelector(state => state.conversions);
    },

    async fetch() {

      try {
        
        const conversions = await getConversions();

        dispatch(conversionsSlice.actions.update({ 
          counter: conversions.conversions, 
          total: conversions.grantedConversions 
        }));

      } catch (err: any) {

        console.error('Error getting conversions');
      }
    }
  }), []);
}
