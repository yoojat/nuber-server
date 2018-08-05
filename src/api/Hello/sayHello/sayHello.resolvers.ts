import { Greeting } from "../../../types/graph";

const resolvers = {
  Query: {
    sayHello: (): Greeting => {
      return {
        error: false,
        text: "iloveyou"
      };
    }
  }
};

export default resolvers;
