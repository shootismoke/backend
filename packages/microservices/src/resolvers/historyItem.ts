import { aqicnByStation } from '@shootismoke/dataproviders/src';
import { Resolvers, Station as IStation } from '@shootismoke/graphql/src';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { Document } from 'mongoose';

import { HistoryItem, Station } from '../models';

/**
 * Fetch a station name from WAQI, and create a station in DB
 */
async function createStation(
  universalId: string,
  provider: string,
  id: string
): Promise<IStation & Document> {
  const data = await pipe(
    aqicnByStation(id),
    TE.fold(error => {
      throw new Error(`WAQI Error ${universalId}: ${error.message}`);
    }, T.of)
  )();

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
