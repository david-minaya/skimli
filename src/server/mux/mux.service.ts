import Mux, {
  CreateAssetParams,
  CreateTrackParams,
  InputInfo,
  Track,
} from "@mux/mux-node";
import { Service } from "typedi";
import config from "../../config";
import { MuxError } from "../types/base.types";
import {
  IGetMuxThumbnailArgs,
  MuxCreateClipResponse,
  MuxSignedAsset,
} from "./mux.types";

const TOKEN_TYPE_VIDEO = "video";
const TOKEN_TYPE_THUMBNAIL = "thumbnail";
const TOKEN_TYPE_STORYBOARD = "storyboard";
const MUX_THUMBNAIL_BASE_URL = "https://image.mux.com";

@Service()
export class MuxService {
  private muxClient: Mux;

  constructor() {
    this.muxClient = new Mux(config.mux.muxToken, config.mux.muxSecretKey);
  }

  generateToken(playbackId: string, type: string): string {
    return Mux.JWT.signPlaybackId(playbackId, {
      keyId: config.mux.muxSigningKey,
      keySecret: config.mux.muxSigningSecret,
      type: type,
    });
  }

  generateTokens(playbackId: string): {
    video: string;
    thumbnail: string;
    storyboard: string;
  } {
    return {
      video: this.generateToken(playbackId, TOKEN_TYPE_VIDEO),
      thumbnail: this.generateToken(playbackId, TOKEN_TYPE_THUMBNAIL),
      storyboard: this.generateToken(playbackId, TOKEN_TYPE_STORYBOARD),
    };
  }

  async getMuxAsset(assetId: string): Promise<MuxSignedAsset | null> {
    try {
      const asset = await this.muxClient.Video.Assets.get(assetId);
      if (asset?.playback_ids!.length == 0) {
        return { asset: asset };
      }
      const playback = asset.playback_ids![0];
      const tokens = this.generateTokens(playback!.id);

      return { asset: asset, tokens: tokens };
    } catch (e) {
      console.error(e);
      throw new MuxError(e);
    }
  }

  async uploadAssetToMux(
    params: CreateAssetParams
  ): Promise<MuxCreateClipResponse> {
    try {
      const asset = await this.muxClient.Video.Assets.create({ ...params });
      return asset as MuxCreateClipResponse;
    } catch (e) {
      console.error(e);
      throw new MuxError(e);
    }
  }

  async getAssetInput(assetId: string): Promise<InputInfo[]> {
    try {
      const input = await this.muxClient.Video.Assets.inputInfo(assetId);
      return input;
    } catch (e) {
      console.error(e);
      throw new MuxError(e);
    }
  }

  async getThumbnail(playbackId: string, params: IGetMuxThumbnailArgs) {
    const token = Mux.JWT.signPlaybackId(playbackId, {
      keyId: config.mux.muxSigningKey,
      keySecret: config.mux.muxSigningSecret,
      type: "thumbnail" as const,
      params: params as any,
    });
    return `${MUX_THUMBNAIL_BASE_URL}/${playbackId}/thumbnail.png?token=${token}`;
  }

  async createTextTrack(
    assetId: string,
    params: CreateTrackParams
  ): Promise<Track> {
    try {
      const track = await this.muxClient.Video.Assets.createTrack(
        assetId,
        params
      );
      return track;
    } catch (e) {
      console.error(e);
      throw new MuxError(e);
    }
  }
}
