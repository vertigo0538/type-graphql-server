import { MinLength } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class PasswordInput {
  @Field()
  @MinLength(10, { message: "10글자 이상 입력해" })
  password: string;
}
