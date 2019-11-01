import fetch from 'node-fetch';

import { HistoryItem, Station } from '../models';

/**
 * Fetch a station name from WAQI, and create a station in DB
 */
// eslint-disable-next-line
async function createStation(providerId: string, provider: string, id: string) {
  const response = await fetch(
    `https://api.waqi.info/feed/@${id}/?token=${process.env.WAQI_TOKEN}`
  );
  const { data, status } = await response.json();

  if (status === 'error') {
    throw new Error(`WAQI Error ${providerId}: ${data}`);
  }

  if (
    !data.attributions ||
    !data.attributions.length ||
    !data.attributions[0] ||
    !data.attributions[0].name
  ) {
    throw new Error(
      `WAQI Error ${providerId}: Response does not contain station name`
    );
  }

  return Station.create({
    name: data.attributions[0].name,
    provider,
    providerId
  });
}

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
        station = await createStation(providerId, provider, id);
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
