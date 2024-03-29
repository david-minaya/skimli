import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { accountSlice } from './account.slice';
import { assetsSlice } from './assets.slice';
import { assetMedias } from './assetMedias.slice';
import { editClipPage } from './editClipPage.slice';
import { conversionsSlice } from './conversions.slice';

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    conversions: conversionsSlice.reducer,
    assets: assetsSlice.reducer,
    assetMedias: assetMedias.reducer,
    editClipPage: editClipPage.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
