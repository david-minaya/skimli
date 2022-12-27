import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class UpdateNicknameArgs {
  @Field(() => String)
  @MaxLength(64)
  @IsString()
  @IsNotEmpty()
  nickname: string;
}

@ArgsType()
export class ResetPasswordArgs {
  @Field(() => String)
  @IsEmail()
  email: string;
}
