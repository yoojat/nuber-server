import { SayHelloResponse, SayHelloQueryArgs } from "../../../types/graph";

const resolvers = {
  Query: {
    sayHello: (_, args: SayHelloQueryArgs): SayHelloResponse => {
      return {
        error: false,
        text: `hello ${args.name}`
      };
    }
  }
};

export default resolvers;
