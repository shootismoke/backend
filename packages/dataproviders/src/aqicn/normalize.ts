import { aqiToRaw, getUnit, rawToAqi } from '@shootismoke/aqi/src';

import { pm25ToCigarettes } from '../secretSauce';
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

  const universalId = `waqi|${data.idx}`;

  if (!data.city.geo) {
    throw new Error(
      `Cannot normalizeByGps station ${universalId}: ${JSON.stringify(data)}`
    );
  }

  return {
    closestStation: {
      gps: { latitude: +data.city.geo[0], longitude: +data.city.geo[1] },
      name: data.attributions[0].name,
      provider: 'waqi',
      universalId
    },
    dailyCigarettes: raw && pm25ToCigarettes(raw),
    pollutants: {
      pm25:
        aqiCN && aqiUS && raw
          ? { aqiCN, aqiUS, raw, unit: getUnit('pm25') }
          : undefined
    },
    updatedAt: data.time.v
  };
}
