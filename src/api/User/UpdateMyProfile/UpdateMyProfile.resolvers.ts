import User from "../../../entities/User";
import {
  UpdateMyProfileMutationArgs,
  UpdateMyProfileResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (
        _,
        args: UpdateMyProfileMutationArgs,
        { req }
      ): Promise<UpdateMyProfileResponse> => {
        const user: User = req.user;
        const notNull: any = {}; // 👈🏻 Add ':any'

        Object.keys(args).forEach(key => {
          if (args[key] !== null) {
            notNull[key] = args[key];
          }
        });
        //args에서 키를 가지고 오고 각 키에 해당되는 값이 null인지 검사하고
        //null이 아니면 notNull에 키와 함께 값을 집어넣는다
        //결론적으로 notNull에는 null인 값을 가진게 없다
        //null을 가진 것들은 제외 함

        if (notNull.password !== null) {
          // 👈🏻 Change from args to notNull
          user.password = notNull.password;
          user.save();
          delete notNull.password; //<--  ⚠️⚠️⚠️ Delete password  from notNull or is going to be saved again without encoding ⚠️⚠️⚠️
        }
        try {
          //@BeforeUpdate()구문을 실행하기 위해
          await User.update({ id: user.id }, { ...notNull });
          //update는 두가지 조건이 필요함
          //첫번쨰 인자는 어떤 걸 업데이트 할것인가
          //두번째 인자는 어떤 걸로 업데이트 할지인가
          //ex) id가 user.id User를 찾음
          //해당 args에 있는 것을 업데이트함
          return {
            ok: true,
            error: null
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message
          };
        }
      }
    )
  }
};

export default resolvers;
