import 'isomorphic-fetch';

import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import { failure } from 'io-ts/lib/PathReporter';

import { promiseToTE } from '../util';
import { WaqiStation, WaqiStationCodec } from './validation';

export * from './validation';

interface LatLng {
  latitude: number;
  longitude: number;
}

export function waqiByGps(gps: LatLng): TE.TaskEither<Error, WaqiStation> {
  const { latitude, longitude } = gps;

  return pipe(
    promiseToTE(() =>
      fetch(
        `https://wind.waqi.info/mapq/nearest?geo=1/${latitude}/${longitude}`
      ).then(response => response.json())
    ),
    TE.chain(response =>
      TE.fromEither(
        pipe(
          WaqiStationCodec.decode(response),
          E.mapLeft(errors => new Error(failure(errors).join('\n')))
        )
      )
    )
  );
}
