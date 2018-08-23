import { Between, getRepository } from "typeorm";
import User from "../../../entities/User";
import { GetNearbyDriversResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetNearbyDrivers: privateResolver(
      async (_, __, { req }): Promise<GetNearbyDriversResponse> => {
        const user: User = req.user;
        const { lastLat, lastLng } = user;
        try {
          //TypeORM 구현과 Entity를 통한 구현 두가지 방식이 있음
          //Between을 쓰기 위해서는 getRepository를 불러와야됨
          const drivers: User[] = await getRepository(User).find({
            isDriving: true,
            lastLat: Between(lastLat - 0.05, lastLat + 0.05), //user 마지막 위치의 0.05의 반경의 driver를 찾음
            lastLng: Between(lastLng - 0.05, lastLng - 0.05)
          });
          return {
            ok: true,
            error: null,
            drivers
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            drivers: null
          };
        }
      }
    )
  }
};

export default resolvers;
