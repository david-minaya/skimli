import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { ArgsType, Field } from "type-graphql";
import {
  IGetNotificationsArgs,
  NotificationStatus,
} from "../types/notifications.types";

@ArgsType()
export class NotificationReadArgs {
  @Field(() => String)
  @IsUUID()
  uuid: string;
}

@ArgsType()
export class GetNotificationsArgs implements IGetNotificationsArgs {
  // @Field(() => String)
  // @IsUUID()
  // temp field to satisfy interface
  uuid: string;

  // temp field to satisfy interface
  org: number;

  @Field(() => NotificationStatus, { nullable: true })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;
}
