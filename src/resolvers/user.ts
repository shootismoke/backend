import { User, UserType } from '../models';

export const userResolvers = {
  Query: {
    // eslint-disable-next-line
    user: async (_parent: any, { id }: any): Promise<UserType | null> => {
      return User.findById(id);
    }
  },
  Mutation: {
    // eslint-disable-next-line
    createOrGetUser: async (_parent: any, data: any): Promise<UserType> => {
      // Select the users collection from the database
      const currentUser = await User.findOneAndUpdate(
        {
          expoInstallationId: data.expoInstallationId
        },

        // Create a new document if none exists
        {
          $setOnInsert: {
            expoInstallationId: data.expoInstallationId,
            expoPushToken: data.expoPushToken
          }
        },
        { new: true, runValidators: true, upsert: true }
      );

      return currentUser;
    }
  }
};
