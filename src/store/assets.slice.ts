/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useMemo } from 'react';
import { createEntityAdapter, createSlice, current, PayloadAction } from '@reduxjs/toolkit';
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
    error: false,
    selectedIds: [] as string[]
  }),
  reducers: {
    addAll: (state, action: PayloadAction<Asset[]>) => {
      
      console.log(current(state));

      const assets = action.payload.map(asset => {
        const selected = state.selectedIds.find(id => id === asset.uuid) !== undefined;
        return { ...asset, selected }
      });

      adapter.setAll(state, assets);
    },
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
    },
    select: (state, action: PayloadAction<{ id: string, selected: boolean}>) => {

      const asset = state.entities[action.payload.id];

      if (asset) {
        
        asset.selected = action.payload.selected;

        if (action.payload.selected) {
          state.selectedIds.push(action.payload.id);
        } else {
          state.selectedIds = state.selectedIds.filter(id => id !== action.payload.id);
        }
      }
    },
    unSelectedAll: (state) => {

      Object.values(state.entities).forEach(asset => {
        asset!.selected = false;
      });

      state.selectedIds = [];
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

  const areSelected = useCallback(() => {
    return useAppSelector(state => state.assets.selectedIds.length !== 0)
  }, []);

  const getSelectedIds = useCallback(() => {
    return useAppSelector(state => state.assets.selectedIds);
  }, [])

  const fetchAll = useCallback(async (name?: string) => {
    try {
      dispatch(assetsSlice.actions.setLoading());
      dispatch(assetsSlice.actions.addAll(await getAssets(name)));
      dispatch(assetsSlice.actions.setSuccess());
    } catch (err: any) {
      dispatch(assetsSlice.actions.setError());
    }
  }, [getAssets, dispatch]);

  const select = useCallback((id: string, selected: boolean) => {
    dispatch(assetsSlice.actions.select({ id, selected }));
  }, [dispatch]);

  const unSelectAll = useCallback(() => {
    dispatch(assetsSlice.actions.unSelectedAll())
  }, [dispatch]);

  const deleteOne = useCallback(async (id: string) => {
    dispatch(assetsSlice.actions.update({ id, changes: { status: 'DELETING' } }));
    await deleteAssets([id]);
  }, [deleteAssets, dispatch]);

  const deleteMany = useCallback(async (ids: string[]) => {

    ids.forEach(id => {
      dispatch(assetsSlice.actions.update({ id, changes: { status: 'DELETING' } }));
    });

    await deleteAssets(ids);

    dispatch(assetsSlice.actions.unSelectedAll());

  }, [deleteAssets, dispatch]);
  
  return useMemo(() => ({
    getAll,
    areSelected,
    getSelectedIds,
    fetchAll,
    select,
    unSelectAll,
    deleteOne,
    deleteMany
  }), [getAll, getSelectedIds, areSelected, fetchAll, select, unSelectAll, deleteOne, deleteMany]);
}
