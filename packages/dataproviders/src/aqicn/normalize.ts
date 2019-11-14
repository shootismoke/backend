import {
  aqiToRaw,
  getUnit,
  Pollutant,
  POLLUTANTS,
  rawToAqi
} from '@shootismoke/aqi/src';

import { pm25ToCigarettes } from '../secretSauce';
import { NormalizedByGps, PollutantValue } from '../types';
import { AqicnStation } from './validation';

/**
 * Normalize aqicn byGps data
 *
 * @param data - The data to normalize
 */
export function aqicnNormalizeByGps(data: AqicnStation): NormalizedByGps {
  const universalId = `waqi|${data.idx}`;

  if (!data.city.geo) {
    throw new Error(
      `Cannot normalizeByGps station ${universalId}: ${JSON.stringify(data)}`
    );
  }

  const iaqi = data.iaqi || {};
  const pm25AqiUS = iaqi.pm25 && iaqi.pm25.v;
  const pm25Raw = pm25AqiUS && aqiToRaw('pm25', pm25AqiUS, 'US');

  return {
    closestStation: {
      gps: { latitude: +data.city.geo[0], longitude: +data.city.geo[1] },
      name: data.attributions[0].name,
      provider: 'waqi',
      universalId
    },
    dailyCigarettes: pm25Raw && pm25ToCigarettes(pm25Raw),
    pollutants: POLLUTANTS.reduce(
      (result, pollutant) => {
        const value = iaqi[pollutant];
        if (!value) {
          return result;
        }

        const aqiUS = value.v;
        const raw = aqiToRaw('pm25', aqiUS, 'US');
        const aqiCN = rawToAqi('pm25', raw, 'CN');

        result[pollutant] = {
          // FIXME aqiCN, raw, and unit values are Wrong!!!
          // https://github.com/shootismoke/backend/issues/28
          aqiCN: pollutant === 'pm25' ? aqiCN : aqiUS,
          aqiUS,
          raw: pollutant === 'pm25' ? raw : aqiUS,
          unit: getUnit('pm25')
        };

        return result;
      },
      {} as Partial<Record<Pollutant, PollutantValue>>
    ),
    updatedAt: data.time.v
  };
}
