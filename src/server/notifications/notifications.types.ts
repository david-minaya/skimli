import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
  INotification,
  NotificationStatus,
} from "../types/notifications.types";

registerEnumType(NotificationStatus, {
  name: "NotificationStatus",
  description: "status of notification",
});

@ObjectType()
export class Notification implements INotification {
  @Field(() => String)
  uuid: string;

  @Field(() => NotificationStatus)
  status: NotificationStatus;

  @Field(() => String)
  message: string;

  // not exposing this field
  // @Field(() => String)
  userId: string;

  @Field(() => String)
  videoAssetId: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
