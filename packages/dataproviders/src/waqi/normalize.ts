import { aqiToRaw, getUnit, rawToAqi } from '@shootismoke/aqi/src';

import { pm25ToCigarettes } from '../secretSauce';
import { NormalizedByGps } from '../types';
import { WaqiStation } from './validation';

/**
 * Normalize aqicn byGps data
 *
 * @param data - The data to normalize
 */
export function waqiNormalizeByGps({
  d: [data]
}: WaqiStation): NormalizedByGps {
  const aqiUS = +data.x;
  const raw = aqiToRaw('pm25', aqiUS, 'US');
  const aqiCN = rawToAqi('pm25', raw, 'CN');

  return {
    dailyCigarettes: pm25ToCigarettes(raw),
    pollutants:
      // Only cater for pm25 for now
      // FIXME Cater for other pollutants too
      data.pol === 'pm25'
        ? {
            pm25: { aqiCN, aqiUS, raw, unit: getUnit('pm25') }
          }
        : {},
    stations: [{ name: data.nlo, provider: 'waqi' }]
  };
}
