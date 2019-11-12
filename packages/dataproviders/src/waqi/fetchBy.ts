import 'isomorphic-fetch';

import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';

import { LatLng } from '../types';
import { decodeWith, promiseToTE } from '../util';
import { WaqiStation, WaqiStationCodec } from './validation';

export function waqiByGps(gps: LatLng): TE.TaskEither<Error, WaqiStation> {
  const { latitude, longitude } = gps;

  return pipe(
    promiseToTE(() =>
      fetch(
        `https://wind.waqi.info/mapq/nearest?geo=1/${latitude}/${longitude}`
      ).then(response => response.json())
    ),
    TE.chain(decodeWith(WaqiStationCodec))
  );
}
