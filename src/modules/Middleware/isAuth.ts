import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session!.userId) {
    throw new Error("로그인 해주세요.");
  }
  return next();
};
