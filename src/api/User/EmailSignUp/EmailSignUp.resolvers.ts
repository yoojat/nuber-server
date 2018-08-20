import { Resolvers } from "../../../types/resolver";
import {
  EmailSignUpMutationArgs,
  EmailSignUpResponse
} from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";
import Verification from "../../../entities/Verification";

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
          // 해당 계정이 없으면 새로 생성
          const newUser = await User.create({ ...args }).save();
          if (newUser.email) {
            //만약 mailgun 유료 계정을 사용하면다면 이 이메일주소인자로 주고 통해 보낼 수 있다
            //sendEmail(newUser.email, , ..)
            const emailVerification = await Verification.create({
              payload: newUser.email,
              target: "EMAIL"
            });
            //아직 인증되지 않은 verification 생성
          }

          const token = createJWT(newUser.id);
          return {
            ok: true,
            error: null,
            token
          };
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
