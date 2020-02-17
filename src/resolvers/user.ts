import { Resolvers, User as IUser } from '@shootismoke/graphql';
import assignDeep from 'assign-deep';

import { PushTicket, User } from '../models';
import { ApolloContext, logger } from '../util';

/**
 * Assert that this endpoint is protected by Hawk.
 */
function assertHawkAuthenticated(context: ApolloContext): void {
  if (context.isHawkAuthenticated !== true) {
    throw new Error(context.isHawkAuthenticated);
  }
}

/**
 * Assert that we have a user.
 */
function assertUser(
  user: IUser | null,
  expoInstallationId: string
): asserts user is IUser {
  if (!user) {
    const e = new Error(
      `No user with expoInstallationId "${expoInstallationId}" found`
    );
    logger.error(e);
    throw e;
  }
}

export const userResolvers: Resolvers<ApolloContext> = {
  Query: {
    getUser: async (
      _parent,
      { expoInstallationId },
      context
    ): Promise<IUser> => {
      assertHawkAuthenticated(context);

      const user = await User.findOne({ expoInstallationId });
      assertUser(user, expoInstallationId);

      return user;
    }
  },
  Mutation: {
    createUser: async (_parent, { input }, context): Promise<IUser> => {
      assertHawkAuthenticated(context);

      const user = new User(input);
      await user.save();

      return user;
    },
    // @ts-ignore
    getOrCreateUser: async (_parent, { input }, context): Promise<IUser> => {
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
      assertUser(user, expoInstallationId);

      assignDeep(user, input);

      const newUser = await user.save({ validateBeforeSave: true });

      // Everytime we update user, we also delete all the pushTickets he/she
      // might have.
      await PushTicket.deleteMany({
        userId: user._id
      });

      return newUser;
    }
  }
};
