import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";
import { GetRideQueryArgs, GetRideResponse } from "../../../types/graph";

const resolvers: Resolvers = {
  Query: {
    GetRide: privateResolver(
      async (_, args: GetRideQueryArgs, { req }): Promise<GetRideResponse> => {
        const user: User = req.user;

        try {
          const ride = await Ride.findOne(
            {
              id: args.rideId
            },
            { relations: ["passenger", "driver"] }
          );
          //ride를 가지고 올때 passenger, driver객체가 추가되어서 같이 로드
          //relations가 없으면 passenger는 undefined

          if (ride) {
            if (ride.passengerId === user.id || ride.driverId === user.id) {
              return {
                ok: true,
                error: null,
                ride
              };
            } else {
              return {
                ok: false,
                error: "Not Authorized",
                ride: null
              };
            }
          } else {
            return {
              ok: false,
              error: "Ride not found",
              ride: null
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            ride: null
          };
        }
      }
    )
  }
};

export default resolvers;
