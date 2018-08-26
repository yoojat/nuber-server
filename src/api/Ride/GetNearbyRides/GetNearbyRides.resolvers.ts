import { Between, getRepository } from "typeorm";
import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";
import { GetNearbyRidesResponse } from "../../../types/graph";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
  Query: {
    GetNearbyRides: privateResolver(
      async (_, __, { req }): Promise<GetNearbyRidesResponse> => {
        const user: User = req.user;
        // const {user} : {user:User}  = req;

        if (user.isDriving) {
          const { lastLat, lastLng } = user;
          //getRepository는 비교하는 작업을 위해서 사용 (Between 을 사용하기 위해)

          try {
            const rides = await getRepository(Ride).find({
              status: "REQUESTING",
              pickUpLat: Between(lastLat - 0.05, lastLat + 0.05), //user 마지막 위치의 0.05의 반경의 driver를 찾음
              pickUpLng: Between(lastLng - 0.05, lastLng - 0.05)
            });
            return {
              ok: true,
              error: null,
              rides
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rides: null
            };
          }
        } else {
          return {
            ok: false,
            error: "You are not a driver",
            rides: null
          };
        }
      }
    )
  }
};

export default resolvers;
