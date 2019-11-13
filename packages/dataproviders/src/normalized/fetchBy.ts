import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';

import { aqicnByGps, aqicnNormalizeByGps } from '../aqicn';
import { LatLng, NormalizedByGps } from '../types';
import { waqiByGps, waqiNormalizeByGps } from '../waqi';

/**
 * Fetch data parallely from difference data sources, and normalize the
 * responses into one single response
 *
 * @param gps - The GPS coordinates to fetch data for
 */
export function normalizedByGps(
  gps: LatLng
): TE.TaskEither<Error, NormalizedByGps> {
  // Run these tasks parallely
  const tasks = [
    pipe(
      aqicnByGps(gps),
      TE.map(aqicnNormalizeByGps)
    ),
    pipe(
      waqiByGps(gps),
      TE.map(waqiNormalizeByGps)
    )
  ];

  return pipe(
    A.array.sequence(TE.taskEither)(tasks),
    // Attempt to merge responses from all data providers
    TE.map(([aqicn, waqi]) => ({
      ...waqi,
      ...aqicn,
      pollutants: {
        ...waqi.pollutants,
        ...aqicn.pollutants,
        pm25: aqicn.pollutants.pm25 || waqi.pollutants.pm25
      }
    }))
  );
}
