import * as M from 'fp-ts/lib/Monoid';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

import { aqicnByGps, aqicnNormalizeByGps, AqicnOptions } from '../aqicn';
import { LatLng, NormalizedByGps } from '../types';
import { waqiByGps, waqiNormalizeByGps } from '../waqi';

export interface NormalizedOptions {
  aqicn: AqicnOptions;
}

/**
 * Fetch data parallely from difference data sources, and normalize the
 * responses into one single response
 *
 * @param gps - The GPS coordinates to fetch data for
 */
export function normalizedByGps(
  gps: LatLng,
  options: NormalizedOptions
): TE.TaskEither<Error, NormalizedByGps> {
  // Run these tasks parallely
  const tasks = [
    pipe(
      aqicnByGps(gps, options.aqicn),
      TE.map(aqicnNormalizeByGps)
    ),
    pipe(
      waqiByGps(gps),
      TE.map(waqiNormalizeByGps)
    )
  ];

  // Return a race behavior between the tasks
  return pipe(
    tasks,
    M.fold(T.getRaceMonoid())
  );
}
