import {
  HistoryItem as IHistoryItem,
  Resolvers,
  User as IUser
} from '@shootismoke/graphql/src/types';

import { HistoryItem, User } from '../models';

export const userResolvers: Resolvers = {
  Mutation: {
    createUser: async (_parent, { input }): Promise<IUser> => {
      let user = await User.findOne({
        expoInstallationId: input.expoInstallationId
      });

      if (!user) {
        user = new User(input);
        await user.save();
      }

      return user;
    },
    updateUser: async (_parent, { userId, input }): Promise<IUser> => {
      // TODO Is there some faster way to do the below, with findOneAndUpdate?
      const user = await User.findById(userId);

      if (!user) {
        throw new Error(`No user with id ${userId} found`);
      }

      Object.assign(user, input);

      await user.save({ validateBeforeSave: true });

      return user;
    }
  },
  User: {
    history: async (user: IUser): Promise<IHistoryItem[]> => {
      // FIXME For now, we don't expose the history of each user, for privacy
      // reasons. Think it through.
      if (process.env.NODE_ENV === 'production') {
        return [];
      }

      return HistoryItem.find({
        userId: user._id
      });
    }
  }
};
