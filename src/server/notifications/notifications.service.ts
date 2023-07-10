import { Service } from "typedi";
import {
  IGetNotificationsArgs,
  INotification,
  NotificationStatus,
} from "../types/notifications.types";
import { NotificationsAPI } from "../api/notifications.api";
import { AuthInfo } from "../types/base.types";

@Service()
export class NotificationsService {
  constructor(private readonly notificationsAPI: NotificationsAPI) {}

  async getNotifications(
    authInfo: AuthInfo,
    args: IGetNotificationsArgs
  ): Promise<INotification[]> {
    return this.notificationsAPI.getNotifications({
      ...args,
      org: Number(authInfo.auth0.organization_id),
    });
  }

  async notificationRead(uuid: string): Promise<boolean> {
    await this.notificationsAPI.updateNotification({
      uuid: uuid,
      status: NotificationStatus.READ,
    });
    return true;
  }

  async readAllNotifications(authInfo: AuthInfo): Promise<boolean> {
    const org = Number(authInfo.auth0.organization_id);
    await this.notificationsAPI.readAllNotifications(org);
    return true;
  }
}
