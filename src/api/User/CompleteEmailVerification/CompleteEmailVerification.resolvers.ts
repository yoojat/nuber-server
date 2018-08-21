import { Resolvers } from "../../../types/resolver";
import User from "../../../entities/User";
import privateResolver from "../../../utils/privateResolver";
import {
  CompleteEmailVerificationMutationArgs,
  CompleteEmailVerificationResponse
} from "../../../types/graph";
import Verification from "../../../entities/Verification";

const resolvers: Resolvers = {
  Mutation: {
    //privateResolver를 통해 user가 없는 경우를 방자
    CompleteEmailVerification: privateResolver(
      //parent 인자는 신경쓸 필요 없음
      async (
        _,
        args: CompleteEmailVerificationMutationArgs,
        { req }
      ): Promise<CompleteEmailVerificationResponse> => {
        const user: User = req.user;
        const { key } = args;
        if (user.email) {
          try {
            const verification = await Verification.findOne({
              key,
              payload: user.email
            });
            if (verification) {
              user.verifiedEmail = true;
              user.save();
              return {
                ok: true,
                error: null
              };
            } else {
              return {
                ok: false,
                error: "Cant verify email"
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
            error: "No email to verify"
          };
        }
      }
    )
  }
};

export default resolvers;
