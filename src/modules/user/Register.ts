import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Authorized,
  UseMiddleware
} from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { logger } from "../Middleware/logger";
import { isAuth } from "../Middleware/isAuth";
import { sendMail } from "../utils/sendMail";
import { createConfirmUrl } from "../utils/createConfirmUrl";

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  // @Authorized()
  @UseMiddleware(isAuth, logger)
  async hello() {
    return "hello world";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { firstName, lastName, email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();
    await sendMail(email, await createConfirmUrl(user.id));
    return user;
  }
}
