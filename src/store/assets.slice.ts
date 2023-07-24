import * as Shotstack from "~/types/shotstack";
import { useMemo } from "react";
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState, store, useAppDispatch, useAppSelector } from "./store";
import { useGetAssets } from "~/graphqls/useGetAssets";
import { Asset } from "~/types/assets.type";
import { useDeleteAssets } from "~/graphqls/useDeleteAssets";
import { useGetAsset } from "~/graphqls/useGetAsset";
import { toSeconds } from "~/utils/toSeconds";
import { Clip } from "~/types/clip.type";
import { useGetClips } from "~/graphqls/useGetClips";
import { useUpdateTimeline } from "~/graphqls/useUpdateTimeline";

const adapter = createEntityAdapter<Asset>({ selectId: (asset) => asset.uuid });
const selectors = adapter.getSelectors<RootState>((state) => state.assets);

interface State {
  page: number;
  loading: boolean;
  success: boolean;
  error: boolean;
  selectedIds: string[];
}

export const assetsSlice = createSlice({
  name: "assets",
  initialState: adapter.getInitialState<State>({
    page: 0,
    loading: true,
    success: false,
    error: false,
    selectedIds: [],
  }),
  reducers: {
    update(state, action: PayloadAction<Partial<Asset>>) {
      adapter.updateOne(state, {
        id: action.payload.uuid!,
        changes: {
          ...action.payload,
          ...processInferenceData(action.payload.inferenceData),
        },
      });
    },

    add(state, action: PayloadAction<Asset>) {
      adapter.upsertOne(state, {
        ...action.payload,
        ...processInferenceData(action.payload.inferenceData),
        selected: false,
      });
    },

    addMany(state, action: PayloadAction<Asset[]>) {
      adapter.upsertMany(
        state,
        action.payload.map((asset) => ({
          ...asset,
          ...processInferenceData(asset.inferenceData),
          selected:
            state.selectedIds.find((id) => id === asset.uuid) !== undefined,
        }))
      );
    },

    addAll(state, action: PayloadAction<Asset[]>) {
      adapter.setAll(
        state,
        action.payload.map((asset) => ({
          ...asset,
          ...processInferenceData(asset.inferenceData),
          selected:
            state.selectedIds.find((id) => id === asset.uuid) !== undefined,
        }))
      );
    },

    replaceClips(state, action: PayloadAction<Clip[]>) {
      const asset = state.entities[action.payload[0].assetId];
      if (asset?.inferenceData) {
        asset.inferenceData.human.clips =
          action.payload.map(convertTimeToSeconds);
      }
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

    select(state, action: PayloadAction<{ id: string; selected: boolean }>) {
      const asset = state.entities[action.payload.id];

      if (asset) {
        asset.selected = action.payload.selected;

        if (action.payload.selected) {
          state.selectedIds.push(action.payload.id);
        } else {
          state.selectedIds = state.selectedIds.filter(
            (id) => id !== action.payload.id
          );
        }
      }
    },

    unSelectedAll(state) {
      Object.values(state.entities).forEach((asset) => {
        asset!.selected = false;
      });

      state.selectedIds = [];
    },

    addClip(state, action: PayloadAction<{ assetId: string; clip: Clip }>) {
      const asset = state.entities[action.payload.assetId];
      if (asset) {
        asset.inferenceData?.human.clips.push(
          convertTimeToSeconds(action.payload.clip)
        );
        asset.inferenceData?.human.clips.sort(
          (c1, c2) => c1.startTime - c2.startTime
        );
      }
    },

    updateClip(
      state,
      action: PayloadAction<{ id: string; assetId: string; clip: Clip }>
    ) {
      const asset = state.entities[action.payload.assetId];
      const clips = asset?.inferenceData?.human.clips;
      const index = clips?.findIndex((clip) => clip.uuid === action.payload.id);
      if (clips && index !== undefined && index !== -1) {
        clips[index] = {
          ...clips[index],
          ...convertTimeToSeconds(action.payload.clip),
          selected: action.payload.clip.selected === true,
        };
      }
    },

    addTimelineClip(
      state,
      action: PayloadAction<{
        clipId: string;
        assetId: string;
        clip: Shotstack.Clip;
      }>
    ) {
      const asset = state.entities[action.payload.assetId];
      const clips = asset?.inferenceData?.human.clips;
      const clip = clips?.find((clip) => clip.uuid === action.payload.clipId);
      const tracks = clip?.details?.currentTimeline?.timeline?.tracks;
      const track = tracks?.find(
        (track) => track.clips[0].asset.type === action.payload.clip.asset.type
      );

      track
        ? (track.clips[0] = action.payload.clip)
        : tracks?.push({ clips: [action.payload.clip] });
    },

    updateTimelineClip<T>(
      state,
      action: PayloadAction<{
        assetId: string;
        clipId?: string;
        sourceId?: string;
        clip?: Partial<Shotstack.Clip<T>>;
      }>
    ) {
      const asset = state.entities[action.payload.assetId];
      const clips = asset?.inferenceData?.human.clips;
      const clip = clips.find((clip) => clip.uuid === action.payload.clipId);
      const tracks = clip.details?.currentTimeline?.timeline?.tracks;
      const track = tracks?.find(
        (track) => track.clips[0].sources?.id === action.payload.sourceId
      );

      if (track) {
        track.clips[0] = {
          ...track.clips[0],
          ...action.payload.clip,
          asset: {
            ...track.clips[0].asset,
            ...action.payload.clip?.asset,
          },
          sources: {
            ...track.clips[0].sources,
            ...action.payload.clip?.sources,
          },
        };
      }
    },

    removeTimelineClip(
      state,
      action: PayloadAction<{
        assetId: string;
        clipId?: string;
        sourceId?: string;
      }>
    ) {
      const asset = state.entities[action.payload.assetId];
      const clips = asset?.inferenceData?.human.clips;
      const clip = clips?.find((clip) => clip.uuid === action.payload.clipId);
      const tracks = clip?.details?.currentTimeline?.timeline?.tracks;
      const index = tracks?.findIndex(
        (track) => track.clips[0].sources?.id === action.payload.sourceId
      );

      if (index !== undefined && index !== -1) {
        tracks?.splice(index, 1);
      }
    },

    selectClip(
      state,
      action: PayloadAction<{ assetId: string; clipId: string }>
    ) {
      const asset = state.entities[action.payload.assetId];
      const clips = asset?.inferenceData?.human.clips;
      const clip = clips?.find((clip) => clip.uuid === action.payload.clipId);
      if (clip) clip.selected = true;
    },

    selectFirstClip(state, action: PayloadAction<string>) {
      const asset = state.entities[action.payload];
      const clip = asset?.inferenceData?.human.clips[0];
      if (clip) clip.selected = true;
    },

    unSelectClip(state, action: PayloadAction<string>) {
      const asset = state.entities[action.payload];
      const clips = asset?.inferenceData?.human.clips;
      const clip = clips?.find((clip) => clip.selected);
      if (clip) clip.selected = false;
    },
  },
});

export function useAssets() {
  const dispatch = useAppDispatch();
  const getAssets = useGetAssets();
  const getAsset = useGetAsset();
  const getClips = useGetClips();
  const deleteAssets = useDeleteAssets();
  const updateTimeline = useUpdateTimeline();

  return useMemo(
    () => ({
      getAll() {
        return useAppSelector((state) => ({
          ...state.assets,
          entities: selectors.selectAll(state),
        }));
      },

      getById(id?: string) {
        if (id) {
          return useAppSelector((state) => selectors.selectById(state, id));
        }
      },

      areSelected() {
        return useAppSelector((state) => state.assets.selectedIds.length !== 0);
      },

      getSelectedIds() {
        return useAppSelector((state) => state.assets.selectedIds);
      },

      getClip(assetId: string) {
        return useAppSelector((state) => {
          const asset = state.assets.entities[assetId];
          const clips = asset?.inferenceData?.human.clips;
          return clips?.find((clip) => clip.selected);
        });
      },

      getTimelineVideo(assetId: string) {
        return useAppSelector((state) => {
          const asset = state.assets.entities[assetId];
          const clips = asset?.inferenceData?.human.clips;
          const clip = clips?.find((clip) => clip.selected);
          const tracks = clip?.details?.currentTimeline?.timeline?.tracks;
          const track = tracks?.find(
            (track) => track.clips[0].asset.type === "video"
          );
          return track?.clips[0];
        });
      },

      getTimelineAudio(assetId: string) {
        return useAppSelector((state) => {
          const asset = state.assets.entities[assetId];
          const clips = asset?.inferenceData?.human.clips;
          const clip = clips?.find((clip) => clip.selected);
          const tracks = clip?.details?.currentTimeline?.timeline?.tracks;
          const track = tracks?.find(
            (track) => track.clips[0].asset.type === "audio"
          );
          return track?.clips[0] as
            | Shotstack.Clip<Shotstack.AudioAsset>
            | undefined;
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

      addMany(assets: Asset[]) {
        dispatch(assetsSlice.actions.addMany(assets));
      },

      update(id: string, changes: Partial<Asset>) {
        dispatch(assetsSlice.actions.update({ uuid: id, ...changes }));
      },

      addClip(assetId: string, clip: Clip) {
        dispatch(assetsSlice.actions.addClip({ assetId, clip }));
      },

      updateClip(id: string, assetId: string, clip: Clip) {
        dispatch(assetsSlice.actions.updateClip({ id, assetId, clip }));
      },

      addTimelineClip(clipId: string, assetId: string, clip: Shotstack.Clip) {
        dispatch(
          assetsSlice.actions.addTimelineClip({ clipId, assetId, clip })
        );
        dispatch(syncTimeline(assetId, clipId, updateTimeline));
      },

      updateTimelineClip<T>(
        assetId: string,
        clipId?: string,
        sourceId?: string,
        clip?: Partial<Shotstack.Clip<T>>
      ) {
        dispatch(
          assetsSlice.actions.updateTimelineClip({
            assetId,
            clipId,
            sourceId,
            clip,
          })
        );
      },

      removeTimelineClip(assetId: string, clipId: string, sourceId: string) {
        dispatch(
          assetsSlice.actions.removeTimelineClip({ assetId, clipId, sourceId })
        );
        dispatch(syncTimeline(assetId, clipId, updateTimeline));
      },

      syncTimeline(assetId: string, clipId: string) {
        dispatch(syncTimeline(assetId, clipId, updateTimeline));
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

      async fetchClips(assetId: string, caption?: string) {
        const clips = await getClips({ caption });
        dispatch(assetsSlice.actions.replaceClips(clips));
      },

      async deleteOne(id: string) {
        dispatch(assetsSlice.actions.update({ uuid: id, status: "DELETING" }));
        await deleteAssets([id]);
      },

      async deleteMany(ids: string[]) {
        ids.forEach((uuid) =>
          dispatch(assetsSlice.actions.update({ uuid, status: "DELETING" }))
        );
        await deleteAssets(ids);
        dispatch(assetsSlice.actions.unSelectedAll());
      },
    }),
    []
  );
}

function processInferenceData(inferenceData: Asset["inferenceData"]) {
  if (inferenceData) {
    return {
      inferenceData: {
        human: {
          clips: inferenceData.human.clips.map(convertTimeToSeconds),
        },
      },
    };
  }
}

function convertTimeToSeconds(clip: Clip) {
  const _clip = {
    ...clip,
    startTime: toSeconds(clip.startTime as any),
    endTime: toSeconds(clip.endTime as any),
    duration: toSeconds(clip.duration as any),
    selected: false,
  };

  if (!_clip.details) {
    _clip.details = {
      currentTimeline: {
        container: {
          tracks: [],
        },
      },
    };
  }

  return _clip;
}

function syncTimeline(
  assetId: string,
  clipId: string,
  updateTimeline: ReturnType<typeof useUpdateTimeline>
) {
  return (_, getState: typeof store.getState) => {
    const state = getState();
    const asset = state.assets.entities[assetId];
    const clip = asset?.inferenceData?.human.clips.find(
      (clip) => clip.uuid === clipId
    );
    const timeline = clip?.details?.currentTimeline?.timeline;
    if (timeline) {
      updateTimeline(assetId, clipId, timeline);
    }
  };
}
