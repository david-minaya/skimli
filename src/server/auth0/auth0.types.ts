import type { JobStatus } from "auth0";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ResendVerificationEmailResponse {
  @Field(() => String)
  id: string;

  @Field(() => String)
  status: JobStatus;
}
