import User from "../../../entities/User";
import { RequestEmailVerificationResponse } from "../../../types/graph";
import Verification from "../../../entities/Verification";
import { Resolvers } from "../../../types/resolver";
import privateResolver from "../../../utils/privateResolver";
import { sendVerificationEmail } from "../../../utils/sendEmail";

const resolvers: Resolvers = {
  Mutation: {
    RequestEmailVerification: privateResolver(
      // args가 필요없는 이유는 context의 req에서(user의 token) user를 받아올깃이기 때문
      async (_, __, { req }): Promise<RequestEmailVerificationResponse> => {
        const user: User = req.user;
        if (user.email && !user.verifiedEmail) {
          try {
            const oldVerfication = await Verification.findOne({
              payload: user.email
            });
            if (oldVerfication) {
              oldVerfication.remove();
            }
            const newVerification = await Verification.create({
              payload: user.email,
              target: "EMAIL"
            }).save();
            await sendVerificationEmail(user.fullName, newVerification.key);
            return {
              ok: true,
              error: null
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message
            };
          }
        } else {
          return {
            ok: false,
            error: "Your user has no email to verify"
          };
        }
      }
    )
  }
};

export default resolvers;
