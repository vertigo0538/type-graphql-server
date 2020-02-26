import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";

export const logger: MiddlewareFn<MyContext> = ({ args }, next) => {
  console.log("args:", args);

  /* 다음함수를 실행해줌
   MiddlewareFn에 정의
   multi middelware라면 다음 middleware로 
   resolver라면 resolver를 실행
  */
  return next();
};
