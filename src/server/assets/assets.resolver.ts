import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql";
import { Service } from "typedi";
import pubSub from "../common/pubsub";
import { IsAppUserGuard } from "../middlewares/app-user.guard";
import type { GraphQLContext } from "../schema";
import { AuthInfo } from "../types/base.types";
import {
  AbortUploadArgs,
  CompleteUploadArgs,
  GetPartUploadURLArgs,
  StartUploadArgs,
} from "./assets.args";
import { ASSET_UPLOAD_EVENT } from "./assets.constants";
import { AssetsService } from "./assets.service";
import {
  AssetStatus,
  AssetUploadResponse,
  AssetUploads,
  GetPartUploadResponse,
  StartUploadResponse,
} from "./assets.types";

@Service()
@Resolver()
export class AssetsResolver {
  constructor(private readonly uploadsService: AssetsService) {}

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => StartUploadResponse)
  async startUpload(
    @Ctx() ctx: GraphQLContext,
    @Args() args: StartUploadArgs
  ): Promise<StartUploadResponse> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.uploadsService.startUpload(authInfo, args);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => GetPartUploadResponse)
  async getPartUploadURL(
    @Args() args: GetPartUploadURLArgs
  ): Promise<GetPartUploadResponse> {
    return this.uploadsService.getPartUploadURL(args);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Boolean)
  async completeUpload(@Args() args: CompleteUploadArgs): Promise<Boolean> {
    await this.uploadsService.completeUpload(args);
    return true;
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Boolean)
  async abortUpload(@Args() args: AbortUploadArgs): Promise<Boolean> {
    await this.uploadsService.abortUpload(args);
    return true;
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Subscription(() => AssetUploadResponse, {
    topics: ASSET_UPLOAD_EVENT,
    filter: ({
      payload,
      context,
    }: {
      payload: AssetUploads;
      context: GraphQLContext;
    }) => {
      return context?.auth0?.organization_id == payload?.org;
    },
  })
  async assetUploads(
    @Root() assetUpload: AssetUploadResponse
  ): Promise<AssetUploadResponse> {
    return assetUpload;
  }

  // TODO: remove after supporting subscriptions on infrastructure
  @Query(() => Boolean)
  async testAssetUpload(@Arg("org") org: string) {
    await pubSub.publish("assetUploads", {
      assetId: Math.floor(Math.random() * 10000).toString(),
      status: AssetStatus.CONVERTING,
      org: org,
    });
    return true;
  }
}
