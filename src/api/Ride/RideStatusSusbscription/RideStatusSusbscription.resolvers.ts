import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
  Subscription: {
    RideStatusSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator("rideUpdate"); //채널에 변경사항들을 푸쉬
        },
        (payload, _, { context }) => {
          //payload는 전달 되는 내용
          //두번째인자는 그렇게 신경 쓰지 않아도 됨
          //context는 app.ts의 context에서 전달되어 오는 내용
          const user: User = context.currentUser;
          //currentUser는 listening하고 있는 사용자(driver)
          const {
            RideStatusSubscription: { driverId, passengerId }
          } = payload;
          //payload에는 driverId와 passengerId가 담겨서 전송
          //driverId 혹은 passengerId가 subscription을 리스닝중인 유저라면
          //subscription 통해 퍼블리시를 줄수 있음
          return user.id === driverId || user.id === passengerId;
          // 요청하는 사람들의 픽업 위치가 드라이버 근처라면 true를 리턴

          // return false;
          // return false;
          //return false;로 한다면 어떠한 업데이트도 받지 않음
        }
      )
    }
  }
};

export default resolvers;
