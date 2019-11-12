import { aqiToRaw, rawToAqi } from '@shootismoke/aqi/src';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';

import { aqicnByStation } from './aqicn';

export interface AqiInfo {
  aqiCn: number;
  aqiUs: number;
  raw: number;
}

/**
 * Get the raw concentration, US AQI and CN AQI of a pollutant at a particular
 * station
 *
 * @param universalId - The station's universalId
 */
export function getAqi(universalId: string): TE.TaskEither<Error, AqiInfo> {
  const [provider, stationId] = universalId.split('|');

  switch (provider) {
    case 'waqi': {
      return pipe(
        aqicnByStation(stationId),
        TE.chain(({ iaqi }) =>
          iaqi && iaqi.pm25
            ? TE.right(iaqi.pm25.v)
            : TE.left(new Error('iaqi not defined in response'))
        ),
        TE.map(aqi => {
          const raw = aqiToRaw('pm25', aqi);

          return {
            raw,
            aqiCn: rawToAqi('pm25', raw, 'CN'),
            aqiUs: aqi
          };
        })
      );
    }
    default: {
      return TE.left(new Error(`Provider ${provider} is not recognized`));
    }
  }
}
