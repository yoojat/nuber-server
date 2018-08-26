import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";
import Chat from "../../../entities/Chat";

const resolvers = {
  Subscription: {
    MessageSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator("newChatMessage");
        },
        async (payload, _, { context }) => {
          //payload는 전달 되는 내용
          //두번째인자는 그렇게 신경 쓰지 않아도 됨
          //context는 app.ts의 context에서 전달되어 오는 내용
          const user: User = context.currentUser;
          //currentUser는 listening하고 있는 사용자(driver)
          const {
            MessageSubscription: { chatId }
          } = payload;
          try {
            const chat = await Chat.findOne({ id: chatId });
            if (chat) {
              return chat.driverId === user.id || chat.passengerId === user.id;
            } else {
              return false;
            }
          } catch (error) {
            return false; //filter function 이란 true, false만 반환하면 됨
          }
        }
      )
    }
  }
};
export default resolvers;
