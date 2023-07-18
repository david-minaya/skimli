import {
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Service } from "typedi";
import { NotificationsService } from "./notifications.service";
import { Notification } from "./notifications.types";
import { IsAppUserGuard } from "../middlewares/app-user.guard";
import { AuthInfo } from "../types/base.types";
import type { GraphQLContext } from "../schema";
import {
  GetNotificationsArgs,
  NotificationReadArgs,
} from "./notifications.args";
import { Asset } from "../videos/videos.types";
import { VideosService } from "../videos/videos.service";

@Resolver(() => Notification)
@Service()
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly videosService: VideosService
  ) {}

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @FieldResolver(() => Asset, { nullable: true })
  async videoAsset(
    @Ctx() ctx: GraphQLContext,
    @Root() root: Notification
  ): Promise<Asset | null> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    try {
      const asset = await this.videosService.getAsset(
        authInfo,
        root.videoAssetId
      );
      return asset;
    } catch (e) {
      return null;
    }
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Query(() => [Notification])
  async notifications(
    @Ctx() ctx: GraphQLContext,
    @Args() args: GetNotificationsArgs
  ): Promise<Notification[]> {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.notificationsService.getNotifications(authInfo, args);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Boolean)
  async notificationRead(@Args() args: NotificationReadArgs): Promise<boolean> {
    return this.notificationsService.notificationRead(args.uuid);
  }

  @UseMiddleware(IsAppUserGuard)
  @Authorized()
  @Mutation(() => Boolean)
  async readAllNotifications(@Ctx() ctx: GraphQLContext) {
    const authInfo: AuthInfo = {
      auth0: ctx?.auth0,
      token: ctx?.token,
    };
    return this.notificationsService.readAllNotifications(authInfo);
  }
}
