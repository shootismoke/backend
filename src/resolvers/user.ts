import { Resolvers, User as IUser } from '@shootismoke/graphql';

import { User } from '../models';
import { logger } from '../util';

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
    updateUser: async (
      _parent,
      { expoInstallationId, input }
    ): Promise<IUser> => {
      // FIXME Is there some faster way to do the below, with findOneAndUpdate?
      const user = await User.findOne({
        expoInstallationId
      });

      if (!user) {
        const e = new Error(
          `No user with expoInstallationId "${expoInstallationId}" found`
        );
        logger.error(e);
        throw e;
      }

      Object.assign(user, input);

      await user.save({ validateBeforeSave: true });

      return user;
    }
  }
};
