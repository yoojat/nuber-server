import jwt from "jsonwebtoken";
import User from "../entities/User";

// jwt는 user의 id를 가지고 있음
// user가 존재하지 않으면 undefined를 리턴
// jwt.verify를 통해서 decoding작업 진행
// .evn파일에 있는 JWT_TOKEN 이용
const decodeJWT = async (token: string): Promise<User | undefined> => {
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_TOKEN || "");
    const { id } = decoded;
    const user = await User.findOne({ id });
    return user;
  } catch (error) {
    return undefined;
  }
};

export default decodeJWT;
