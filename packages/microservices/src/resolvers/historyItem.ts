import { Resolvers, Station as IStation } from '@shootismoke/graphql';
import { Document } from 'mongoose';
import fetch from 'node-fetch';

import { HistoryItem, Station } from '../models';

/**
 * Fetch a station name from WAQI, and create a station in DB
 */
async function createStation(
  universalId: string,
  provider: string,
  id: string
): Promise<IStation & Document> {
  const response = await fetch(
    `https://api.waqi.info/feed/@${id}/?token=${process.env.WAQI_TOKEN}`
  );
  const { data, status } = await response.json();

  if (status === 'error') {
    throw new Error(`WAQI Error ${universalId}: ${data}`);
  }

  if (
    !data.attributions ||
    !data.attributions.length ||
    !data.attributions[0] ||
    !data.attributions[0].name
  ) {
    throw new Error(
      `WAQI Error ${universalId}: Response does not contain station name`
    );
  }

  return Station.create({
    name: data.attributions[0].name,
    provider,
    universalId
  });
}

export const historyItemResolvers: Resolvers = {
  Mutation: {
    createHistoryItem: async (_parent, { input }): Promise<boolean> => {
      const { universalId } = input;
      const [provider, id] = universalId.split('|');

      if (provider !== 'waqi' || !id) {
        throw new Error('Only `waqi` provider is supported for now');
      }

      let station = await Station.findOne({
        universalId
      });

      if (!station) {
        station = await createStation(universalId, provider, id);
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
