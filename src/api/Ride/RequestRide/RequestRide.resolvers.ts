import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import {
  RequestRideMutationArgs,
  RequestRideResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";

//유저가 사용하는 곳
const resolvers: Resolvers = {
  Mutation: {
    RequestRide: privateResolver(
      async (
        _,
        args: RequestRideMutationArgs,
        { req, pubSub }
      ): Promise<RequestRideResponse> => {
        const user: User = req.user;
        user.isRiding = false;
        user.save();
        if (!user.isRiding && !user.isDriving) {
          //유저가 riding이 아닐때만 요청할 수 있음
          try {
            const ride = await Ride.create({ ...args, passenger: user }).save();
            pubSub.publish("rideRequest", { NearbyRideSubscription: ride });
            user.isRiding = true; // ride를 요청하자마자 isRiding은 true로 변경
            user.save();
            //payload의 이름은 subscription의 이름과 같아야됨
            return {
              ok: true,
              error: null,
              ride
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              ride: null
            };
          }
        } else {
          return {
            ok: false,
            error: "You can't request tow rides or driver and request",
            ride: null
          };
        }
      }
    )
  }
};

export default resolvers;
