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
    getOrCreateUser: async (
      // eslint-disable-next-line
      _parent: any,
      // eslint-disable-next-line
      data: any
    ): Promise<UserType | null> => {
      const user = await User.findOneAndUpdate(
        {
          expoInstallationId: data.expoInstallationId
        },
        {
          // Create a new document if none exists
          $setOnInsert: {
            expoInstallationId: data.expoInstallationId,
            expoPushToken: data.expoPushToken
          }
        },
        {
          new: true,
          runValidators: true,
          upsert: true
        }
      );

      // TODO Can we not do this ?
      if (data.expoPushToken) {
        user.expoPushToken = data.expoPushToken;
        await user.save();
      }

      if (Array.isArray(data.history)) {
        await History.insertMany(
          data.history.map((h: HistoryType) => ({ ...h, userId: user._id }))
        );
      }

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
