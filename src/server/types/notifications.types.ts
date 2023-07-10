export enum NotificationStatus {
  READ = "READ",
  UNREAD = "UNREAD",
}

export interface INotification {
  uuid: string;
  status: NotificationStatus;
  message: string;
  userId: string;
  videoAssetId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetNotificationsArgs {
  org: number;
  status?: NotificationStatus;
  videoAssetId?: string;
}

export interface IUpdateNotificationArgs {
  status?: NotificationStatus;
  uuid: string;
}
