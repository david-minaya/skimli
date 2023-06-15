import { useMemo } from 'react';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './store';

export const slice = createSlice({
  name: 'editClipPage',
  initialState: {
    renderingClip: false
  },
  reducers: {
    setRenderingClip: (state, action: PayloadAction<boolean>) => {
      state.renderingClip = action.payload;
    }
  }
});

export function useEditClipPage() {

  const dispatch = useAppDispatch();
  
  return useMemo(() => ({ 
    getRenderingClip () {
      return useAppSelector(state => state.editClipPage.renderingClip);
    }, 
    setRenderingClip(isRendering: boolean) {
      dispatch(slice.actions.setRenderingClip(isRendering));
    }
  }), []);
}

export const editClipPage = slice;
