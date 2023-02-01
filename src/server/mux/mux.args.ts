import { IsNotEmpty, IsString } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class GetMuxAssetArgs {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  assetId: string;
}
