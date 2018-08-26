import { Resolvers } from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";
import {
  ReportMovementMutationArgs,
  ReportMovementResponse
} from "../../../types/graph";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";

// 드라이버가 위치를 보고하면 ReportMovement함수가 실행되고
// ReportMovement함수는 결과물을 driverUpdate채널에 전송
// withFilter함수에 payload가 들어오고 방금 위치를 보고한 사용자(user(driver) 객체)가 전성됨
const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: privateResolver(
      async (
        _,
        args: ReportMovementMutationArgs,
        { req, pubSub }
      ): Promise<ReportMovementResponse> => {
        const user: User = req.user;
        const notNull = cleanNullArgs(args);
        try {
          await User.update({ id: user.id }, { ...notNull }); //이 코드를 업데이트된 user를 리턴하지 않음
          //존재여부는 신경쓰지 않음
          const updatedUser = await User.findOne({ id: user.id }); // updated된 유저
          pubSub.publish("driverUpdate", { DriversSubscription: updatedUser });
          //payload에 subscription의 이름과 같아야 됨, DriversSubscription 이름 다르지 않게 주의
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
