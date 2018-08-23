import Place from "../../../entities/Place";
import User from "../../../entities/User";
import { EditPlaceMutationArgs, EditPlaceResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
  Mutation: {
    EditPlace: privateResolver(
      async (
        _,
        args: EditPlaceMutationArgs,
        { req }
      ): Promise<EditPlaceResponse> => {
        const user: User = req.user;
        try {
          //   const place = await Place.findOne({ id: args.placeId },{relations:["user"]}); // user relationship을 불러옴(그런데 이렇게 하면 user정보를 다 불러옴)
          const place = await Place.findOne({ id: args.placeId }); //typeORM에 userId Column을 넣어줌으로써 user의 id만 불러올수 있음

          if (place) {
            if (place.userId === user.id) {
              //권한이 있는지 확인
              const notNull = cleanNullArgs(args);
              await Place.update({ id: args.placeId }, { ...notNull });
              return {
                ok: true,
                error: null
              };
            } else {
              return {
                ok: false,
                error: "Not Authorized"
              };
            }
          } else {
            return {
              ok: false,
              error: "Plae not found"
            };
          }
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
