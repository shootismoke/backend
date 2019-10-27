import { User } from '../models';

export const historyResolvers = {
  Mutation: {
    // eslint-disable-next-line
    addHistory: async (_parent: any, data: any): Promise<boolean> => {
      const user = await User.findById(data.userId);

      if (!user) {
        throw new Error(`Cannot find user with id ${data.userId}`);
      }

      user.history.push(data);
      await user.save();

      // FIXME We should return the User with its full history, but only once
      // we decide to actually expose the history on User
      return true;
    }
  }
};
