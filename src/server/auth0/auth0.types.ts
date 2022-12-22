import type { JobStatus } from "auth0";
import { IsString } from "class-validator";
import { Field, GraphQLISODateTime, ObjectType } from "type-graphql";

@ObjectType()
export class ResendVerificationEmailResponse {
  @Field(() => String)
  id: string;

  @Field(() => String)
  status: JobStatus;
}

@ObjectType()
export class UserLogResponse {
  @Field(() => Boolean, { nullable: true })
  isMobile?: boolean;

  @Field(() => String, { nullable: true })
  userAgent?: string;

  @Field(() => String, { nullable: true })
  ip?: string;

  @Field(() => String, { nullable: true })
  eventType?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date;
}
