import Chat from "../../../entities/Chat";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";
import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { req, pubSub }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;

        // UpdateRideStatus를 실행할 수 있는 사람은 driver
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (args.status === "ACCEPTED") {
              //driver가 ACCEPT를 할떄만 실행됨
              ride = await Ride.findOne(
                {
                  //status가 REQUESTING인 Ride를 찾음
                  //ride를 수락하려면, 그 ride의 기존 상태는 REQUESTING이어야 됨
                  id: args.rideId,
                  status: "REQUESTING"
                },
                { relations: ["passenger"] }
                //passenger정보가 같이 담아서 전달됨
              );
              //ride의 status가 REQUESTING이라면 driver가 없는 상태
              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
                await Chat.create({
                  driver: user,
                  passenger: ride.passenger
                }).save();
                // driver는 ride를 수락한 유저로, passenger는 ride에 함께 전달된 passenger로
              }
            } else {
              // 나머지 요청(ONROUTE, CANCLED, PICKEDUP 등등)에 대해서도 수행함
              // 요청한 유저가 driver인 ride만 찾음
              // 다른 driver의 것을 수정하면 안되니까
              ride = await Ride.findOne({
                id: args.rideId,
                driver: user
              });
            }

            //여기서부터 ride 업데이트 로직
            if (ride) {
              ride.status = args.status;
              ride.save();
              pubSub.publish("rideUpdate", { RideStatusSubscription: ride });
              return {
                ok: true,
                error: null
              };
            } else {
              return {
                ok: false,
                error: "Can't update ride"
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message
            };
          }
        } else {
          return {
            ok: false,
            error: "You ar not driving"
          };
        }
      }
    )
  }
};

export default resolvers;
