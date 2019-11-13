import { aqiToRaw, getUnit, rawToAqi } from '@shootismoke/aqi/src';

import { NormalizedByGps } from '../types';
import { AqicnStation } from './validation';

/**
 * Normalize aqicn byGps data
 *
 * @param data - The data to normalize
 */
export function aqicnNormalizeByGps(data: AqicnStation): NormalizedByGps {
  const aqiUS = data.iaqi && data.iaqi.pm25 && data.iaqi.pm25.v;
  const raw = aqiUS && aqiToRaw('pm25', aqiUS, 'US');
  const aqiCN = raw && rawToAqi('pm25', raw, 'CN');

  return {
    pollutants: {
      pm25:
        aqiCN && aqiUS && raw
          ? { aqiCN, aqiUS, raw, unit: getUnit('pm25') }
          : undefined
    },
    stations: data.attributions.map(({ name }) => ({
      name,
      provider: 'waqi'
    }))
  };
}
