import fetch from 'node-fetch';

import { HistoryItem, Station } from '../models';

export const historyItemResolvers = {
  Mutation: {
    createHistoryItem: async (
      // eslint-disable-next-line
      _parent: any,
      // eslint-disable-next-line
      { input }: any
    ): Promise<boolean> => {
      const { providerId } = input;
      const [provider, id] = providerId.split('|');

      if (provider !== 'waqi' || !id) {
        throw new Error('Only `waqi` provider is supported for now');
      }

      let station = await Station.findOne({
        providerId
      });

      if (!station) {
        console.log(
          `https://api.waqi.info/feed/@${id}/?token=${process.env.WAQI_TOKEN}`
        );
        const response = await fetch(
          `https://api.waqi.info/feed/@${id}/?token=${process.env.WAQI_TOKEN}`
        );
        const { data, status } = await response.json();

        if (status === 'error') {
          throw new Error(`WAQI Error ${providerId}: ${data}`);
        }

        station = await Station.create({
          name: 'ABC',
          provider,
          providerId
        });
      }

      await HistoryItem.create({
        rawPm25: input.rawPm25,
        stationId: station._id,
        userId: input.userId
      });

      return true;
    }
  }
};
