import { HistoryItem } from '../models';

export const historyItemResolvers = {
  Mutation: {
    createHistoryItem: async (
      // eslint-disable-next-line
      _parent: any,
      // eslint-disable-next-line
      { input }: any
    ): Promise<boolean> => {
      await HistoryItem.create(input);

      return true;
    }
  }
};
