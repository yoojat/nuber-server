import { Resolvers } from "../../../types/resolver";
import {
  EmailSignUpMutationArgs,
  EmailSignUpResponse
} from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";
import Verification from "../../../entities/Verification";
import { sendVerificationEmail } from "../../../utils/sendEmail";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
    ): Promise<EmailSignUpResponse> => {
      const { email } = args;
      try {
        //해당 email을 가지고 있는 계정 확인
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          // 해당 email을 가지고 있는 계정이 있다면 로그인해야된다고 알려줌
          return {
            ok: false,
            error: "You should log in instead",
            token: null
          };
        } else {
          //해당 메일로 된 계정이 없다면 phoneVerification을 확인
          const phoneVerification = await Verification.findOne({
            payload: args.phoneNumber,
            verified: true
          });
          if (phoneVerification) {
            //인증된 phoneVerification이 있다면
            // 해당 계정이 없으므로 새로 생성
            const newUser = await User.create({ ...args }).save();
            if (newUser.email) {
              //만약 mailgun 유료 계정을 사용하면다면 이 이메일주소인자로 주고 통해 보낼 수 있다
              //sendEmail(newUser.email, , ..)
              const emailVerification = await Verification.create({
                payload: newUser.email,
                target: "EMAIL"
              }).save();
              await sendVerificationEmail(
                newUser.fullName,
                emailVerification.key
              );
            }

            const token = createJWT(newUser.id);
            return {
              ok: true,
              error: null,
              token
            };
          } else {
            //phoneVerification이 없을경우
            return {
              ok: false,
              error: "You haven't verified your phone number",
              token: null
            };
          }
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null
        };
      }
    }
  }
};

export default resolvers;
