import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("유저없음");
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      console.log("비밀번호 틀림");
      return null;
    }
    if (!user.confirmed) {
      console.log("메일로 컨펌을 받아라");
      return null;
    }

    // session userId에 user.id를 save 한다
    // session에 무언가를 넣고 싶을때
    ctx.req.session!.userId = user.id;

    return user;
  }
}
