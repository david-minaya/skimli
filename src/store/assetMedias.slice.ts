import { useMemo } from 'react';
import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState, useAppDispatch, useAppSelector } from './store';
import { AssetMedia } from '~/types/assetMedia.type';
import { useGetAssetMedias } from '~/graphqls/useGetAssetMedias';
import { useDeleteMedia } from '~/graphqls/useDeleteMedia';

const adapter = createEntityAdapter<AssetMedia>({ 
  selectId: (assetMedia) => assetMedia.uuid,
  sortComparer: (m1, m2) => Date.parse(m2.createdAt) - Date.parse(m1.createdAt)
});

const selectors = adapter.getSelectors<RootState>(state => state.assetMedias);

interface State {
  loading: boolean;
  success: boolean;
  error: boolean;
  selectedIds: string[];
}

export const slice = createSlice({
  name: 'assetMedias',
  initialState: adapter.getInitialState<State>({ 
    loading: true,
    success: false,
    error: false,
    selectedIds: []
  }),
  reducers: {

    add(state, action: PayloadAction<AssetMedia>) {
      adapter.upsertOne(state, { ...action.payload, selected: false });
    },

    addMany(state, action: PayloadAction<AssetMedia[]>) {
      adapter.upsertMany(state, action.payload.map(assetMedia => ({
        ...assetMedia,
        selected: state.selectedIds.find(id => id === assetMedia.uuid) !== undefined,
      })));
    },

    addAll(state, action: PayloadAction<AssetMedia[]>) {
      adapter.setAll(state, action.payload.map(assetMedia => ({
        ...assetMedia,
        selected: state.selectedIds.find(id => id === assetMedia.uuid) !== undefined,
      })));
    },

    update(state, action: PayloadAction<Partial<AssetMedia>>) {
      adapter.updateOne(state, { id: action.payload.uuid!, changes: action.payload });
    },

    select(state, action: PayloadAction<{ id: string, selected: boolean}>) {

      const assetMedia = state.entities[action.payload.id];

      if (assetMedia) {
        
        assetMedia.selected = action.payload.selected;

        if (action.payload.selected) {
          state.selectedIds.push(action.payload.id);
        } else {
          state.selectedIds = state.selectedIds.filter(id => id !== action.payload.id);
        }
      }
    },

    unSelectedAll(state) {
      Object.values(state.entities).forEach(assetMedia => { assetMedia!.selected = false; });
      state.selectedIds = [];
    },

    delete(state, action: PayloadAction<string>) {
      adapter.removeOne(state, action.payload);
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
  }
});

export function useAssetMedias() {

  const dispatch = useAppDispatch();
  const getAssetMedias = useGetAssetMedias();
  const deleteMedia = useDeleteMedia();
  
  return useMemo(() => ({

    getAll() {
      return useAppSelector(state => ({ ...state.assetMedias, entities: selectors.selectAll(state)}));
    },

    get<T>(query: { name?: string, type?: AssetMedia['type'] }) {
      return useAppSelector(state => 
        selectors.selectAll(state)
          .filter(media => query.type ? media.type === query.type : true)
          .filter(media => media.name.includes(query.name || ''))
      ) as T[];
    },

    getById(id: string) {
      return useAppSelector(state => selectors.selectById(state, id));
    },
    
    areSelected() {
      return useAppSelector(state => state.assetMedias.selectedIds.length !== 0);
    },
    
    getSelectedIds() {
      return useAppSelector(state => state.assetMedias.selectedIds);
    },

    select(id: string, selected: boolean) {
      dispatch(slice.actions.select({ id, selected }));
    },
    
    unSelectAll() {
      dispatch(slice.actions.unSelectedAll());
    },

    add(media: AssetMedia) {
      dispatch(slice.actions.add(media));
    },

    addMany(media: AssetMedia[]) {
      dispatch(slice.actions.addMany(media));
    },

    update(id: string, changes: Partial<AssetMedia>) {
      dispatch(slice.actions.update({ uuid: id, ...changes }));
    },

    async fetchAll(name?: string) {
      try {
        dispatch(slice.actions.setLoading());
        const medias = await getAssetMedias({ name });
        dispatch(slice.actions.addAll(medias.filter(media => media.type === 'IMAGE' || media.type === 'AUDIO')));
        dispatch(slice.actions.setSuccess());
      } catch (err: any) {
        dispatch(slice.actions.setError());
      }
    },

    async deleteOne(id: string) {
      await deleteMedia(id);
      dispatch(slice.actions.delete(id));
    },
    
    async deleteMany(ids: string[]) {
      for (const id of ids) {
        await deleteMedia(id);
        dispatch(slice.actions.delete(id));
      }
    }
  }), []);
}

export const assetMedias = slice;
