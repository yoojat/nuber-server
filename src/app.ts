import cors from "cors";
import { GraphQLServer } from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";

class App {
  public app: GraphQLServer;
  constructor() {
    this.app = new GraphQLServer({
      schema
    });
    this.middlewares();
  }

  private middlewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(logger("dev"));
    this.app.express.use(helmet());
    this.app.express.use(this.jwt);
  };

  //request headers로 부터 jwt를 받음
  private jwt = async (req, res, next): Promise<void> => {
    const token = req.get("X-JWT"); //X-JWT는 본인 마음대로 지으면 됨
    if (token) {
      const user = await decodeJWT(token);
      console.log(user);
    }
    next();
  };
}

export default new App().app;
