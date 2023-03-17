/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from 'react';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, useAppDispatch, useAppSelector } from './store';
import { useGetAssets } from '~/graphqls/useGetAssets';
import { Asset } from '~/types/assets.type';
import { useDeleteAssets } from '~/graphqls/useDeleteAssets';
import { useGetAsset } from '~/graphqls/useGetAsset';
import { toSeconds } from '~/utils/toSeconds';

const adapter = createEntityAdapter<Asset>({ selectId: (asset) => asset.uuid });
const selectors = adapter.getSelectors<RootState>(state => state.assets);

interface State {
  page: number;
  loading: boolean;
  success: boolean;
  error: boolean;
  selectedIds: string[];
}

export const assetsSlice = createSlice({
  name: 'assets',
  initialState: adapter.getInitialState<State>({ 
    page: 0,
    loading: true,
    success: false,
    error: false,
    selectedIds: []
  }),
  reducers: {

    update(state, action: PayloadAction<Partial<Asset>>) {
      adapter.updateOne(state, {
        id: action.payload.uuid!,
        changes: {
          ...action.payload,
          inferenceData: processInferenceData(action.payload.inferenceData)
        }
      })
    },

    add(state, action: PayloadAction<Asset>) {
      adapter.upsertOne(state, {
        ...action.payload,
        selected: false,
        inferenceData: processInferenceData(action.payload.inferenceData)
      });
    },

    addAll(state, action: PayloadAction<Asset[]>) {
      adapter.setAll(state, action.payload.map(asset => ({
        ...asset, 
        selected: state.selectedIds.find(id => id === asset.uuid) !== undefined,
        inferenceData: processInferenceData(asset.inferenceData)
      })));
    },
    
    setLoading(state) {
      state.loading = true;
      state.success = false;
      state.error = false;
    },
    
    setSuccess(state) {
      state.success = true;
      state.loading = false;
    },

    setError(state) {
      state.error = true;
      state.loading = false;
    },

    select(state, action: PayloadAction<{ id: string, selected: boolean}>) {

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

    unSelectedAll(state) {

      Object.values(state.entities).forEach(asset => {
        asset!.selected = false;
      });

      state.selectedIds = [];
    },
    
    selectClip(state, action: PayloadAction<{ assetId: string, clipId: string }>) {
      const asset = state.entities[action.payload.assetId];
      const clips = asset?.inferenceData?.analysis.clips;
      const clip = clips?.find(clip => clip.uuid === action.payload.clipId);
      if (clip) clip.selected = true;
    },

    selectFirstClip(state, action: PayloadAction<string>) {
      const asset = state.entities[action.payload];
      const clip = asset?.inferenceData?.analysis.clips[0];
      if (clip) clip.selected = true;
    },
    
    unSelectClip(state, action: PayloadAction<string>) {
      const asset = state.entities[action.payload];
      const clips = asset?.inferenceData?.analysis.clips;
      const clip = clips?.find(clip => clip.selected);
      if (clip) clip.selected = false;
    }
  }
});

export function useAssets() {

  const dispatch = useAppDispatch();
  const getAssets = useGetAssets();
  const getAsset = useGetAsset();
  const deleteAssets = useDeleteAssets();
  
  return useMemo(() => ({

    getAll() {
      return useAppSelector(state => ({ ...state.assets, entities: selectors.selectAll(state) }));
    },

    getById(id?: string) {
      if (id) {
        return useAppSelector(state => selectors.selectById(state, id));
      }
    },
    
    areSelected() {
      return useAppSelector(state => state.assets.selectedIds.length !== 0);
    },
    
    getSelectedIds() {
      return useAppSelector(state => state.assets.selectedIds);
    },

    getClip(assetId: string) {
      return useAppSelector(state => {
        const asset = state.assets.entities[assetId];
        const clips = asset?.inferenceData?.analysis.clips;
        return clips?.find(clip => clip.selected);
      });
    },
    
    select(id: string, selected: boolean) {
      dispatch(assetsSlice.actions.select({ id, selected }));
    },
    
    unSelectAll() {
      dispatch(assetsSlice.actions.unSelectedAll());
    },

    selectClip(assetId: string, clipId: string) {
      dispatch(assetsSlice.actions.unSelectClip(assetId));
      dispatch(assetsSlice.actions.selectClip({ assetId, clipId }));
    },

    selectFirstClip(assetId: string) {
      dispatch(assetsSlice.actions.unSelectClip(assetId));
      dispatch(assetsSlice.actions.selectFirstClip(assetId));
    },

    unSelectClip(assetId: string) {
      dispatch(assetsSlice.actions.unSelectClip(assetId));
    },

    update(id: string, changes: Partial<Asset>) {
      dispatch(assetsSlice.actions.update({ uuid: id, ...changes }));
    },
    
    async fetchAll(name?: string) {
      try {
        dispatch(assetsSlice.actions.setLoading());
        dispatch(assetsSlice.actions.addAll(await getAssets(name)));
        dispatch(assetsSlice.actions.setSuccess());
      } catch (err: any) {
        dispatch(assetsSlice.actions.setError());
      }
    },

    async fetchOne(id: string) {
      dispatch(assetsSlice.actions.add(await getAsset(id)));
    },

    async deleteOne(id: string) {
      dispatch(assetsSlice.actions.update({ uuid: id, status: 'DELETING' }));
      await deleteAssets([id]);
    },
    
    async deleteMany(ids: string[]) {
      ids.forEach(uuid => dispatch(assetsSlice.actions.update({ uuid, status: 'DELETING' })));
      await deleteAssets(ids);
      dispatch(assetsSlice.actions.unSelectedAll());
    }
  }), []);
}

function processInferenceData(inferenceData: Asset['inferenceData']): Asset['inferenceData'] {
  if (inferenceData) {
    return {
      analysis: {
        ...inferenceData.analysis,
        clips: inferenceData.analysis.clips.map(clip => {
          return {
            ...clip,
            startTime: toSeconds(clip.startTime as any),
            endTime: toSeconds(clip.endTime as any),
            duration: toSeconds(clip.duration as any),
            selected: false
          }
        })
      }
    }
  }
}
