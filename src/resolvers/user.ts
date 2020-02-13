import { Resolvers, User as IUser } from '@shootismoke/graphql';

import { PushTicket, User } from '../models';
import { ApolloContext, logger } from '../util';

function assertHawkAuthenticated(context: ApolloContext): void {
  if (context.isHawkAuthenticated !== true) {
    throw new Error(context.isHawkAuthenticated);
  }
}

export const userResolvers: Resolvers<ApolloContext> = {
  Mutation: {
    createUser: async (_parent, { input }, context): Promise<IUser> => {
      assertHawkAuthenticated(context);

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
      { expoInstallationId, input },
      context
    ): Promise<IUser> => {
      assertHawkAuthenticated(context);

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

      // Everytime we update user, we also delete all the pushTickets he/she
      // might have.
      await PushTicket.deleteMany({
        userId: user._id
      });

      return user;
    }
  }
};
