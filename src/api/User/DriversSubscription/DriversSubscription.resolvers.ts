import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
  Subscription: {
    DriversSubscription: {
      //withFilter를 이용하면 payload를 받아서 이 palyload가 사용자에게 전달될지 선택할 수 있음
      //withFilter의 첫번째 함수는 asyncIterator, 두번째는 filter함수
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator("driverUpdate");
        },
        (payload, _, { context }) => {
          //payload는 전달 되는 내용
          //두번째인자는 그렇게 신경 쓰지 않아도 됨
          //context는 app.ts의 context에서 전달되어 오는 내용
          const user: User = context.currentUser;
          //currentUser는 listening하고 있는 사용자
          const {
            DriversSubscription: {
              lastLat: driverLastLat,
              lastLng: driverLastLng
            }
          } = payload;
          const { lastLat: userLastLat, lastLng: userLastLng } = user;

          return (
            driverLastLat >= userLastLat - 0.05 &&
            driverLastLat <= userLastLat + 0.05 &&
            driverLastLng >= userLastLng - 0.05 &&
            driverLastLng <= userLastLng + 0.05
          );

          // return false;
          // return false;
          //return false;로 한다면 어떠한 업데이트도 받지 않음
        }
      )
    }
  }
};
export default resolvers;
