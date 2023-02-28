/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useMemo } from 'react';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState, useAppDispatch, useAppSelector } from './store';
import { useGetAssets } from '~/graphqls/useGetAssets';
import { Asset } from '~/types/assets.type';
import { useDeleteAssets } from '~/graphqls/useDeleteAssets';

const adapter = createEntityAdapter<Asset>({
  selectId: (asset) => asset.uuid,
});

const selectors = adapter.getSelectors<RootState>(state => state.assets);

export const assetsSlice = createSlice({
  name: 'assets',
  initialState: adapter.getInitialState({ 
    page: 0,
    loading: true,
    success: false,
    error: false
  }),
  reducers: {
    addAll: adapter.setAll,
    update: adapter.updateOne,
    setLoading: (state) => {
      state.loading = true;
      state.success = false;
      state.error = false;
    },
    setSuccess: (state) => {
      state.success = true;
      state.loading = false;
    },
    setError: (state) => {
      state.error = true;
      state.loading = false;
    }
  }
});

export function useAssets() {

  const dispatch = useAppDispatch();
  const getAssets = useGetAssets();
  const deleteAssets = useDeleteAssets();

  const getAll = useCallback(() =>
    useAppSelector(state => ({ ...state.assets, entities: selectors.selectAll(state) }))
  , []);

  const fetchAll = useCallback(async () => {
    try {
      dispatch(assetsSlice.actions.setLoading());
      dispatch(assetsSlice.actions.addAll(await getAssets()));
      dispatch(assetsSlice.actions.setSuccess());
    } catch (err: any) {
      dispatch(assetsSlice.actions.setError());
    }
  }, [getAssets, dispatch]);

  const deleteOne = useCallback(async (id: string) => {
    dispatch(assetsSlice.actions.update({ id, changes: { status: 'DELETING' } }))
    await deleteAssets([id]);
  }, [deleteAssets, dispatch]);
  
  return useMemo(() => ({
    getAll,
    fetchAll,
    deleteOne
  }), [getAll, fetchAll, deleteOne]);
}
