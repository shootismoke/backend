import axios from 'axios';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';

import { LatLng } from '../types';
import { decodeWith, promiseToTE } from '../util';
import { WaqiStation, WaqiStationCodec } from './validation';

/**
 * Fetch the closest station to the user's current position. Uses waqi.
 * @see https://wind.waqi.info/
 *
 * @param gps - Latitude and longitude of the user's current position
 */
export function waqiByGps(gps: LatLng): TE.TaskEither<Error, WaqiStation> {
  const { latitude, longitude } = gps;

  return pipe(
    promiseToTE(() =>
      axios
        .get(
          `https://wind.waqi.info/mapq/nearest?geo=1/${latitude}/${longitude}`
        )
        .then(({ data }) => data)
    ),
    TE.chain(decodeWith(WaqiStationCodec))
  );
}
