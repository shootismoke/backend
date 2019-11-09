import { NowRequest, NowResponse } from '@now/node';
import { aqicnStation } from '@shootismoke/dataproviders/src/aqicn';
import { array } from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';

import { HistoryItem } from '../../src/models';
import { connectToDatabase } from '../../src/util';
import { aggregation } from './aggregation';

export default async function push(
  _req: NowRequest,
  res: NowResponse
): Promise<void> {
  try {
    await connectToDatabase();

    const items = await HistoryItem.aggregate(aggregation);

    const tasks = Array.from(
      new Set(items.map(({ universalId }) => universalId))
    ).map(aqicnStation);
    const responses = await array.sequence(T.task)(tasks)();

    const correct = responses.filter(E.isRight).map(e =>
      E.fold(
        () => {
          throw new Error('We already filtered isRight. qed.');
        },
        r => r
      )(e)
    );

    res.status(200).json([items, correct]);
  } catch (error) {
    res.status(400).send(error.message);
  }
}
