import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
  Subscription: {
    NearbyRideSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator("riedRequest");
        },
        (payload, _, { context }) => {
          //payload는 전달 되는 내용
          //두번째인자는 그렇게 신경 쓰지 않아도 됨
          //context는 app.ts의 context에서 전달되어 오는 내용
          const user: User = context.currentUser;
          //currentUser는 listening하고 있는 사용자(driver)
          const {
            NearbyRdieSubscription: { pickUpLat, pickUpLng }
          } = payload;
          const { lastLat: userLastLat, lastLng: userLastLng } = user; //여기서 user는 driver

          return (
            pickUpLat >= userLastLat - 0.05 &&
            pickUpLat <= userLastLat + 0.05 &&
            pickUpLng >= userLastLng - 0.05 &&
            pickUpLng <= userLastLng + 0.05
          );
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
