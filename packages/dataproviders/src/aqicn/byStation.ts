import 'isomorphic-fetch';

import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';

import { decodeWith, promiseToTE } from '../util';
import { AqicnStation, AqicnStationCodec } from './validation';

export * from './validation';

export function aqicnByStation(
  stationId: string
): TE.TaskEither<Error, AqicnStation> {
  return pipe(
    promiseToTE(() =>
      fetch(
        `https://api.waqi.info/feed/@${stationId}/?token=${process.env.WAQI_TOKEN}`
      ).then(response => response.json())
    ),
    TE.chain(decodeWith(AqicnStationCodec)),
    TE.chain(({ status, data }) =>
      status === 'ok'
        ? TE.right(data as AqicnStation)
        : TE.left(new Error(data as string))
    )
  );
}
