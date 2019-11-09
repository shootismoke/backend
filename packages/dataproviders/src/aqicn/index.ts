import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import { failure } from 'io-ts/lib/PathReporter';

import { promiseToTE } from '../util';
import { AqiCnStation, AqiCnStationCodec } from './validation';

export function aqicnStation(
  stationId: string
): TE.TaskEither<Error, AqiCnStation> {
  return pipe(
    promiseToTE(() =>
      fetch(
        `https://api.waqi.info/feed/@${stationId}/?token=${process.env.WAQI_TOKEN}`
      ).then(response => response.json())
    ),
    TE.chain(response =>
      TE.fromEither(
        pipe(
          AqiCnStationCodec.decode(response),
          E.mapLeft(errors => new Error(failure(errors).join('\n')))
        )
      )
    )
  );
}
