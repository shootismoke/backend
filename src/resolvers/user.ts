import { History, User, UserType, HistoryType } from '../models';

export const userResolvers = {
  Query: {
    // eslint-disable-next-line
    user: async (_parent: any, { id }: any): Promise<UserType | null> => {
      const user = await User.findById(id).populate('history');
      return user;
    }
  },
  Mutation: {
    // eslint-disable-next-line
    getOrCreateUser: async (
      _parent: any,
      data: any
    ): Promise<UserType | null> => {
      // Select the users collection from the database
      const user = await User.findOneAndUpdate(
        {
          expoInstallationId: data.expoInstallationId
        },
        {
          // $push: {
          //   history: { $each: data.history }
          // },
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

      if (Array.isArray(data.history)) {
        // FIXME insertMany returns the wrong type: T instead of T[]
        const b = ((await History.insertMany(
          data.history.map((h: HistoryType) => ({ ...h, userId: user._id }))
        )) as unknown) as HistoryType[];
      }

      return User.findById(user._id).populate('author');
    }
  }
};
