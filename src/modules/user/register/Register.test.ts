import { testConn } from "../../../test-utils/testConn";
import faker from "faker/locale/ko";
import { Connection } from "typeorm";
import { gCall } from "../../../test-utils/gCall";
import { User } from "../../../entity/User";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation register($data: RegisterInput!){
 register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Register", () => {
  it("create user", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });
    // console.log(response);
    // console.log(user);

    // response가 정의한 Object 형식과 일치하는지 확인한다.
    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    });

    // user가 undefined가 아닌지 확인한다.
    const dbUser = await User.findOne({ where: { email: user.email } });
    // console.log(dbUser);
    expect(dbUser).toBeDefined();
    expect(dbUser!.confirmed).toBeFalsy();
    expect(dbUser!.firstName).toBe(user.firstName);
  });
});
