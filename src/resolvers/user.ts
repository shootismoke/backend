import { History, User, UserType, HistoryType } from '../models';

export const userResolvers = {
  Query: {
    // eslint-disable-next-line
    user: async (_parent: any, { id }: any): Promise<UserType | null> => {
      const user = await User.findById(id);
      return user;
    }
  },
  Mutation: {
    createUser: async (
      // eslint-disable-next-line
      _parent: any,
      // eslint-disable-next-line
      { input }: any
    ): Promise<UserType> => {
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
      // eslint-disable-next-line
      _parent: any,
      // eslint-disable-next-line
      { expoInstallationId, input }: any
    ): Promise<UserType> => {
      // TODO Is there some faster way to do the below, with findOneAndUpdate?
      const user = await User.findOne({
        expoInstallationId: expoInstallationId
      });

      if (!user) {
        throw new Error(`No user with id ${expoInstallationId} found`);
      }

      Object.assign(user, input);

      await user.save({ validateBeforeSave: true });

      return user;
    }
  },
  User: {
    history: async (user: UserType): Promise<HistoryType[]> => {
      // FIXME For now, we don't expose the history of each user, for privacy
      // reasons. Think it through.
      if (process.env.NODE_ENV === 'production') {
        return [];
      }

      return History.find({
        userId: user._id
      });
    }
  }
};
